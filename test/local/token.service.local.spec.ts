import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { TokenService } from '@/services/token/token.service';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { Chain } from '@/entities/chain';
import { JsonRpcProvider } from 'ethers';

describe('TokenService Local', () => {
  let service: TokenService;
  let rpc: RpcProvider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local'],
        }),
      ],
      providers: [
        {
          provide: RpcProvider,
          useFactory: (cfg: ConfigService) => {
            const real = new RpcProvider(cfg);
            jest
              .spyOn(real, 'getProvider')
              .mockImplementation((chain: Chain) => {
                const url = process.env[`RPC_${chain.toUpperCase()}`];
                if (!url)
                  throw new Error(`Test: RPC_${chain.toUpperCase()} not set`);
                return new JsonRpcProvider(url);
              });

            jest.spyOn(real, 'getMulticallAddress').mockImplementation(() => {
              if (!process.env.MULTICALL_ADDRESS)
                throw new Error('Test: MULTICALL_ADDRESS not set');
              return process.env.MULTICALL_ADDRESS!;
            });

            return real;
          },
          inject: [ConfigService],
        },
        TokenService,
      ],
    }).compile();

    service = module.get(TokenService);
    rpc = module.get(RpcProvider);
  });

  it('should throw BadRequestException for empty address', async () => {
    await expect(service.fetchTokenData('')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should fetch USDT token data from Ethereum mainnet', async () => {
    const tokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // local token addres
    const data = await service.fetchTokenData(tokenAddress);

    expect(data.tokenAddress).toBe(tokenAddress);
    expect(data.symbol).toBe('MTK');
    expect(data.name).toBe('MyToken');
    expect(data.decimals).toBe(18);
    expect(data.chain).toBe(Chain.Ethereum || Chain.Polygon || Chain.Binance);
  }, 10000);
});

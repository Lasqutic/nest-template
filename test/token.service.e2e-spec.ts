import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { TokenService } from '@/services/token/token.service';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { Chain } from '@/entities/chain';
import { JsonRpcProvider } from 'ethers';

describe('TokenService E2E - USDT on Ethereum/Polygon/Binance', () => {
  let service: TokenService;
  let rpc: RpcProvider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env'],
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
    const tokenAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT Ethereum
    const data = await service.fetchTokenData(tokenAddress);

    expect(data.tokenAddress).toBe(tokenAddress);
    expect(data.symbol).toBe('USDT');
    expect(data.name).toBe('Tether USD');
    expect(data.decimals).toBe(6);
    expect(data.chain).toBe(Chain.Ethereum);
  }, 10000);

  it('should fetch USDT token data from Polygon mainnet', async () => {
    const tokenAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'; // USDT Polygon
    const data = await service.fetchTokenData(tokenAddress);

    expect(data.tokenAddress).toBe(tokenAddress);
    expect(data.symbol).toBe('USDT');
    expect(data.name).toBe('(PoS) Tether USD');
    expect(data.decimals).toBe(6);
    expect(data.chain).toBe(Chain.Polygon);
  }, 10000);

  it('should fetch USDT token data from Binance mainnet', async () => {
    const tokenAddress = '0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc'; // USDT Binance
    const data = await service.fetchTokenData(tokenAddress);

    expect(data.tokenAddress).toBe(tokenAddress);
    expect(data.symbol).toBe('USDT');
    expect(data.name).toBe('Tether USD');
    expect(data.decimals).toBe(6);
    expect(data.chain).toBe(Chain.Binance);
  }, 10000);
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@/services/token/token.service';
import * as ethers from 'ethers';
import { Interface } from 'ethers';
import { SHORT_ERC20_ABI } from '@/abis/shortErc20Abi';
import { TokenData } from '@/contracts/token/token-service.contract';

describe('TokenService', () => {
  let service: TokenService;
  let config: Partial<ConfigService>;
  const erc20Interface = new Interface(SHORT_ERC20_ABI);

  beforeEach(async () => {
    config = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'RPC_URL') return 'https://rpc';
        if (key === 'MULTICALL_ADDRESS') return 'Multicall';
      }),
    } as Partial<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, { provide: ConfigService, useValue: config }],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('fetchTokenData returns correct shape', async () => {
    const testAddress = '0xTokenAddress';

    const fakeResult = [
      {
        returnData: erc20Interface.encodeFunctionResult('symbol', ['FOO']),
        success: true,
      },
      {
        returnData: erc20Interface.encodeFunctionResult('name', ['Bar Token']),
        success: true,
      },
      {
        returnData: erc20Interface.encodeFunctionResult('decimals', [8]),
        success: true,
      },
    ];

    jest.spyOn(ethers, 'Contract').mockImplementation(
      (_address: string, _abi: any, _provider: any) =>
        ({
          aggregate3: () => Promise.resolve(fakeResult),
        }) as any,
    );

    const data: TokenData = await service.fetchTokenData(testAddress);

    expect(data).toEqual({
      tokenAddress: testAddress,
      symbol: 'FOO',
      name: 'Bar Token',
      decimals: 8,
    });
  });
});

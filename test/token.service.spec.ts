import { Interface, Contract } from 'ethers';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@/services/token/token.service';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { shortErc20Abi } from '@/abis/shortErc20.abi';
import { Chain } from '@/entities/chain';

jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');
  return {
    ...original,
    Contract: jest.fn(),
  };
});

describe('TokenService', () => {
  let service: TokenService;
  let rpc: RpcProvider;
  const tokenAddress = '0xToken';
  const iface = new Interface(shortErc20Abi);

  beforeEach(async () => {
    rpc = { getProvider: jest.fn(), getMulticallAddress: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, { provide: RpcProvider, useValue: rpc }],
    }).compile();
    service = module.get(TokenService);
  });

  it('should throw if address is empty', async () => {
    await expect(service.fetchTokenData('')).rejects.toThrow(
      'address is required',
    );
  });

  it('should return token data when multicall succeeds', async () => {
    const symbol = 'TKN';
    const name = 'Token';
    const decimals = 18;
    const returnData = [
      iface.encodeFunctionResult('symbol', [symbol]),
      iface.encodeFunctionResult('name', [name]),
      iface.encodeFunctionResult('decimals', [decimals]),
    ];

    const mockMulticall = {
      aggregate3: jest
        .fn()
        .mockResolvedValue(returnData.map((data) => ({ returnData: data }))),
    };
    (Contract as jest.Mock).mockImplementation(() => mockMulticall);

    rpc.getProvider = jest.fn().mockReturnValue({} as any);
    rpc.getMulticallAddress = jest.fn().mockReturnValue('0xMulti');

    const result = await service.fetchTokenData(tokenAddress);

    expect(Contract).toHaveBeenCalled();
    expect(mockMulticall.aggregate3).toHaveBeenCalled();
    expect(result).toMatchObject({ tokenAddress, symbol, name, decimals });
    expect(Object.values(Chain)).toContain(result.chain);
  });

  it('should throw if all chains fail', async () => {
    const mockMulticall = {
      aggregate3: jest.fn().mockRejectedValue(new Error()),
    };
    (Contract as jest.Mock).mockImplementation(() => mockMulticall);
    rpc.getProvider = jest.fn().mockReturnValue({} as any);
    rpc.getMulticallAddress = jest.fn().mockReturnValue('0xMulti');

    await expect(service.fetchTokenData(tokenAddress)).rejects.toThrow(
      'Token not found',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from '@/apis/token/token.controller';
import {
  ITokenService,
  TOKEN_SERVICE,
  TokenData,
} from '@/contracts/token/token-service.contract';

describe('TokenController)', () => {
  let controller: TokenController;

  const mockService: ITokenService = {
    fetchTokenData: jest.fn().mockImplementation((address: string) =>
      Promise.resolve({
        tokenAddress: address,
        symbol: 'SYM',
        name: 'Name',
        decimals: 8,
      } as TokenData),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [{ provide: TOKEN_SERVICE, useValue: mockService }],
    }).compile();

    controller = module.get<TokenController>(TokenController);
  });

  it('should return data from service', async () => {
    const testAddress = '0xA0B';
    const result = await controller.getToken(testAddress);

    expect(result).toEqual({
      tokenAddress: testAddress,
      symbol: 'SYM',
      name: 'Name',
      decimals: 8,
    });
    expect(mockService.fetchTokenData).toHaveBeenCalledWith(testAddress);
  });
});

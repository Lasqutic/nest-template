import { BadRequestException } from '@nestjs/common';
import { Contract } from 'ethers';
import { AaveService } from '@/services/analytics/aave.service';

describe('AaveService', () => {
  let service: AaveService;
  const ray = 10n ** 27n;
  const mockReserveData = {
    currentLiquidityRate: 2n * ray,
    currentVariableBorrowRate: (75n * ray) / 100n,
    __deprecatedStableBorrowRate: (50n * ray) / 100n,
  };

  beforeEach(() => {
    service = new AaveService({ getProvider: jest.fn() } as any);
  });

  it('correctly calculates APR values', async () => {
    (service as any).poolContract = {
      getReserveData: jest.fn().mockResolvedValue(mockReserveData),
    } as unknown as Contract;

    const result = await service.getApr({ marketAddress: '0x123' });
    expect(result).toEqual({
      supplyAPR: 200,
      variableBorrowAPR: 75,
      stableBorrowAPR: 50,
    });
  });

  it('throws BadRequestException if poolContract not initialized', async () => {
    (service as any).poolContract = undefined;
    await expect(
      service.getApr({ marketAddress: '0x123' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

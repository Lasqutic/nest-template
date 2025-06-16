import { AnalyticsService } from '@/services/analytics/analytics.service';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { ethers } from 'ethers';

describe('AnalyticsService simple APR', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    const mockRpcProvider: Partial<RpcProvider> = {
      getProvider: jest.fn().mockReturnValue({} as any),
    };
    service = new AnalyticsService(mockRpcProvider as RpcProvider);

    jest.spyOn(ethers, 'Contract').mockImplementation(
      () =>
        ({
          getUtilization: async () => 500_000_000_000_000_000n, // 0.5 * 1e18
          getSupplyRate: async () => 10_000_000_000_000_000n,
          getBorrowRate: async () => 20_000_000_000_000_000n,
        }) as any,
    );
  });

  it('Returns a simple APR Compound V3', async () => {
    const { supplyAPR, borrowAPR } = await service.getApr({
      marketAddress: '0x123',
    });

    const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

    expect(supplyAPR).toBeCloseTo(0.01 * SECONDS_PER_YEAR * 100);

    expect(borrowAPR).toBeCloseTo(0.02 * SECONDS_PER_YEAR * 100);
  });
});

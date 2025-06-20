import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from '@/apis/analytics/analytics.controller';
import { AnalyticsService } from '@/services/analytics/analytics.service';
import { AaveService } from '@/services/analytics/aave.service';
import { GetAprDto } from '@/apis/analytics/dto/get-apr.dto';
import { Chain } from '@/entities/chain';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: AnalyticsService;
  let aaveService: AaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: { getApr: jest.fn() },
        },
        {
          provide: AaveService,
          useValue: { getApr: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    aaveService = module.get<AaveService>(AaveService);
  });

  it('should call analytics.getApr with correct params on compound endpoint', async () => {
    const dto: GetAprDto = { marketAddress: '0xAbc' };
    const mockResult = { supplyAPR: 1232, borrowAPR: 1245 };
    jest.spyOn(analyticsService, 'getApr').mockResolvedValue(mockResult);

    const response = await controller.getCompoundApr(dto);

    expect(analyticsService.getApr).toHaveBeenCalledWith(dto, Chain.Ethereum);
    expect(response).toBe(mockResult);
  });

  it('should call aave.getApr with correct params on aave endpoint', async () => {
    const dto: GetAprDto = { marketAddress: '0xAav' };
    const mockResult = {
      supplyAPR: 123,
      variableBorrowAPR: 234,
      stableBorrowAPR: 22,
    };
    jest.spyOn(aaveService, 'getApr').mockResolvedValue(mockResult as any);

    const response = await controller.getAaveApr(dto);

    expect(aaveService.getApr).toHaveBeenCalledWith(dto, Chain.Ethereum);
    expect(response).toBe(mockResult);
  });
});

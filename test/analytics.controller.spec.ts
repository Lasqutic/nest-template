import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from '@/apis/analytics/analytics.controller';
import { AnalyticsService } from '@/services/analytics/analytics.service';
import { GetAprDto } from '@/apis/analytics/dto/get-apr.dto';
import { Chain } from '@/entities/chain';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            getApr: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('Calls service.getApr with the correct parameters', async () => {
    const dto: GetAprDto = { marketAddress: '0xAbc' };
    const mockResult = { supplyAPR: 1232, borrowAPR: 1245 };
    (service.getApr as jest.Mock).mockResolvedValue(mockResult);

    const response = await controller.getApr(dto);

    expect(service.getApr).toHaveBeenCalledWith(dto, Chain.Ethereum);
    expect(response).toBe(mockResult);
  });
});

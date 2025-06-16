import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '@/services/analytics/analytics.service';
import { Chain } from '@/entities/chain';
import { GetAprDto } from './dto/get-apr.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('apr')
  async getApr(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    dto: GetAprDto,
  ) {
    return this.analytics.getApr(dto, Chain.Ethereum);
  }
}

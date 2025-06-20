import { Module } from '@nestjs/common';
import { AnalyticsController } from '@/apis/analytics/analytics.controller';
import { AnalyticsModule } from '@/services/analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  controllers: [AnalyticsController],
})
export class AnalyticsApiModule {}

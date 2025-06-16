import { Module } from '@nestjs/common';
import { AnalyticsService } from '@/services/analytics/analytics.service';
import { RpcModule } from '@/services/rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

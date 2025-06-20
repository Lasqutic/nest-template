import { Module } from '@nestjs/common';
import { AnalyticsService } from '@/services/analytics/analytics.service';
import { RpcModule } from '@/services/rpc/rpc.module';
import { AaveService } from './aave.service';

@Module({
  imports: [RpcModule],
  providers: [AnalyticsService, AaveService],
  exports: [AnalyticsService, AaveService],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, staticConfig } from '@/config';
import { HealthApi } from './apis/health';
import { TokenApiModule } from './apis/token/token.module';
import { AnalyticsApiModule } from '@/apis/analytics/analytics.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: staticConfig.logLevel,
      },
    }),
    ConfigModule,
    HealthApi,
    TokenApiModule,
    AnalyticsApiModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TOKEN_SERVICE } from '@/contracts/token/token-service.contract';

@Module({
  providers: [
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
  ],
  exports: [TOKEN_SERVICE],
})
export class TokenModule {}

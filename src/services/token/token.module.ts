import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TOKEN_SERVICE } from '@/contracts/token/token-service.contract';
import { RpcModule } from '@/services/rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
  ],
  exports: [TOKEN_SERVICE],
})
export class TokenModule {}

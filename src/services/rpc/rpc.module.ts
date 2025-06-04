import { Module } from '@nestjs/common';
import { RpcProvider } from './rpc.provider';

@Module({
  providers: [RpcProvider],
  exports: [RpcProvider],
})
export class RpcModule {}

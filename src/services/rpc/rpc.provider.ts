import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from 'ethers';
import { Chain } from '@/entities/chain';

@Injectable()
export class RpcProvider {
  constructor(private cfg: ConfigService) {}

  getProvider(chain: Chain): JsonRpcProvider {
    const url = this.cfg.get<string>(`rpc.${chain}`);
    if (!url) throw new Error(`RPC URL for ${chain} not set`);
    return new JsonRpcProvider(url);
  }

  getMulticallAddress(multicallAddress: string): string {
    return this.cfg.getOrThrow(multicallAddress);
  }
}

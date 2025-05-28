import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, Contract, Interface } from 'ethers';
import { SHORT_ERC20_ABI } from '@/abis/shortErc20Abi';
import { SHORT_MULTICALL_ABI } from '@/abis/shortMulticallAbi';
import {
  ITokenService,
  TokenData,
} from '@/contracts/token/token-service.contract';

@Injectable()
export class TokenService implements ITokenService {
  private provider: JsonRpcProvider;
  private erc20Iface: Interface;
  private multicallIface: Interface;
  private multicallAddress: string;

  constructor(private config: ConfigService) {
    const rpcUrl = this.config.getOrThrow('RPC_URL');
    this.multicallAddress = this.config.getOrThrow('MULTICALL_ADDRESS');
    this.provider = new JsonRpcProvider(rpcUrl);
    this.erc20Iface = new Interface(SHORT_ERC20_ABI);
    this.multicallIface = new Interface(SHORT_MULTICALL_ABI);
  }
  async fetchTokenData(tokenAddress: string): Promise<TokenData> {
    if (!tokenAddress) throw new BadRequestException('address is required');
    const calls = ['symbol', 'name', 'decimals'].map((fn) => ({
      target: tokenAddress,
      allowFailure: false,
      callData: this.erc20Iface.encodeFunctionData(fn, []),
    }));

    const multicall = new Contract(
      this.multicallAddress,
      this.multicallIface,
      this.provider,
    );

    const results = await multicall.aggregate3(calls);

    const [symbol] = this.erc20Iface.decodeFunctionResult(
      'symbol',
      results[0].returnData,
    );
    const [name] = this.erc20Iface.decodeFunctionResult(
      'name',
      results[1].returnData,
    );
    const [decimals] = this.erc20Iface.decodeFunctionResult(
      'decimals',
      results[2].returnData,
    );

    return {
      tokenAddress,
      symbol,
      name,
      decimals: Number(decimals),
    };
  }
}

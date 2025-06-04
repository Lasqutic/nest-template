import { Injectable, BadRequestException } from '@nestjs/common';
import { Contract, Interface } from 'ethers';
import { shortErc20Abi } from '@/abis/shortErc20.abi';
import { shortMulticallAbi } from '@/abis/shortMulticall.abi';
import {
  ITokenService,
  TokenData,
} from '@/contracts/token/token-service.contract';
import { RpcProvider } from '../rpc/rpc.provider';
import { Chain } from '@/entities/chain';

@Injectable()
export class TokenService implements ITokenService {
  private erc20Iface: Interface;
  private multicallIface: Interface;

  constructor(private readonly rpc: RpcProvider) {
    this.erc20Iface = new Interface(shortErc20Abi);
    this.multicallIface = new Interface(shortMulticallAbi);
  }

  async fetchTokenData(address: string): Promise<TokenData> {
    if (!address) {
      throw new BadRequestException('address is required');
    }

    const calls = ['symbol', 'name', 'decimals'].map((fn) => ({
      target: address,
      allowFailure: false,
      callData: this.erc20Iface.encodeFunctionData(fn, []),
    }));

    const tasks = Object.values(Chain).map(async (chain) => {
      const provider = this.rpc.getProvider(chain);
      const multicallAddress =
        this.rpc.getMulticallAddress('MULTICALL_ADDRESS');
      const multicall = new Contract(
        multicallAddress,
        this.multicallIface,
        provider,
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
        tokenAddress: address,
        symbol,
        name,
        decimals: Number(decimals),
        chain,
      };
    });

    try {
      const result = await Promise.any(tasks);
      return result;
    } catch (e) {
      throw new BadRequestException('Token not found in any supported chain');
    }
  }
}

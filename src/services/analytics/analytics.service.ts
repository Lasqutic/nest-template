import { Injectable } from '@nestjs/common';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { Chain } from '@/entities/chain';
import { ethers } from 'ethers';
import { shortCometAbi } from '@/abis/shortComet.abi';

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

function toNumber(bn: ethers.BigNumberish, decimals = 18): number {
  return parseFloat(ethers.formatUnits(bn, decimals));
}

@Injectable()
export class AnalyticsService {
  constructor(private rpc: RpcProvider) {}

  async getApr(
    dto: { marketAddress: string },
    chain: Chain = Chain.Ethereum,
  ): Promise<{ supplyAPR: number; borrowAPR: number }> {
    const provider = this.rpc.getProvider(chain);
    const contract = new ethers.Contract(
      dto.marketAddress,
      shortCometAbi,
      provider,
    );
    const utilizationBN = await contract.getUtilization();

    const [supplyRateBN, borrowRateBN] = await Promise.all([
      contract.getSupplyRate(utilizationBN),
      contract.getBorrowRate(utilizationBN),
    ]);

    const supplyRatePerSecond = toNumber(supplyRateBN);
    const borrowRatePerSecond = toNumber(borrowRateBN);

    const supplyAPR = supplyRatePerSecond * SECONDS_PER_YEAR * 100;
    const borrowAPR = borrowRatePerSecond * SECONDS_PER_YEAR * 100;

    return { supplyAPR, borrowAPR };
  }
}

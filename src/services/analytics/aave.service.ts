import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { RpcProvider } from '@/services/rpc/rpc.provider';
import { Chain } from '@/entities/chain';
import { Contract, ethers } from 'ethers';
import { PoolAddressesProviderABI } from '@/abis/poolAddressesProvider.abi';
import { aavePoolAbi } from '@/abis/aavePool.abi';

const POOL_ADDRESSES_PROVIDER_ADDRESS =
  '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e';

@Injectable()
export class AaveService implements OnModuleInit {
  private poolContract?: Contract;

  constructor(private readonly rpc: RpcProvider) {}

  async onModuleInit() {
    const provider = this.rpc.getProvider(Chain.Ethereum);
    const PoolAddressesProvider = new ethers.Contract(
      POOL_ADDRESSES_PROVIDER_ADDRESS,
      PoolAddressesProviderABI,
      provider,
    );
    const poolAddress: string = await PoolAddressesProvider.getPool();
    this.poolContract = new ethers.Contract(poolAddress, aavePoolAbi, provider);
  }

  async getApr(
    dto: { marketAddress: string },
    chain: Chain = Chain.Ethereum,
  ): Promise<{
    supplyAPR: number;
    variableBorrowAPR: number;
    stableBorrowAPR: number;
  }> {
    if (!this.poolContract) {
      throw new BadRequestException('Aave Pool contract is not initialized');
    }

    try {
      const rd = await this.poolContract.getReserveData(dto.marketAddress);

      const supplyAPR =
        parseFloat(ethers.formatUnits(rd.currentLiquidityRate, 27)) * 100;
      const variableBorrowAPR =
        parseFloat(ethers.formatUnits(rd.currentVariableBorrowRate, 27)) * 100;
      const stableBorrowAPR =
        parseFloat(ethers.formatUnits(rd.__deprecatedStableBorrowRate, 27)) *
        100;

      return { supplyAPR, variableBorrowAPR, stableBorrowAPR };
    } catch (e) {
      throw new BadRequestException('Could not fetch Aave APR');
    }
  }
}

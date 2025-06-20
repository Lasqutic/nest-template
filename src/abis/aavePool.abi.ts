export const aavePoolAbi = [
  `function getReserveData(address asset) view returns (
     uint256 configuration,
     uint128 liquidityIndex,
     uint128 currentLiquidityRate,
     uint128 variableBorrowIndex,
     uint128 currentVariableBorrowRate,
     uint128 __deprecatedStableBorrowRate,
     uint40 lastUpdateTimestamp,
     uint16 id,
     address aTokenAddress,
     address __deprecatedStableDebtTokenAddress,
     address variableDebtTokenAddress,
     address interestRateStrategyAddress,
     uint128 accruedToTreasury
  )`,
] as const;

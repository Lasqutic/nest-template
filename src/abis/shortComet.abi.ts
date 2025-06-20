export const shortCometAbi = [
  'function getUtilization() view returns (uint256)',
  'function getSupplyRate(uint256 utilization) view returns (uint256)',
  'function getBorrowRate(uint256 utilization) view returns (uint256)',
] as const;

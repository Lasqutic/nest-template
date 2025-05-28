export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export type TokenData = {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
};

export interface ITokenService {
  fetchTokenData(address: string): Promise<TokenData>;
}

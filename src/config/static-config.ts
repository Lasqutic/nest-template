import 'dotenv/config';
import { Chain } from '@/entities/chain';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const logLevel = process.env.LOG_LEVEL
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

/*
 This configuration is used directly only when dependency injection is not working,
 e.g. during application startup and its setup.
 Also, it fulfills dynamic (dependency-injection-based, main) configuration.
 */
export const staticConfig = {
  port,
  logLevel,
  rpc: {
    [Chain.Ethereum]: process.env.RPC_ETHEREUM,
    [Chain.Binance]: process.env.RPC_BINANCE,
    [Chain.Polygon]: process.env.RPC_POLYGON,
  },
};

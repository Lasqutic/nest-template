# Token Info API (NestJS)

A simple NestJS API for retrieving token information by its Ethereum address using Multicall.

## Suggested Project Layers

<b> As long as the application is small, there's no need to add extra layers.</b></br>
<b> However, if necessary, it is recommended to choose from the list below. </b>

This layers designed to maintain structure as it scales and organized by levels.

- By convention, higher-level layers must not be imported into lower-level ones.
- Additionally, layers on the same level should not import each other.

\* Exists by default

└── <b> _[apis/](src/apis/README.md) </b> - <i> contain controllers, dtos </i>  
└── <b> features/ </b> - <i> contain specific feature logic </i>  
└── <b> _[services/](src/services/README.md) </b> - <i> contain general processing logic </i>  
└── <b> stores/ </b> - <i> Repository pattern implementation - api for stores (e.g. DB) </i>  
└── <b> contracts/, drivers/ </b> - <i> interfaces for external systems </i>  
└── <b> helpers/, _[config/](src/config/README.md), _[entities/](src/entities/README.md) </b> - <i> the lowest level or independent layers </i>

## Installation

```bash
npm ci
```

## Environment Variables

Create a `.env` file with the following content:

```env
# REQUIRED
MULTICALL_ADDRESS="0xcA11bde05977b3631167028862bE2a173976CA11"
# RPC URLs
RPC_ETHEREUM="https://mainnet.infura.io/v3/<your-project-id>"
RPC_POLYGON="https://polygon-mainnet.infura.io/v3/<your-project-id>"
RPC_BINANCE="https://bsc-dataseed.binance.org/"
```

> This example uses Ethereum Mainnet and Multicall v3 address.

## Run the Application

```bash
npm run start
```

The application will be available at `http://localhost:3000`.

## Healthcheck

`/health`

```
{
  "status": "OK",
  "port": 3000,
  "logLevel": "info"
}
```

## Example Request

**GET** `/token/:address`

### Example:

```
GET http://localhost:3000/token/0xdac17f958d2ee523a2206206994597c13d831ec7
GET http://localhost:3000/token/0x3553f861dEc0257baDA9F8Ed268bf0D74e45E89C
GET http://localhost:3000/token/0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc
```

### Response:

```json
{
  "tokenAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6,
  "chain": "ethereum"
}
```

```json
{
  "tokenAddress": "0x3553f861dEc0257baDA9F8Ed268bf0D74e45E89C",
  "symbol": "USDT",
  "name": "USDT",
  "decimals": 6,
  "chain": "polyon"
}
```

```json
{
  "tokenAddress": "0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6,
  "chain": "binance"
}
```

## Local Testing Guide

This guide describes how to run **local integration tests** using Anvil and deployed contracts (Multicall3 and a test token).

---

### Prerequisites

- Node.js & npm installed
- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed (`forge`, `anvil`)
- [Multicall3](https://github.com/mds1/multicall3) cloned (if deploying manually)
- Your test token contract (e.g., `MyToken.sol`) prepared

---

### Quickstart with Pre-Saved Chain State

1. Go to test directory:

   ```bash
   cd ./test/local
   ```

2. Copy saved Anvil state:

   ```bash
   cp ./anvil-data ./anvil-data-tmp
   ```

3. Start Anvil with this state:

   ```bash
   anvil --state ./anvil-data-tmp
   ```

4. Create `.env.local` file:

   ```dotenv
   # Example .env.local
   RPC_ETHEREUM="http://127.0.0.1:8545"
   RPC_BINANCE="http://127.0.0.1:8545"
   RPC_POLYGON="http://127.0.0.1:8545"

   MULTICALL_ADDRESS="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
   ```

5. Run local tests:

   ```bash
   npm run test:local
   ```

---

### Manual Deployment (Optional)

Use this if you don't want to use pre-saved `anvil-data`.

#### 1. Start Anvil

```bash
anvil --block-time 3
```

#### 2. Deploy Multicall3

Clone the repo and build:

```bash
git clone https://github.com/mds1/multicall3.git
cd multicall3
forge build
```

Deploy:

```bash
forge create \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  src/Multicall3.sol:Multicall3 \
  --broadcast
```

#### 3. Deploy Token

```bash
forge create \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --no-auto-detect \
  --broadcast \
  src/MyToken.sol:MyToken \
  --constructor-args "MyToken" "MTK" 1000000000000000000000000000
```

---

```bash
jest tests/local
```

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

## 📦 Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create a `.env` file with the following content:

```env
RPC_URL=https://mainnet.infura.io/v3/<your-project-id>
MULTICALL_ADDRESS=0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696
```

> ⚠️ This example uses Ethereum Mainnet and Multicall v3 address.

## 🚀 Run the Application

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

## 📘 Example Request

**GET** `/token/:address`

### Example:

```
GET http://localhost:3000/token/0xdac17f958d2ee523a2206206994597c13d831ec7
```

### Response:

```json
{
  "tokenAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "symbol": "USDT",
  "name": "Tether USD",
  "decimals": 6
}
```

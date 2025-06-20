import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ITokenService,
  TOKEN_SERVICE,
  TokenData,
} from '@/contracts/token/token-service.contract';

@Controller('token')
export class TokenController {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  @Get(':address')
  async getToken(@Param('address') address: string): Promise<TokenData> {
    return this.tokenService.fetchTokenData(address);
  }
}

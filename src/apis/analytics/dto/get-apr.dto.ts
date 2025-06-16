import { IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class GetAprDto {
  @IsNotEmpty({ message: 'marketAddress is required' })
  @IsEthereumAddress({
    message: 'marketAddress must be a valid Ethereum address',
  })
  readonly marketAddress: string;
}

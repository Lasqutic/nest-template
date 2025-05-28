import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class GetTokenDto {
  @IsEthereumAddress({ message: 'address must be a valid Ethereum address' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}

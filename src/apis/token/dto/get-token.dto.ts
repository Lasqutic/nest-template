import { IsNotEmpty } from 'class-validator';

export class GetTokenDto {
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}

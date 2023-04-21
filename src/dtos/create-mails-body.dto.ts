import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMailsBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @IsNotEmpty()
  readonly dna: string;
}

import { IsDateString, IsNumber, IsUUID, Min } from 'class-validator';
import { payable } from 'database';
export class CreatePayableDTO implements Omit<payable, 'id'> {
  @IsUUID()
  assignor: string;

  @IsDateString()
  emissionDate: Date;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  value: number;
}

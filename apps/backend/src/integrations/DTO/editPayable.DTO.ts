import { IsDate, IsNumber, IsUUID, Min } from 'class-validator';
import { payable } from 'database';
export class EditPayableDTO implements Partial<Omit<payable, 'id'>> {
  @IsUUID()
  assignor?: string;

  @IsDate()
  emissionDate: Date;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  value: number;
}

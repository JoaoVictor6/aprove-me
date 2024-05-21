import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { payable } from 'database';
export class EditPayableDTO implements Partial<Omit<payable, 'id'>> {
  @IsUUID()
  @IsOptional()
  assignor?: string;

  @IsDateString()
  @IsOptional()
  emissionDate?: Date;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  value?: number;
}

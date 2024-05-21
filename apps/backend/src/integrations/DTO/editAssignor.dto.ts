import { IsEmail, IsOptional, IsString } from 'class-validator';
import { assignor } from 'database';
export class EditAssignorDTO implements Partial<Omit<assignor, 'id'>> {
  @IsString()
  @IsOptional()
  document?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
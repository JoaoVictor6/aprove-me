import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { AuthDTO } from './DTO/auth.dto';
import { IntegrationsService } from './integrations.service';

const verifyId = (id: string) => {
  const { success: isUUID } = z.string().uuid().safeParse(id);

  return { isUUID };
};

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}
  @Post('auth')
  auth(@Body() authDTO: AuthDTO, @Res() res: Response) {
    const { error: createCredentialsError, token: credentialToken } =
      this.integrationsService.createCredentials(authDTO);
    if (createCredentialsError) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    return res.status(HttpStatus.OK).json({ token: credentialToken });
  }

  @Get('payable/:id')
  async find(@Param() id: string, @Res() res: Response) {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid id' });
    }
    const { data, error } = await this.integrationsService.findPayable(id);
    if (error) {
      // todo!
    }

    if (data) return data;

    return res.status(HttpStatus.NOT_FOUND).json({ message: error });
  }
}

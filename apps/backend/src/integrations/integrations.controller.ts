import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthDTO } from './DTO/auth.dto';

@Controller('integrations')
export class IntegrationsController {
  @Post('auth')
  auth(@Body() { login, password }: AuthDTO, @Res() res: Response) {
    if (login !== 'aproveme' || password !== 'aproveme') {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    return res.status(HttpStatus.OK).json({ token: '' });
  }
}

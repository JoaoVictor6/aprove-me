import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthDTO } from './DTO/auth.dto';
import { IntegrationsService } from './integrations.service';

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
}

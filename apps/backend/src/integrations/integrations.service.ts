import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const API_PASSWORD = 'aproveme';
const API_LOGIN = 'aproveme';

@Injectable()
export class IntegrationsService {
  constructor(private readonly jwtService: JwtService) {}
  createCredentials({ password, login }: { password: string; login: string }) {
    if (password !== API_PASSWORD || login !== API_LOGIN) {
      return {
        error: 'Credentials',
        token: null,
      };
    }
    return {
      error: null,
      token: this.jwtService.sign('aproveme'),
    };
  }
}

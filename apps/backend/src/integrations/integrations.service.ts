import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { payable } from 'database';
import { API_LOGIN, API_PASSWORD } from './constants';
import { PrismaService } from './prisma.service';
interface IIntegrationsService {
  createCredentials: (props: {
    password: string;
    login: string;
  }) => { error: null; token: string } | { error: Error; token: null };

  findPayable: (
    id: string,
  ) => Promise<{ data: payable; error: null } | { data: null; error: unknown }>;
}

@Injectable()
export class IntegrationsService implements IIntegrationsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  createCredentials({
    password,
    login,
  }): ReturnType<IIntegrationsService['createCredentials']> {
    if (password !== API_PASSWORD || login !== API_LOGIN) {
      return {
        error: new Error('Credentials'),
        token: null,
      };
    }
    return {
      error: null,
      token: this.jwtService.sign({ id: 'aproveme' }),
    };
  }
  async findPayable(
    id: string,
  ): ReturnType<IIntegrationsService['findPayable']> {
    try {
      const data = await this.prismaService.payable.findUnique({
        where: { id },
      });

      if (data) {
        return { data, error: null };
      }
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }
}

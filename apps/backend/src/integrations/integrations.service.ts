import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, payable } from 'database';
import { API_LOGIN, API_PASSWORD } from './constants';
import { PRISMA_NOT_FOUND_ERROR_CODE } from './prisma.constants';
import { PrismaService } from './prisma.service';

type DefaultReturn<DataReturn = payable> =
  | { error: null; data: DataReturn }
  | { error: unknown; data: null };

interface IIntegrationsService {
  createCredentials: (props: {
    password: string;
    login: string;
    // TODO: Normalize this return. Return data object instead of token prop
  }) => { error: null; token: string } | { error: unknown; token: null };

  findPayable: (id: string) => Promise<DefaultReturn>;

  deletePayable: (id: string) => Promise<DefaultReturn>;

  updatePayable: (
    id: string,
    payable: Partial<Omit<payable, 'id'>>,
  ) => Promise<DefaultReturn>;
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
      const data = await this.prismaService.payable.findUniqueOrThrow({
        where: { id },
      });

      return { data, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_NOT_FOUND_ERROR_CODE)
          return { data: null, error: null };
      }
      return {
        data: null,
        error: error,
      };
    }
  }

  async deletePayable(
    id: string,
  ): ReturnType<IIntegrationsService['deletePayable']> {
    try {
      const data = await this.prismaService.payable.delete({
        where: { id },
      });
      return { data, error: null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_NOT_FOUND_ERROR_CODE)
          return { data: null, error: null };
      }
      return {
        data: null,
        error: error,
      };
    }
  }

  async updatePayable(
    id: string,
    payable: Partial<Omit<payable, 'id'>>,
  ): ReturnType<IIntegrationsService['updatePayable']> {
    try {
      const data = await this.prismaService.payable.update({
        where: { id },
        data: payable,
      });
      return { data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error };
    }
  }
}

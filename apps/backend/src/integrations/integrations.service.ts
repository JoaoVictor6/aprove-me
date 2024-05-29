import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, assignor, payable } from 'database';
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
  }) => DefaultReturn<{ token: string }>;

  findPayable: (id: string) => Promise<DefaultReturn>;

  findAssignor: (id: string) => Promise<DefaultReturn<assignor>>;

  getAssignors: <T extends (keyof assignor)[]>(...columns: T) => Promise<DefaultReturn<Pick<assignor, T[number]>[]>>

  deletePayable: (id: string) => Promise<DefaultReturn>;

  deleteAssignor: (id: string) => Promise<DefaultReturn<assignor>>;

  updatePayable: (
    id: string,
    payable: Partial<Omit<payable, 'id'>>,
  ) => Promise<DefaultReturn>;

  updateAssignor: (
    id: string,
    payable: Partial<Omit<assignor, 'id'>>,
  ) => Promise<DefaultReturn<assignor>>;

  createPayable: (payable: Omit<payable, 'id'>) => Promise<DefaultReturn>;

  createAssignor: (
    payable: Omit<assignor, 'id'>,
  ) => Promise<DefaultReturn<assignor>>;
}

@Injectable()
export class IntegrationsService implements IIntegrationsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) { }
  createCredentials({
    password,
    login,
  }): ReturnType<IIntegrationsService['createCredentials']> {
    if (password !== API_PASSWORD || login !== API_LOGIN) {
      return {
        error: new Error('Credentials'),
        data: null,
      };
    }
    return {
      error: null,
      data: { token: this.jwtService.sign({ id: 'aproveme' }) },
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

  async findAssignor(
    id: string,
  ): ReturnType<IIntegrationsService['findAssignor']> {
    try {
      const data = await this.prismaService.assignor.findUniqueOrThrow({
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

  async deleteAssignor(
    id: string,
  ): ReturnType<IIntegrationsService['deleteAssignor']> {
    try {
      const data = await this.prismaService.assignor.delete({
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
      return { data: null, error };
    }
  }

  async updateAssignor(
    id: string,
    payable: Partial<Omit<assignor, 'id'>>,
  ): ReturnType<IIntegrationsService['updateAssignor']> {
    try {
      const data = await this.prismaService.assignor.update({
        where: { id },
        data: payable,
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createPayable(
    payable: Omit<payable, 'id'>,
  ): ReturnType<IIntegrationsService['createPayable']> {
    try {
      const data = await this.prismaService.payable.create({
        data: {
          value: payable.value,
          assignor: payable.assignor,
          emissionDate: payable.emissionDate,
        },
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createAssignor(
    payable: Omit<assignor, 'id'>,
  ): ReturnType<IIntegrationsService['createAssignor']> {
    try {
      const data = await this.prismaService.assignor.create({
        data: {
          ...payable,
        },
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getAssignors<T extends (keyof assignor)[]>(...columns: T): ReturnType<IIntegrationsService['getAssignors']> {
    try {
      const data = await this.prismaService.assignor.findMany({
        select: {
          id: columns.includes("id"),
          name: columns.includes("name"),
          email: columns.includes("email"),
          phone: columns.includes("phone")
        },
      })
      return { data, error: null } as unknown as { error: null; data: Pick<assignor, T[number]>[] }
    } catch (error) {
      return { data: null, error };
    }
  }
}

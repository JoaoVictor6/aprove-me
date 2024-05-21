import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from 'database';
import { API_LOGIN, API_PASSWORD } from './constants';
import { IntegrationsService } from './integrations.service';
import { PRISMA_NOT_FOUND_ERROR_CODE } from './prisma.constants';
import { PrismaService } from './prisma.service';
import { assignorFactory } from './utils/test/assignorFactory';
import { payableFactory } from './utils/test/payableFactory';

describe('IntegrationsService', () => {
  let service: IntegrationsService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationsService,
        {
          provide: PrismaService,
          useValue: {
            payable: {
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            assignor: {
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => {},
          },
        },
      ],
      imports: [],
    }).compile();

    service = module.get<IntegrationsService>(IntegrationsService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCredentials', () => {
    it('Create JWT token', () => {
      const signSpy = jest.fn();
      jest.spyOn(jwtService, 'sign').mockImplementation(signSpy);

      service.createCredentials({
        login: API_LOGIN,
        password: API_PASSWORD,
      });

      expect(signSpy).toHaveBeenCalled();
    });

    it('verify login and password', () => {
      const { error } = service.createCredentials({
        login: 'WRONG_LOGIN',
        password: 'WRONG_PASSWORD',
      });

      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toStrictEqual('Credentials');
    });
  });
  describe('findPayable', () => {
    it('return error property filled if occurs some error on prisma', async () => {
      const genericError = new Error('FOO');
      jest
        .spyOn(prismaService.payable, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw genericError;
        });

      const { error } = await service.findPayable('anything');

      expect(error).toStrictEqual(genericError);
    });

    it('return data and error fields empty if not found', async () => {
      jest
        .spyOn(prismaService.payable, 'findUniqueOrThrow')
        //@ts-expect-error Prisma type error, not problem
        .mockImplementation(async () => {
          throw new Prisma.PrismaClientKnownRequestError('NOt found', {
            code: PRISMA_NOT_FOUND_ERROR_CODE,
            clientVersion: '',
            batchRequestIdx: 1,
          });
        });

      const { error, data } = await service.findPayable('anything');

      expect(error).toStrictEqual(null);
      expect(data).toStrictEqual(null);
    });
  });
  describe('findAssignor', () => {
    it('return error property filled if occurs some error on prisma', async () => {
      const genericError = new Error('FOO');
      jest
        .spyOn(prismaService.assignor, 'findUniqueOrThrow')
        .mockImplementation(() => {
          throw genericError;
        });

      const { error } = await service.findAssignor('anything');

      expect(error).toStrictEqual(genericError);
    });

    it('return data and error fields empty if not found', async () => {
      jest
        .spyOn(prismaService.assignor, 'findUniqueOrThrow')
        //@ts-expect-error Prisma type error, not problem
        .mockImplementation(async () => {
          throw new Prisma.PrismaClientKnownRequestError('NOt found', {
            code: PRISMA_NOT_FOUND_ERROR_CODE,
            clientVersion: '',
            batchRequestIdx: 1,
          });
        });

      const { error, data } = await service.findAssignor('anything');

      expect(error).toStrictEqual(null);
      expect(data).toStrictEqual(null);
    });
  });
  describe('deletePayable', () => {
    it('use payable id to search on database', async () => {
      const expectedPayableObject = assignorFactory();
      const prismaPayableDeleteMethod = jest.fn();
      jest
        .spyOn(prismaService.payable, 'delete')
        .mockImplementation(prismaPayableDeleteMethod);

      service.deletePayable(expectedPayableObject.id);

      expect(prismaPayableDeleteMethod).toHaveBeenCalledWith({
        where: { id: expectedPayableObject.id },
      });
    });
    it('return deleted data', async () => {
      const expectedPayableObject = assignorFactory();
      jest
        .spyOn(prismaService.payable, 'delete')
        // @ts-expect-error prisma function return
        .mockImplementation(() => expectedPayableObject);

      const { data } = await service.deletePayable('VALID_ID');

      expect(data).toStrictEqual(expectedPayableObject);
    });
    it('return data and error null if not found payable item', async () => {
      jest
        .spyOn(prismaService.payable, 'delete')
        // @ts-expect-error prisma function return
        .mockImplementation(async () => {
          throw new Prisma.PrismaClientKnownRequestError('', {
            code: PRISMA_NOT_FOUND_ERROR_CODE,
            clientVersion: '1',
          });
        });

      const { data, error } = await service.deletePayable('ANY_ID');

      expect(data).toStrictEqual(null);
      expect(error).toStrictEqual(null);
    });
  });
  describe('deleteAssignor', () => {
    it('use assignor id to search on database', async () => {
      const expectedAssignorObject = assignorFactory();
      const prismaAssignorDeleteMethod = jest.fn();
      jest
        .spyOn(prismaService.assignor, 'delete')
        .mockImplementation(prismaAssignorDeleteMethod);

      service.deleteAssignor(expectedAssignorObject.id);

      expect(prismaAssignorDeleteMethod).toHaveBeenCalledWith({
        where: { id: expectedAssignorObject.id },
      });
    });
    it('return deleted data', async () => {
      const expectedAssignorObject = assignorFactory();
      jest
        .spyOn(prismaService.assignor, 'delete')
        // @ts-expect-error prisma function return
        .mockImplementation(() => expectedAssignorObject);

      const { data } = await service.deleteAssignor('VALID_ID');

      expect(data).toStrictEqual(expectedAssignorObject);
    });
    it('return data and error null if not found assignor item', async () => {
      jest
        .spyOn(prismaService.assignor, 'delete')
        // @ts-expect-error prisma function return
        .mockImplementation(async () => {
          throw new Prisma.PrismaClientKnownRequestError('', {
            code: PRISMA_NOT_FOUND_ERROR_CODE,
            clientVersion: '1',
          });
        });

      const { data, error } = await service.deleteAssignor('ANY_ID');

      expect(data).toStrictEqual(null);
      expect(error).toStrictEqual(null);
    });
  });
  describe('updatePayable', () => {
    it('update database item based on assignor id', async () => {
      const id = 'valid_id';
      const prismaUpdateSpy = jest.fn();
      jest
        .spyOn(prismaService.payable, 'update')
        .mockImplementation(prismaUpdateSpy);

      service.updatePayable(id, payableFactory());

      expect(prismaUpdateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id } }),
      );
    });
    it('fill error prop if throw a error', async () => {
      const randomError = new Error('FOO');
      jest.spyOn(prismaService.payable, 'update').mockImplementation(() => {
        throw randomError;
      });

      const { error } = await service.updatePayable(
        'VALID_ID',
        payableFactory(),
      );

      expect(error).toStrictEqual(randomError);
    });
    it('fill data with updated field', async () => {
      const payableMock = payableFactory();
      jest
        .spyOn(prismaService.payable, 'update')
        // @ts-expect-error prisma function return
        .mockImplementation(() => payableMock);

      const { data } = await service.updatePayable(payableMock.id, payableMock);

      expect(data).toStrictEqual(payableMock);
    });
  });
  describe('updateAssignor', () => {
    it('update database item based on assignor id', async () => {
      const id = 'valid_id';
      const prismaUpdateSpy = jest.fn();
      jest
        .spyOn(prismaService.assignor, 'update')
        .mockImplementation(prismaUpdateSpy);

      service.updateAssignor(id, assignorFactory());

      expect(prismaUpdateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id } }),
      );
    });
    it('fill error prop if throw a error', async () => {
      const randomError = new Error('FOO');
      jest.spyOn(prismaService.assignor, 'update').mockImplementation(() => {
        throw randomError;
      });

      const { error } = await service.updateAssignor(
        'VALID_ID',
        assignorFactory(),
      );

      expect(error).toStrictEqual(randomError);
    });
    it('fill data with updated field', async () => {
      const assignorMock = assignorFactory();
      jest
        .spyOn(prismaService.assignor, 'update')
        // @ts-expect-error prisma function return
        .mockImplementation(() => assignorMock);

      const { data } = await service.updateAssignor(
        assignorMock.id,
        assignorMock,
      );

      expect(data).toStrictEqual(assignorMock);
    });
  });
});

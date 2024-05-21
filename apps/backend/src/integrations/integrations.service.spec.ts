import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from 'database';
import { API_LOGIN, API_PASSWORD } from './constants';
import { IntegrationsService } from './integrations.service';
import { PRISMA_NOT_FOUND_ERROR_CODE } from './prisma.constants';
import { PrismaService } from './prisma.service';

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
            payable: { findUniqueOrThrow: jest.fn() },
            assignor: { findUniqueOrThrow: jest.fn() },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => {},
          },
        },
      ],
      imports: [
        // JwtModule.register({
        //   secret: process.env.JWT_SECRET,
        //   signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        // }),
        // {
        //   module: JwtModule,
        //   providers: [ {provide: } ]
        // }
      ],
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
});

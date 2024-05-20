import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationsService } from './integrations.service';
import { PrismaService } from './prisma.service';
import { payableFactory } from './utils/test/payableFactory';
describe('IntegrationsService', () => {
  let service: IntegrationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationsService,
        {
          provide: PrismaService,
          useValue: { payable: { findUniqueOrThrow: jest.fn() } },
        },
      ],
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
      ],
    }).compile();

    service = module.get<IntegrationsService>(IntegrationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        .mockImplementation(async () => payableFactory());

      const { error, data } = await service.findPayable('anything');

      expect(error).toStrictEqual(null);
      expect(data).toStrictEqual(null);
    });
  });
});

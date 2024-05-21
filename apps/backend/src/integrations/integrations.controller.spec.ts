import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from 'database';
import { Response } from 'express';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED } from './prisma.constants';
import { payableFactory } from './utils/test/payableFactory';
const getResponseStub = () => {
  const responseStatusMethodStub = jest.fn();
  const responseJsonMethodStub = jest.fn();
  const responseStub: Partial<Response> = {
    status: responseStatusMethodStub.mockReturnValue({
      json: responseJsonMethodStub,
    }),
    json: responseJsonMethodStub,
  };

  return {
    responseStub: responseStub as unknown as Response<
      any,
      Record<string, string>
    >,
    responseJsonMethodStub,
    responseStatusMethodStub,
  };
};
describe('IntegrationsController /integrations', () => {
  let controller: IntegrationsController;
  let service: IntegrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationsController],
      providers: [
        {
          provide: IntegrationsService,
          useValue: {
            createCredentials: () => {},
            findPayable: () => {},
            deletePayable: () => {},
            updatePayable: () => {},
            createPayable: () => {},
          },
        },
      ],
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
      ],
    }).compile();

    controller = module.get<IntegrationsController>(IntegrationsController);
    service = module.get<IntegrationsService>(IntegrationsService);
  });

  describe('/integrations/auth', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return unauthorized status if credentials is not valid', () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest
        .spyOn(service, 'createCredentials')
        .mockReturnValue({ error: new Error('any'), data: null });

      controller.auth(
        {
          login: 'invalid_login',
          password: 'invalid_password',
        },
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.UNAUTHORIZED,
      );
    });
    it('if credentials is valid, return a token with OK status', () => {
      const { responseStub, responseJsonMethodStub, responseStatusMethodStub } =
        getResponseStub();
      const expectedJsonObject = {
        token: 'any',
      };
      jest
        .spyOn(service, 'createCredentials')
        .mockReturnValue({ error: null, data: { token: 'any' } });

      controller.auth(
        {
          login: 'invalid_login',
          password: 'invalid_password',
        },
        responseStub,
      );

      expect(responseJsonMethodStub).toHaveBeenCalledWith(expectedJsonObject);
      expect(responseStatusMethodStub).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('GET: /payable/:id', () => {
    it('Return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();

      await controller.findUniquePayable({ id: 'INVALID_ID' }, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('send a json with message prop when occurs any error', async () => {
      const { responseStub, responseJsonMethodStub } = getResponseStub();

      await controller.findUniquePayable({ id: 'INVALID_ID' }, responseStub);

      expect(responseJsonMethodStub).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.anything() }),
      );
    });

    it('send not found status code if payable is not found', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest
        .spyOn(service, 'findPayable')
        .mockImplementation(async () => ({ data: null, error: null }));

      await controller.findUniquePayable(
        { id: faker.string.uuid() },
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });

    it('send a json with data and OK status code if is receive a valid id', async () => {
      const { responseStub } = getResponseStub();
      const payableMock = payableFactory();

      jest.spyOn(service, 'findPayable').mockImplementation(async () => ({
        data: payableMock,
        error: null,
      }));

      const returnedValue = await controller.findUniquePayable(
        { id: payableMock.id },
        responseStub,
      );

      expect(returnedValue).toStrictEqual(payableMock);
    });

    it('return internal error code for unhandled errors', async () => {
      const payableIdMock = faker.string.uuid();
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest.spyOn(service, 'findPayable').mockImplementation(async () => ({
        data: null,
        error: new Error('Unhandled'),
      }));

      await controller.findUniquePayable({ id: payableIdMock }, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('DELETE: /payable/:id', () => {
    it('return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();

      await controller.deleteUniquePayable({ id: 'INVALID_ID' }, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('send not found status code if payable is not found', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest
        .spyOn(service, 'deletePayable')
        .mockImplementation(async () => ({ data: null, error: null }));

      await controller.deleteUniquePayable(
        { id: faker.string.uuid() },
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });

    it('return internal error code for unhandled errors', async () => {
      const payableIdMock = faker.string.uuid();
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest.spyOn(service, 'deletePayable').mockImplementation(async () => ({
        data: null,
        error: new Error('Unhandled'),
      }));

      await controller.deleteUniquePayable({ id: payableIdMock }, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('send a json with data and OK status code if is receive a valid id', async () => {
      const { responseStub } = getResponseStub();
      const payableMock = payableFactory();

      jest.spyOn(service, 'deletePayable').mockImplementation(async () => ({
        data: payableMock,
        error: null,
      }));

      const returnedValue = await controller.deleteUniquePayable(
        { id: payableMock.id },
        responseStub,
      );

      expect(returnedValue).toStrictEqual(payableMock);
    });

    it('return internal error code for unhandled errors', async () => {
      const payableIdMock = faker.string.uuid();
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest.spyOn(service, 'deletePayable').mockImplementation(async () => ({
        data: null,
        error: new Error('Unhandled'),
      }));

      await controller.deleteUniquePayable({ id: payableIdMock }, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('PUT: /payable/:id', () => {
    it('return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      const payableMock = payableFactory();

      await controller.updateUniquePayable(
        { id: 'INVALID_ID' },
        payableMock,
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('send not found status code if payable is not found', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      const payableMock = payableFactory();
      jest
        .spyOn(service, 'updatePayable')
        .mockImplementation(async () => ({ data: null, error: null }));

      await controller.updateUniquePayable(
        { id: payableMock.id },
        payableMock,
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.NOT_FOUND,
      );
    });

    it('send a json with data and OK status code if is receive a valid id', async () => {
      const { responseStub } = getResponseStub();
      const payableMock = payableFactory();

      jest.spyOn(service, 'updatePayable').mockImplementation(async () => ({
        data: payableMock,
        error: null,
      }));

      const returnedValue = await controller.updateUniquePayable(
        { id: payableMock.id },
        payableMock,
        responseStub,
      );

      expect(returnedValue).toStrictEqual(payableMock);
    });

    it('return internal error code for unhandled errors', async () => {
      const { id, ...payableMock } = payableFactory();
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest.spyOn(service, 'updatePayable').mockImplementation(async () => ({
        data: null,
        error: new Error('Unhandled'),
      }));

      await controller.updateUniquePayable({ id }, payableMock, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('POST: /payable', () => {
    it('save payable item on database', async () => {
      const { responseStub } = getResponseStub();
      const payableMock = payableFactory();
      const expectedPropsPassedOnCreatePayable = {
        assignor: payableMock.assignor,
        emissionDate: payableMock.emissionDate,
        value: payableMock.value,
      };
      const createPayableSpy = jest.fn();
      jest.spyOn(service, 'createPayable').mockImplementation(createPayableSpy);
      createPayableSpy.mockResolvedValue({ data: null, error: null });

      await controller.createPayable(
        expectedPropsPassedOnCreatePayable,
        responseStub,
      );

      expect(createPayableSpy).toHaveBeenCalledWith(
        expectedPropsPassedOnCreatePayable,
      );
    });
    it('send internal error status if receive a unhandled error', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      const payableMock = payableFactory();
      const expectedPropsPassedOnCreatePayable = {
        assignor: payableMock.assignor,
        emissionDate: payableMock.emissionDate,
        value: payableMock.value,
      };
      jest.spyOn(service, 'createPayable').mockImplementation(async () => ({
        data: null,
        error: new Error('UNHANDLED'),
      }));

      await controller.createPayable(
        expectedPropsPassedOnCreatePayable,
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
    it('return created payable object', async () => {
      const { responseStub } = getResponseStub();
      const payableMock = payableFactory();
      const expectedPropsPassedOnCreatePayable = {
        assignor: payableMock.assignor,
        emissionDate: payableMock.emissionDate,
        value: payableMock.value,
      };
      const createPayableSpy = jest.fn();
      jest.spyOn(service, 'createPayable').mockImplementation(createPayableSpy);
      createPayableSpy.mockResolvedValue({ data: payableMock, error: null });

      const returnedValue = await controller.createPayable(
        expectedPropsPassedOnCreatePayable,
        responseStub,
      );

      expect(returnedValue).toStrictEqual(payableMock);
    });
    it('return bad request status if assignor id not exists on database', async () => {
      const createPayableSpy = jest.fn();
      jest.spyOn(service, 'createPayable').mockImplementation(createPayableSpy);
      createPayableSpy.mockResolvedValue({
        data: null,
        error: new Prisma.PrismaClientKnownRequestError(
          'Foreign key constraint failed on the field: assignor',
          { code: PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED, clientVersion: '1' },
        ),
      });
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      const payableMock = payableFactory();
      const expectedPropsPassedOnCreatePayable = {
        assignor: payableMock.assignor,
        emissionDate: payableMock.emissionDate,
        value: payableMock.value,
      };

      await controller.createPayable(
        expectedPropsPassedOnCreatePayable,
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });
  });
});

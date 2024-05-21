import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
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
        .mockReturnValue({ error: new Error('any'), token: null });

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
        .mockReturnValue({ error: null, token: 'any' });

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

  describe('POST: /payable/:id', () => {
    it('Return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();

      await controller.findUniquePayable('INVALID_ID', responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('send a json with message prop when occurs any error', async () => {
      const { responseStub, responseJsonMethodStub } = getResponseStub();

      await controller.findUniquePayable('INVALID_ID', responseStub);

      expect(responseJsonMethodStub).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.anything() }),
      );
    });

    it('send not found status code if payable is not found', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest
        .spyOn(service, 'findPayable')
        .mockImplementation(async () => ({ data: null, error: null }));

      await controller.findUniquePayable(faker.string.uuid(), responseStub);

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
        payableMock.id,
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

      await controller.findUniquePayable(payableIdMock, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('DELETE: /payable/:id', () => {
    it('return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();

      await controller.deleteUniquePayable('INVALID_ID', responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });

    it('send not found status code if payable is not found', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest
        .spyOn(service, 'deletePayable')
        .mockImplementation(async () => ({ data: null, error: null }));

      await controller.deleteUniquePayable(faker.string.uuid(), responseStub);

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

      await controller.deleteUniquePayable(payableIdMock, responseStub);

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
        payableMock.id,
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

      await controller.deleteUniquePayable(payableIdMock, responseStub);

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe.only('PUT: /payable/:id', () => {
    it('return bad request status if id value is not valid', async () => {
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      const payableMock = payableFactory();

      await controller.updateUniquePayable(
        'INVALID_ID',
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
        payableMock.id,
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
        payableMock.id,
        payableMock,
        responseStub,
      );

      expect(returnedValue).toStrictEqual(payableMock);
    });

    it('return internal error code for unhandled errors', async () => {
      const payableMock = payableFactory();
      const { responseStub, responseStatusMethodStub } = getResponseStub();
      jest.spyOn(service, 'updatePayable').mockImplementation(async () => ({
        data: null,
        error: new Error('Unhandled'),
      }));

      await controller.updateUniquePayable(
        payableMock.id,
        payableMock,
        responseStub,
      );

      expect(responseStatusMethodStub).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});

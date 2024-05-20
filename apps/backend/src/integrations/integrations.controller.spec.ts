import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

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

describe('IntegrationsController', () => {
  let controller: IntegrationsController;
  let service: IntegrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationsController],
      providers: [
        {
          provide: IntegrationsService,
          useValue: { createCredentials: () => {} },
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return unauthorized status if credentials is not valid', () => {
    const { responseStub, responseStatusMethodStub } = getResponseStub();
    jest
      .spyOn(service, 'createCredentials')
      .mockReturnValue({ error: 'any', token: null });

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

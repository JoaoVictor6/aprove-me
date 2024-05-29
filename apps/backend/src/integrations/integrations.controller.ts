import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma, assignor, payable } from 'database';
import { Response } from 'express';
import { z } from 'zod';
import { AuthDTO } from './DTO/auth.dto';
import { CreateAssignorDTO } from './DTO/createAssignor.dto';
import { CreatePayableDTO } from './DTO/createPayable.dto';
import { EditAssignorDTO } from './DTO/editAssignor.dto';
import { EditPayableDTO } from './DTO/editPayable.DTO';
import { IntegrationsService } from './integrations.service';
import {
  PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED,
  PRISMA_UNIQUE_KEY_ERROR,
} from './prisma.constants';
const verifyId = (id: string) => {
  const { success: isUUID } = z.string().uuid().safeParse(id);

  return { isUUID };
};

const prismaErrorHandler = (
  error: Prisma.PrismaClientKnownRequestError,
  res: Response,
) => {
  if (error.code === PRISMA_UNIQUE_KEY_ERROR) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Assignor already exists' })
      .end();
  }
  if (error.code === PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Invalid assignor' })
      .end();
  }
  return res.status(500).end();
};
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }
  @Post('auth')
  auth(@Body() authDTO: AuthDTO, @Res() res: Response) {
    const { error: createCredentialsError, data } =
      this.integrationsService.createCredentials(authDTO);
    if (createCredentialsError) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' })
        .end();
    }
    return res.status(HttpStatus.OK).json({ token: data.token }).end();
  }

  @Get('payable/:id')
  async findUniquePayable(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<payable | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid id' })
        .end();
    }
    const { data, error } = await this.integrationsService.findPayable(id);
    if (error) {
      // unhandled error
      return res.status(500).end();
    }

    if (data) return res.json(data).end();

    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Delete('payable/:id')
  async deleteUniquePayable(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<payable | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid id' })
        .end();
    }
    const { data, error } = await this.integrationsService.deletePayable(id);
    if (error) {
      // unhandled error
      return res.status(500).end();
    }

    if (data) return res.json(data).end();

    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Put('payable/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUniquePayable(
    @Param() { id }: { id: string },
    @Body() editPayableDTO: EditPayableDTO,
    @Res() res: Response,
  ) {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid id' })
        .end();
    }

    const { data, error } = await this.integrationsService.updatePayable(
      id,
      editPayableDTO,
    );
    if (error) {
      // unhandled error
      return res.status(500).end();
    }
    if (data) return res.json(data).end();
    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Post('payable')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPayable(
    @Body() createPayableDto: CreatePayableDTO,
    @Res() res: Response,
  ) {
    const { data, error } =
      await this.integrationsService.createPayable(createPayableDto);

    if (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return prismaErrorHandler(error, res);
      }
      // unhandled error
      return res.status(500).end();
    }
    return res.json(data).end();
  }

  @Get('assignor/:id')
  async findUniqueAssignor(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<assignor | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid id' })
        .end();
    }
    const { data, error } = await this.integrationsService.findAssignor(id);
    if (error) {
      // unhandled error
      return res.status(500).end();
    }

    if (data) return res.json(data).end();

    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Delete('assignor/:id')
  async deleteUniqueAssignor(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<assignor | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid id' });
    }
    const { data, error } = await this.integrationsService.deleteAssignor(id);
    if (error) {
      // unhandled error
      return res.status(500).end();
    }

    if (data) return res.json(data).end();

    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Put('assignor/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUniqueAssignor(
    @Param() { id }: { id: string },
    @Body() editAssignorDto: EditAssignorDTO,
    @Res() res: Response,
  ) {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid id' })
        .end();
    }

    const { data, error } = await this.integrationsService.updateAssignor(
      id,
      editAssignorDto,
    );
    if (error) {
      // unhandled error
      return res.status(500).end();
    }
    if (data) return res.json(data).end();
    return res.status(HttpStatus.NOT_FOUND).json({ message: error }).end();
  }

  @Post('assignor')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAssignor(
    @Body() createAssignorDto: CreateAssignorDTO,
    @Res() res: Response,
  ) {
    const { data, error } =
      await this.integrationsService.createAssignor(createAssignorDto);
    if (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return prismaErrorHandler(error, res);
      }
      // unhandled error
      return res.status(500).end();
    }
    return res.json(data).end();
  }

  @Get('assignor')
  async viewAssignor(@Query("columns") columns: keyof assignor) {
    const { error, data } = await this.integrationsService.getAssignors(...columns.split(",") as (keyof assignor)[]);
    if (error) {
      throw error
    }
    return data
  }
}

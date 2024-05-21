import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Prisma, payable } from 'database';
import { Response } from 'express';
import { z } from 'zod';
import { AuthDTO } from './DTO/auth.dto';
import { CreatePayableDTO } from './DTO/createPayable.dto';
import { EditPayableDTO } from './DTO/editPayable.DTO';
import { IntegrationsService } from './integrations.service';
import { PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED } from './prisma.constants';
const verifyId = (id: string) => {
  const { success: isUUID } = z.string().uuid().safeParse(id);

  return { isUUID };
};

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}
  @Post('auth')
  auth(@Body() authDTO: AuthDTO, @Res() res: Response) {
    const { error: createCredentialsError, data } =
      this.integrationsService.createCredentials(authDTO);
    if (createCredentialsError) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    return res.status(HttpStatus.OK).json({ token: data.token });
  }

  @Get('payable/:id')
  async findUniquePayable(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<payable | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid id' });
    }
    const { data, error } = await this.integrationsService.findPayable(id);
    if (error) {
      // unhandled error
      return res.status(500);
    }

    if (data) return data;

    return res.status(HttpStatus.NOT_FOUND).json({ message: error });
  }

  @Delete('payable/:id')
  async deleteUniquePayable(
    @Param() { id }: { id: string },
    @Res() res: Response,
  ): Promise<payable | Response> {
    const { isUUID } = verifyId(id);
    if (!isUUID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid id' });
    }
    const { data, error } = await this.integrationsService.deletePayable(id);
    if (error) {
      // unhandled error
      return res.status(500);
    }

    if (data) return data;

    return res.status(HttpStatus.NOT_FOUND).json({ message: error });
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
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid id' });
    }

    const { data, error } = await this.integrationsService.updatePayable(
      id,
      editPayableDTO,
    );
    if (error) {
      // unhandled error
      return res.status(500);
    }
    if (data) return data;
    return res.status(HttpStatus.NOT_FOUND).json({ message: error });
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
        if (error.code === PRISMA_FOREIGN_KEY_CONSTRAINT_FAILED) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Invalid assignor' });
        }
      }
      // unhandled error
      return res.status(500);
    }
    return data;
  }
}

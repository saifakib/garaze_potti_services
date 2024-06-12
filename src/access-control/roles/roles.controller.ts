import { Controller, Get, UseGuards, HttpStatus, Param, Delete, Body, Post, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/guard/auth.guard';
import { PermissionGuard } from '@/guard/permission.guard';
import { RolesService } from './roles.service';
import { Permission } from '@/decorators/permission.decorator';
import { ZodPipe } from '@/zod-validation/zod-validation.pipe';
import { uuidSchema } from '@/validationSchema/common/uuid.schema';
import { UUID } from 'crypto';
import {
  CreateRoleDto,
  createRoleSchema,
  SyncRoleToUserDto,
  syncRoleToUserSchema,
} from '@/validationSchema/access-control';
import ResponseHelper from '@/utils/response.helper';
import errorHandler from '@/utils/error.helper';
import { FindAllDto, findAllSchema } from '@/validationSchema/common/findAll.schema';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private readonly res = new ResponseHelper();
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth('JWT')
  @Permission('VIEW_ROLES')
  @UseGuards(AuthGuard, PermissionGuard)
  @Get()
  async findAll(@Query(new ZodPipe(findAllSchema)) payload: FindAllDto) {
    try {
      const response: any = await this.rolesService.findAll(payload);
      return this.res.successResponse({
        data: response.data,
        meta: response.meta,
        status: HttpStatus.OK,
        message: 'All Roles',
      });
    } catch (error: any) {
      throw errorHandler(error);
    }
  }
  @ApiBearerAuth('JWT')
  @Permission('VIEW_ROLES')
  @UseGuards(AuthGuard, PermissionGuard)
  @Get('/:uuid')
  @ApiParam({
    name: 'uuid',
    description: 'uuid format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    type: 'string',
  })
  async findOne(
    @Param('uuid', new ZodPipe(uuidSchema))
    uuid: UUID,
  ) {
    const response: any = await this.rolesService.findOne({ uuid });
    return this.res.successResponse({
      data: response,
      status: HttpStatus.OK,
      message: 'Role found',
    });
  }

  @ApiBearerAuth('JWT')
  @Permission('CREATE_ROLES')
  @UseGuards(AuthGuard, PermissionGuard)
  @Post()
  async create(@Body(new ZodPipe(createRoleSchema)) createRoleDto: CreateRoleDto) {
    try {
      const response: any = await this.rolesService.create(createRoleDto);
      return this.res.successResponse({
        data: response,
        status: HttpStatus.CREATED,
        message: 'Create new Role',
      });
    } catch (error: any) {
      throw errorHandler(error);
    }
  }

  @ApiBearerAuth('JWT')
  @Permission('DELETE_ROLES')
  @UseGuards(AuthGuard, PermissionGuard)
  @Delete('/:uuid')
  @ApiParam({
    name: 'uuid',
    description: 'uuid format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    type: 'string',
  })
  async delete(
    @Param('uuid', new ZodPipe(uuidSchema))
    uuid: UUID,
  ) {
    try {
      const response: any = await this.rolesService.delete({ uuid });
      return this.res.successResponse({
        data: response,
        status: HttpStatus.OK,
        message: 'Delete Role',
      });
    } catch (error: any) {
      throw errorHandler(error);
    }
  }

  @ApiBearerAuth('JWT')
  @Permission('ATTACH_ROLE_TO_USER')
  @UseGuards(AuthGuard, PermissionGuard)
  @Patch('/attach')
  async attachRole(@Body(new ZodPipe(syncRoleToUserSchema)) syncRoleToUserDto: SyncRoleToUserDto) {
    try {
      const response = await this.rolesService.attachRole(syncRoleToUserDto);
      return this.res.successResponse({
        data: response,
        status: HttpStatus.ACCEPTED,
        message: 'Attach role to user successfully',
      });
    } catch (error: any) {
      throw errorHandler(error);
    }
  }

  @ApiBearerAuth('JWT')
  @Permission('DETACH_ROLE_TO_USER')
  @UseGuards(AuthGuard, PermissionGuard)
  @Patch('/detach')
  async detachRole(@Body(new ZodPipe(syncRoleToUserSchema)) syncRoleToUserDto: SyncRoleToUserDto) {
    try {
      const response = await this.rolesService.detachRole(syncRoleToUserDto);
      return this.res.successResponse({
        data: response,
        status: HttpStatus.ACCEPTED,
        message: 'Detach role to user successfully',
      });
    } catch (error: any) {
      throw errorHandler(error);
    }
  }
}

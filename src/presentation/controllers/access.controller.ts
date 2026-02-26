import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListRolesUseCase } from '../../application/use-cases/list-roles.use-case';
import { Authorize } from '../guards/authorization.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Authorize({ anyOfRoles: ['Admin'] })
@Controller()
export class AccessController {
  constructor(private readonly listRolesUseCase: ListRolesUseCase) {}

  @Get('roles')
  listRoles() {
    return this.listRolesUseCase.execute();
  }
}

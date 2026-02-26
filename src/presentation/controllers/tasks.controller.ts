import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { UpdateTaskStatusDto } from '../../application/dto/update-task-status.dto';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { UpdateTaskStatusUseCase } from '../../application/use-cases/update-task-status.use-case';
import { Authorize } from '../guards/authorization.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @Authorize({ anyOfRoles: ['Admin', 'Manager'] })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.createTaskUseCase.execute(body);
  }

  @Authorize({ anyOfRoles: ['Admin', 'Manager'] })
  @Patch(':taskId')
  update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskDto,
  ) {
    return this.updateTaskUseCase.execute(taskId, body);
  }

  @Authorize({ anyOfRoles: ['Admin', 'Manager'] })
  @Delete(':taskId')
  @HttpCode(204)
  async delete(@Param('taskId', ParseIntPipe) taskId: number): Promise<void> {
    await this.deleteTaskUseCase.execute(taskId);
  }

  @Authorize({ anyOfRoles: ['Admin', 'Manager', 'Member'] })
  @Patch(':taskId/status')
  updateStatus(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.updateTaskStatusUseCase.execute(taskId, body, {
      userId: req.user!.userId,
      role: req.user!.role,
    });
  }
}

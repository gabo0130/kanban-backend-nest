import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBoardDto } from '../../application/dto/create-board.dto';
import { UpdateBoardDto } from '../../application/dto/update-board.dto';
import { CreateLabelDto } from '../../application/dto/create-label.dto';
import { UpdateLabelDto } from '../../application/dto/update-label.dto';
import { ListBoardsUseCase } from '../../application/use-cases/list-boards.use-case';
import { GetBoardByIdUseCase } from '../../application/use-cases/get-board-by-id.use-case';
import { CreateBoardUseCase } from '../../application/use-cases/create-board.use-case';
import { UpdateBoardUseCase } from '../../application/use-cases/update-board.use-case';
import { DeleteBoardUseCase } from '../../application/use-cases/delete-board.use-case';
import { CreateLabelUseCase } from '../../application/use-cases/create-label.use-case';
import { UpdateLabelUseCase } from '../../application/use-cases/update-label.use-case';
import { DeleteLabelUseCase } from '../../application/use-cases/delete-label.use-case';
import { Authorize } from '../guards/authorization.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly listBoardsUseCase: ListBoardsUseCase,
    private readonly getBoardByIdUseCase: GetBoardByIdUseCase,
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
    private readonly createLabelUseCase: CreateLabelUseCase,
    private readonly updateLabelUseCase: UpdateLabelUseCase,
    private readonly deleteLabelUseCase: DeleteLabelUseCase,
  ) {}

  @Authorize({ anyOfRoles: ['Admin', 'Manager', 'Member'] })
  @Get()
  findAll() {
    return this.listBoardsUseCase.execute();
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Post()
  create(@Body() body: CreateBoardDto) {
    return this.createBoardUseCase.execute(body);
  }

  @Authorize({ anyOfRoles: ['Admin', 'Manager', 'Member'] })
  @Get(':boardId')
  findById(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.getBoardByIdUseCase.execute(boardId);
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Patch(':boardId')
  update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() body: UpdateBoardDto,
  ) {
    return this.updateBoardUseCase.execute(boardId, body);
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Delete(':boardId')
  @HttpCode(204)
  async remove(@Param('boardId', ParseIntPipe) boardId: number): Promise<void> {
    await this.deleteBoardUseCase.execute(boardId);
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Post(':boardId/labels')
  createLabel(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() body: CreateLabelDto,
  ) {
    return this.createLabelUseCase.execute(boardId, body);
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Patch(':boardId/labels/:labelId')
  updateLabel(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('labelId', ParseIntPipe) labelId: number,
    @Body() body: UpdateLabelDto,
  ) {
    return this.updateLabelUseCase.execute(boardId, labelId, body);
  }

  @Authorize({ anyOfRoles: ['Admin'] })
  @Delete(':boardId/labels/:labelId')
  @HttpCode(204)
  async deleteLabel(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ): Promise<void> {
    await this.deleteLabelUseCase.execute(boardId, labelId);
  }
}

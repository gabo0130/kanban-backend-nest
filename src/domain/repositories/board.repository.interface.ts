export interface BoardStatusDto {
  id: number;
  label: string;
  order: number;
}

export interface BoardLabelDto {
  id: number;
  name: string;
  color?: string;
}

export interface BoardTaskDto {
  id: number;
  boardId: number;
  title: string;
  description?: string;
  status: string;
  assigneeId?: number;
  assigneeName?: string;
  labels?: string[];
  order?: number;
}

export interface BoardDto {
  id: number;
  name: string;
  description?: string;
  statuses: BoardStatusDto[];
  labels: BoardLabelDto[];
}

export interface CreateBoardRepositoryDto {
  name: string;
  description?: string;
  statuses: string[];
  labels?: Array<{
    name: string;
    color?: string;
  }>;
}

export interface UpdateBoardRepositoryDto {
  name?: string;
  description?: string;
  statuses?: string[];
}

export interface CreateBoardLabelRepositoryDto {
  boardId: number;
  name: string;
  color?: string;
}

export interface UpdateBoardLabelRepositoryDto {
  name?: string;
  color?: string;
}

export interface BoardRepository {
  list(): Promise<BoardDto[]>;
  getById(boardId: number): Promise<BoardDto | null>;
  getTasksByBoardId(boardId: number): Promise<BoardTaskDto[]>;
  create(data: CreateBoardRepositoryDto): Promise<BoardDto>;
  update(
    boardId: number,
    data: UpdateBoardRepositoryDto,
  ): Promise<BoardDto | null>;
  delete(boardId: number): Promise<boolean>;
  createLabel(
    data: CreateBoardLabelRepositoryDto,
  ): Promise<BoardLabelDto | null>;
  updateLabel(
    boardId: number,
    labelId: number,
    data: UpdateBoardLabelRepositoryDto,
  ): Promise<BoardLabelDto | null>;
  deleteLabel(boardId: number, labelId: number): Promise<boolean>;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'board_statuses' })
export class BoardStatusOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'board_id' })
  boardId: number;

  @Column({ type: 'varchar', length: 120 })
  label: string;

  @Column({ type: 'int' })
  order: number;
}

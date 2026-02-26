import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'tasks' })
export class TaskOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'board_id' })
  boardId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 120 })
  status: string;

  @Column({ type: 'int', name: 'assignee_id', nullable: true })
  assigneeId: number | null;

  @ManyToOne(() => UserOrmEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee: Promise<UserOrmEntity | null>;

  @Column({ type: 'simple-array', nullable: true })
  labels: string[] | null;

  @Column({ type: 'int', nullable: true })
  order: number | null;
}

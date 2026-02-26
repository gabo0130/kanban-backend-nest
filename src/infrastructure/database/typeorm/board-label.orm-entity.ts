import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'board_labels' })
export class BoardLabelOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'board_id' })
  boardId: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  color: string | null;
}

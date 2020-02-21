import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  static new(name: string): Budget {
    const budget = new Budget();
    budget.name = name;
    return budget;
  }
}

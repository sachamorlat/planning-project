import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class WorkEntry {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userId!: number

    @Column()
    date!: string

    @Column()
    location!: string

    @Column()
    teammate!: string

    @Column()
    startTime!: string

    @Column()
    endTime!: string

    @Column()
    breakDuration!: number

    @CreateDateColumn()
    created_at!: string
}
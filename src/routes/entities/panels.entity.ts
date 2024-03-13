import {  Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Route } from "./route.entity";

@Entity({ name: 'panels' })
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('text', { unique: true })
    code: string;

    @Column('text', { nullable: true })
    location: string;

    
    @Column('boolean', { nullable: false })
    active: boolean;

    @Column({ type: 'date', nullable: false })
    register_date: Date;

   
    @OneToMany(() => Route, route => route.panel,
        {
            cascade: true,
            eager: true,

        }
    )
    routes?: Route[];



}

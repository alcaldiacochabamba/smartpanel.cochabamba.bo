import {  BeforeInsert, Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Route } from "../../routes/entities/route.entity";

@Entity({ name: 'panels' })
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated('uuid')
    uuid: string;

    @Column('text', { unique: true })
    code: string;

    @Column('text', { nullable: false })
    location: string;

    @Column('text', { nullable: false })
    origin: string;

    @Column('boolean', { nullable: false, default: true  })
    active: boolean;

    @Column({  type: 'timestamp without time zone', nullable: false , default: 'NOW()' })
    register_date: Date;

   
    @OneToMany(() => Route, route => route.panel,
        {
            cascade: true,
            eager: true,

        }
    )
    routes?: Route[];



}

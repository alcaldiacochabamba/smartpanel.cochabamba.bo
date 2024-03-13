import {  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RouteDetail } from "./route-detail.entity";
import { Panel } from "./panels.entity";

@Entity({ name: 'routes' })
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('text', { unique: true })
    title: string;

    @Column('text', { nullable: false })
    origin: string;

    @Column('text', { nullable: false })
    destination: string;

    @Column('text', { nullable: false })
    mode: string;

    @Column('text', { nullable: true })
    departure_time: string;

    @Column('text', { nullable: true })
    traffic_model: string;

    @Column({ type: 'date', nullable: false })
    register_date: Date;

    @OneToMany(() => RouteDetail, routedetail => routedetail.route,
        {
            cascade: true,
            eager: true,

        }
    )
    details?: RouteDetail[];

    
    @ManyToOne(() => Panel, panel => panel.routes, { onDelete: 'CASCADE' })
    panel: Panel




}

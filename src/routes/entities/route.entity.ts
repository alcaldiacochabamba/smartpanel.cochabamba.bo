import {  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RouteDetail } from "./route-detail.entity";
import { Panel } from "../../panels/entities/panel.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'routes' })
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({example:'57a9dd6d-cd3d-451f-ae69-33146af7f597', description: 'nos devolvera el identificador de la ruta',uniqueItems:true})
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ApiProperty()
    @Column('text', { unique: true })
    title: string;

    @ApiProperty()
    @Column('text', { nullable: false })
    origin: string;
    @ApiProperty()
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

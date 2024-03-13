import {  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Route } from "./route.entity";

@Entity({ name: 'route_details' })
export class RouteDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: true })
    title: string;

    @Column('text', { nullable: false })
    distance_desc: string;
    
    @Column('int', { nullable: false })
    distance: number;

    @Column('text', { nullable: false })
    duration_desc: string;
    
    @Column('int', { nullable: false })
    duration: number;

    @Column('text', { nullable: false })
    duration_in_traffic_desc: string;

    @Column('int', { nullable: false })
    duration_in_traffic: number;
   
    @Column('text', { nullable: true })
    end_address: string;

    @Column('text', { nullable: true })
    end_address_lat: string;

    @Column('text', { nullable: true })
    end_address_lng: string;

    @Column('text', { nullable: true })
    start_address: string;

    @Column('text', { nullable: true })
    start_address_lat: string;

    @Column('text', { nullable: true })
    start_address_lng: string;

    @Column({ type: 'date', nullable: false })
    register_date: Date;

    @ManyToOne(() => Route, route => route.details, { onDelete: 'CASCADE' })
    route: Route



}

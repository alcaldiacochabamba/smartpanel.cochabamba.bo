import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Route } from './route.entity';

@Entity({ name: 'route_details' })
export class RouteDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: false })
    title: string;

    @Column('int', { nullable: false })
    distance: number;

    @Column('int', { nullable: false })
    duration: number;

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

    /**
     * Attribute: created_at
     * Description: Date of route details creation
     * Example: 2022-01-01 8:01:00
     */
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', select: false })
    created_at: Date;

    /**
     * Attribute: updated_at
     * Description: Date of route detail update
     * Example: 2022-01-01 8:01:00
     */
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', select: false })
    updated_at: Date;

    @ManyToOne(() => Route, (route) => route.details, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @Column()
    route_id: string;
}

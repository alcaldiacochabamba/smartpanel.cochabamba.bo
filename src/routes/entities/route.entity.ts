import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { RouteDetail } from "./route-detail.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Lane } from "src/lanes/entities/lane.entity";

@Entity({ name: 'routes' })
export class Route {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text', { nullable: false })
    title: string;

    @ApiProperty()
    @Column('text', { nullable: false })
    destination: string;

    @Column('text', { nullable: false })
    mode: string;

    @Column('text', { nullable: true })
    departure_time: string;

    @Column('text', { nullable: true })
    traffic_model: string;

    @Column('integer',{nullable:false})
    order:number;

    /**
     * attribute: created_at
     * description: Fecha de creacion del ruta
     * example: 2022-01-01 8:01:00
     */
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    /**
     * attribute: updated_at
     * description: Fecha de actualizacion del ruta
     * example: 2022-01-01 8:01:00
     */
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;

    @OneToMany(() => RouteDetail, routedetail => routedetail.route,
        {
            cascade: true,
            eager: false,
        }
    )
    details?: RouteDetail[];

    @ManyToOne(() => Lane, lane => lane.routes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lane_id' })
    lane: Lane;

    @Column({select: false})
    lane_id: string;
}

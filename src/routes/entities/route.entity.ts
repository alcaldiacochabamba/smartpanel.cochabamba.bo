import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { RouteDetail } from "./route-detail.entity";
import { Panel } from "../../panels/entities/panel.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/users.entity";

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

    @Column('integer', { nullable: true })
    nivel: number;

    @Column('text', { nullable: true })
    orientation: string;

       /** 
     * attribute: user
     * description: Usuario creador del panel
     * example: <uuid>
    */
       @ManyToOne(() => User)
       @JoinColumn({ name: "user_id" })
       user: User;    
       @Column({ nullable: true })
       user_id: string;
   
    
    /**
     * attribute: created_at
     * description: Fecha de creacion del ruta
     * example: 2022-01-01 8:01:00
     */
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    /**
     * attribute: updated_at
     * description: Fecha de actualizacion del ruta
     * example: 2022-01-01 8:01:00
     */
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @OneToMany(() => RouteDetail, routedetail => routedetail.route,
        {
            cascade: true,
            eager: true,
        }
    )
    details?: RouteDetail[];

    @ManyToOne(() => Panel, panel => panel.routes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'panel_id' })
    panel: Panel;

    @Column()
    panel_id: string;

    @OneToMany(() => Route, route => route.parentRoute)
    subroutes: Route[]; // Add this line

    @ManyToOne(() => Route, route => route.subroutes, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'parent_route_id' }) parentRoute: Route;
    @Column({ nullable: true }) 
    parent_route_id: string;
}

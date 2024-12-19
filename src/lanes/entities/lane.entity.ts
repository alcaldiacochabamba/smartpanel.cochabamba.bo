import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Panel } from "../../panels/entities/panel.entity";
import { Route } from "src/routes/entities/route.entity";
@Entity({name:'lanes'})
export class Lane {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{nullable:false, unique: true})
    name:string;

    @Column('integer',{nullable:false})
    lane_number: number;

    @Column('text',{nullable:false})
    orientation:string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;

    @ManyToOne(() => Panel, panel => panel.lanes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'panel_id' })
    panel: Panel;

    @Column({select: false})
    panel_id:string;
    @OneToMany(() => Route, route => route.lane,{
        cascade: true,
        eager: false,

    })
    routes: Route[];


}

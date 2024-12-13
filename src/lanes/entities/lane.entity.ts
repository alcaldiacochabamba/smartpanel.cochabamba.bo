import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
//import { RouteDetail } from "./route-detail.entity";
import { Panel } from "../../panels/entities/panel.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/users.entity";
import { Route } from "src/routes/entities/route.entity";
@Entity({name:'lanes'})
export class Lane {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    //@ApiProperty()
    @Column('text',{nullable:false})
    name:string;

    @Column('integer',{nullable:false})
    lane_number: number;

    @Column('text',{nullable:false})
    orientation:string;

   
   /** 
     * attribute: user
     * description: Usuario creador del panel
     * example: <uuid>
    */
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;    
    @Column({ nullable: false, select: false })
    user_id: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;

    @ManyToOne(() => Panel, panel => panel.lanes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'panel_id' })
    panel: Panel;

    @Column()
    panel_id:string;
    @OneToMany(() => Route, route => route.lane,{
        cascade: true,
        eager: true,

    })
    routes: Route[];


}

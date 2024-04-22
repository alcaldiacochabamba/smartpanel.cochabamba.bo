import {  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/auth/entities/users.entity";
import { Message } from "src/messages/entities/message.entity";
import { Route } from "src/routes/entities/route.entity";

@Entity({ name: 'panels' })
export class Panel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * attribute: code
     * description: Codigo del panel
     * example: P001
     */
    @Column('text', { unique: true })
    code: string;

    /** 
     * attribute: location
     * description: Ubicacion del panel
     * example: Plaza de las banderas
     */
    @Column('text', { nullable: false })
    location: string;

    /** 
     * attribute: origin
     * description: Ubicacion de Origen del panel
     * example: -17.379260, -66.160593
     * example2: Plaza de las banderas
     * */ 
    @Column('text', { nullable: false })
    origin: string;

    /** 
     * attribute: active
     * description: Indica si el panel se encuentra activo
     * example: true
     * */
    @Column('boolean', { nullable: false, default: true  })
    active: boolean;

    /** 
     * attribute: user
     * description: Usuario creador del panel
     * example: <uuid>
    */
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;    
    @Column({ nullable: false })
    user_id: string;

    /**
     * attribute: created_at
     * description: Fecha de creacion del panel
     * example: 2022-01-01 8:01:00
     */
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    /**
     * attribute: updated_at
     * description: Fecha de actualizacion del panel
     * example: 2022-01-01 8:01:00
     */
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
    
    @OneToMany(() => Message, message => message.panel,
    {
        cascade: true,
        eager: true,

    })    
    messages?: Message[];    

    /** 
     * attribute: routes
     * description: Rutas del panel
     * example: Route[]
     */
    @OneToMany(() => Route, route => route.panel,
        {
            cascade: true,
            eager: true,

        }
    )
    routes?: Route[];

    

}

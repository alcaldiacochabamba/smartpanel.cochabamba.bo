import {  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "src/messages/entities/message.entity";
import { Lane } from "src/lanes/entities/lane.entity";
import { Exclude } from "class-transformer";


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
     * attribute: created_at
     * description: Fecha de creacion del panel
     * example: 2022-01-01 8:01:00
     */
    @Exclude()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select:false })
    created_at: Date;

    /**
     * attribute: updated_at
     * description: Fecha de actualizacion del panel
     * example: 2022-01-01 8:01:00
     */
    @Exclude()
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;
    
    @OneToMany(() => Lane, lane => lane.panel,{
        cascade: true,
        eager: false,
    })
    lanes: Lane[];


    @OneToMany(() => Message, message => message.panel,
    {
        cascade: true,
        eager: false,
    })    
    messages?: Message[];    
}

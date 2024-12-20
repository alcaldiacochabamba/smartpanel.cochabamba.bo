
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Panel } from "../../panels/entities/panel.entity";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * attribute: title
     * description: Titulo del mensaje
     * example: <string>
     */
    @Column('text', { unique: true })
    title: string;
   
    /**
     * attribute: description
     * description: Descripcion del mensaje
     * example: <string>
     */
    @Column('text', { nullable: false })
    description: string;
     
    /**
     * attribute: priority
     * description: Prioridad del mensaje
     * example: <string>
     */
    @Column('text', {  nullable: false })
    priority: string;

    /**
     * attribute: active
     * description: Indica si el mensaje esta activo
     * example: true
     */
    @Column('boolean', { nullable: false, default: true  })
    active: boolean;

    /**
     * attribute: icon
     * description: Icono del mensaje
     * example: <string>
     */
    @Column('text', { nullable: true })
    icon:string;
    
    /**
     * attribute: type
     * description: Tipo de mensaje
     * example: <string>
     */
    @Column('text', { nullable: true })
    type: string;

    /**
     * attribute: created_at
     * description: Fecha de creacion del panel
     * example: 2022-01-01 8:01:00
     */
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", select: false })
    created_at: Date;

    /**
     * attribute: updated_at
     * description: Fecha de actualizacion del panel
     * example: 2022-01-01 8:01:00
     */
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false })
    updated_at: Date;

    @ManyToOne(() => Panel, panel => panel.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'panel_id' })
    panel: Panel
    @Column({ select: false})
    panel_id: string


}

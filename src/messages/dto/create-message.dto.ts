import { IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    priority:string;
    
    @IsString()
    icon:string;
    
    @IsString()
    type:string;

    @IsUUID()
    panel_id:string;
    
}

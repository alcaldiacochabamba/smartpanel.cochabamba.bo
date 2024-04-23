import { IsOptional, IsString, IsUUID } from "class-validator";

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
    @IsOptional()
    user_id:string;

    @IsUUID()
    @IsOptional()
    panel_id:string;
    
}

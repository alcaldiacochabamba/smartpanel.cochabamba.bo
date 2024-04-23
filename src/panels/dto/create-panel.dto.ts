import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePanelDto {

    @IsString()
    code:string;

    @IsString()
    location:string;

    @IsString()
    origin:string;

    @IsUUID()
    @IsOptional()
    user_id:string;

}

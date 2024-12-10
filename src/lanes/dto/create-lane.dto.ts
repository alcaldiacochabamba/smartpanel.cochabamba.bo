import { IsOptional, IsString, IsUUID,IsInt} from "class-validator";
export class CreateLaneDto {
    @IsString()
    name:string;

    @IsString()
    orientation: string;

    @IsInt()
    lane_number:number;

    @IsUUID()
    @IsOptional()
    user_id:string;

    @IsUUID()
    panel_id: string;
    
}

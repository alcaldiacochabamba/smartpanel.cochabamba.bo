import { IsOptional, IsString, IsUUID,IsInt} from "class-validator";
export class CreateLaneDto {
    @IsString()
    name:string;

    @IsString()
    orientation: string;

    @IsInt()
    lane_number:number;

    @IsUUID()
    panel_id: string;
    
}

import { IsOptional, IsString, IsUUID,IsInt} from "class-validator";
export class CreateRouteDto {
    @IsString()
    title:string;

    @IsString()
    destination: string;

    @IsInt()
    order:number;

    @IsString()
    mode: string;

    @IsInt()
    @IsOptional()
    nivel: number;


    @IsUUID()
    lane_id: string;

    
    @IsUUID()
    @IsOptional()
    user_id:string;
}



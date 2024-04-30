import { IsOptional, IsString, IsUUID,IsInt} from "class-validator";
export class CreateRouteDto {
    @IsString()
    title:string;

    @IsString()
    destination: string;

    @IsString()
    mode: string;

    @IsString()
    departure_time: string;


    @IsString()
    traffic_model: string;

    @IsInt()
    nivel: number;

    @IsString()
    orientation: string;

    @IsUUID()
    panel_id: string;

    @IsUUID()
    @IsOptional()
    parent_route_id: string;

    @IsUUID()
    @IsOptional()
    user_id:string;
}



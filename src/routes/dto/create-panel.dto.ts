import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";
import { Route } from "../entities/route.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePanelDto {

    @ApiProperty({default:10, description:'HOw many rows '})
    @IsString()
    @MinLength(1)
    title: string;

    @IsUUID()
    uuid: string;

    @IsString()
    code: string;

    @IsString()
    @IsOptional()
    location: string;


    @IsBoolean()
    active: boolean;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    register_date: Date;


    @IsArray()
    @IsOptional()
    routes: Route[];

}

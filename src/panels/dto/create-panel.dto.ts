import { IsNotEmpty, IsOptional, IsString, IsUUID, Validate } from "class-validator";
import { IsUnique } from "src/validations/is-unique.validator";

export class CreatePanelDto {

    @IsNotEmpty()
    @IsString()
    @Validate(IsUnique, ['panels', 'code'])
    code:string;

    @IsString()
    @IsNotEmpty()
    location:string;

    @IsString()
    @IsNotEmpty()
    origin:string;

    @IsUUID()
    @IsOptional()
    user_id:string;

}

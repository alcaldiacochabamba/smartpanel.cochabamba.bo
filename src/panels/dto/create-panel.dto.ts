import { IsBoolean, IsNotEmpty, IsString, Validate } from "class-validator";
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

    @IsBoolean()
    active:boolean;

}

import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class SkuParamDto {
  @IsNotEmpty()
  @IsString()
  sku: string;
}

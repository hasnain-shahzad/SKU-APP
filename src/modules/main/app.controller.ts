import { Controller, Res, Get, Param, Query } from "@nestjs/common";
import { LoggerService } from "../../utils/logger/logger.service";
import { Response } from "express";
import { ResponseCode, ResponseMessage } from "../../utils/enum";
import { SkuParamDto } from "./common/app.dto";
import { AppService } from "./app.service";

@Controller("/sku")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext("AppController");
  }

  @Get()
  async get(
    @Query() queryParam: SkuParamDto,
    @Res() res: Response
  ): Promise<Response> {
    this.loggerService.log(`GET /api/sku/:sku api has been called`);
    const data = await this.appService.getCurrentStockBySku(queryParam.sku);
    return res.status(ResponseCode.SUCCESS).send({
      statusCode: ResponseCode.SUCCESS,
      message: ResponseMessage.SUCCESS,
      data
    });
  }
}

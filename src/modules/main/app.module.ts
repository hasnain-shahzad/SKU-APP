import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerModule } from "../../utils/logger/logger.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [AppService.envConfiguration()],
    }),
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

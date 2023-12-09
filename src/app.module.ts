import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OracleApiModule } from "./oracleApi/oracleApi.module";

@Module({
  imports: [OracleApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

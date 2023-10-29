import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OracleApiModule } from "./oracleApi/oracleApi.module";
import { OraclePriceModule } from "./oraclePrice/oraclePrice.module";

@Module({
  imports: [OracleApiModule, OraclePriceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

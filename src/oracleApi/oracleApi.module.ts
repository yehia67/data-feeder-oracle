import { Module } from "@nestjs/common";
import { OracleApiService } from "./oracleApi.service";

@Module({
  imports: [],
  providers: [OracleApiService],
  exports: [OracleApiService],
  controllers: [],
})
export class OracleApiModule {}

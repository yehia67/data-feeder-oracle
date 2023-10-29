import { Module } from "@nestjs/common";
import { OraclePriceService } from "./oraclePrice.service";

@Module({
  imports: [],
  providers: [OraclePriceService],
  exports: [OraclePriceService],
  controllers: [],
})
export class OraclePriceModule {}

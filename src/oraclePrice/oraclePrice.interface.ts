import type { ethers } from "ethers";
import type { IApiOracle } from "src/interfaces";

export interface IListenToOraclePrice {
  request: IApiOracle;
  oraclePriceContract: ethers.BaseContract;
}

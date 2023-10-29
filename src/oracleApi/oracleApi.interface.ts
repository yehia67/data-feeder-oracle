import type { ethers } from "ethers";
import type { IApiOracle } from "src/interfaces";

export interface IListenToOracleApi {
  request: IApiOracle;
  oracleApiContract: ethers.BaseContract;
}

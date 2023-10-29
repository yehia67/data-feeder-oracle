import type { ethers } from "ethers";
import type { IApiOracle, IOraclePrice } from "src/interfaces";

export interface IListenToBaseOracle {
  oracleContract: ethers.BaseContract;
}

export interface IListenToApiOracle extends IListenToBaseOracle {
  request: IApiOracle;
}

export interface IListenToPriceOracle extends IListenToBaseOracle {
  request: IOraclePrice;
}

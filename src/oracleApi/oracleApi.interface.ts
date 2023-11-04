import type { ethers } from "ethers";
import type { IApiOracle, IPokemonOracle, IPriceOracle } from "src/interfaces";

export interface IListenToBaseOracle {
  oracleContract: ethers.BaseContract;
}

export interface IListenToApiOracle extends IListenToBaseOracle {
  request: IApiOracle;
}

export interface IListenToPriceOracle extends IListenToBaseOracle {
  request: IPriceOracle;
}

export interface IListenToPokemonOracle extends IListenToBaseOracle {
  request: IPokemonOracle;
}

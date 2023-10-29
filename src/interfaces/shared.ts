export type OracleType = "OracleApi" | "OraclePrice";

export interface IBaseOracle {
  id: string;
  oracleType: OracleType;
}
export interface IApiOracle extends IBaseOracle {
  url: string;
}

export interface IOraclePrice extends IBaseOracle {
  fiatSymbol: string;
  ccSymbol: string;
}

export type IOracleRequest = IApiOracle | IOraclePrice;

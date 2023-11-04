export type OracleType = "OracleApi" | "OraclePrice" | "OraclePokemon";

export interface IBaseOracle {
  id: string;
  oracleType: OracleType;
}
export interface IApiOracle extends IBaseOracle {
  url: string;
}

export interface IPriceOracle extends IBaseOracle {
  fiatSymbol: string;
  ccSymbol: string;
}

export interface IPokemonOracle extends IBaseOracle {
  submitter: string;
}

export type IOracleRequest = IApiOracle | IPriceOracle | IPokemonOracle;

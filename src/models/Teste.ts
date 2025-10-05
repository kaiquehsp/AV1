import { TipoTeste, ResultadoTeste } from "./enums";
export class Teste {
  constructor(public id: string, public tipo: TipoTeste, public resultado: ResultadoTeste, public data: Date) {}
}
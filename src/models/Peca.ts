import { TipoPeca, StatusPeca } from "./enums";
export class Peca {
  constructor(public id: string, public nome: string, public tipo: TipoPeca, public fornecedor: string, public status: StatusPeca) {}
}
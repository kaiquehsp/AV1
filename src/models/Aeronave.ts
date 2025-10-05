import { TipoAeronave } from "./enums";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";

export class Aeronave {
  constructor(
    public codigo: string,
    public modelo: string,
    public tipo: TipoAeronave,
    public capacidade: number,
    public alcance: number,
    public pecas: Peca[] = [],
    public etapas: Etapa[] = [],
    public testes: Teste[] = []
  ) {}
}
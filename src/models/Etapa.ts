import { StatusEtapa } from "./enums";
import { Funcionario } from "./Funcionario";

export class Etapa {
  constructor(
    public id: string,
    public nome: string,
    public prazo: Date,
    public status: StatusEtapa = StatusEtapa.PENDENTE,
    public funcionariosAlocados: Funcionario[] = []
  ) {}
}
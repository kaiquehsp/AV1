import { NivelPermissao } from "./enums";
export class Funcionario {
  constructor(public id: string, public nome: string, public telefone: string, public endereco: string, public usuario: string, public senha: string, public nivelPermissao: NivelPermissao) {}
}
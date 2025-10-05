import { Funcionario } from "../models/Funcionario";
import { NivelPermissao } from "../models/enums";
import { FileManager } from "./FileManager";

export class AuthService {
  private static usuarioLogado: Funcionario | null = null;
  private static readonly ARQUIVO_FUNCIONARIOS = 'funcionarios.txt';

  public static login(usuario: string, senha: string): boolean {
    const funcionarios = FileManager.carregar<Funcionario>(this.ARQUIVO_FUNCIONARIOS);
    const func = funcionarios.find(f => f.usuario === usuario && f.senha === senha);
    if (func) {
      this.usuarioLogado = func;
      return true;
    }
    return false;
  }

  public static logout(): void {
    this.usuarioLogado = null;
  }

  public static getUsuarioLogado(): Funcionario | null {
    return this.usuarioLogado;
  }

  public static verificarPermissao(niveisPermitidos: NivelPermissao[]): boolean {
    if (!this.usuarioLogado) return false;
    return niveisPermitidos.includes(this.usuarioLogado.nivelPermissao);
  }
}
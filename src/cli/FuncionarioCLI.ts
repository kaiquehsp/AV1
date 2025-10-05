import inquirer from 'inquirer';
import { Funcionario } from '../models/Funcionario';
import { NivelPermissao } from '../models/enums';
import { FileManager } from '../services/FileManager';
import { AuthService } from '../services/AuthService';

export class FuncionarioCLI {
  private static readonly ARQUIVO = 'funcionarios.txt';

  public static async gerenciar(): Promise<void> {
    if (!AuthService.verificarPermissao([NivelPermissao.ADMINISTRADOR])) {
        console.log('\nAcesso negado. Apenas administradores podem gerenciar funcionários.');
        return;
    }

    let executando = true;
    while (executando) {
      console.log('\n--- Gerenciar Funcionários ---');
      const { opcao } = await inquirer.prompt({
        type: 'list', name: 'opcao', message: 'Escolha uma ação:',
        choices: ['Listar', 'Cadastrar', 'Excluir', 'Voltar'],
      });

      switch (opcao) {
        case 'Listar': await this.listar(); break;
        case 'Cadastrar': await this.cadastrar(); break;
        case 'Excluir': await this.excluir(); break;
        case 'Voltar': executando = false; break;
      }
    }
  }

  private static async listar(): Promise<void> {
    const funcionarios = FileManager.carregar<Funcionario>(this.ARQUIVO);
    if (!funcionarios.length) {
      console.log('\nNenhum funcionário cadastrado.');
      return;
    }
    console.table(funcionarios.map(f => ({id: f.id, nome: f.nome, usuario: f.usuario, permissao: f.nivelPermissao})));
  }

  private static async cadastrar(): Promise<void> {
    const respostas = await inquirer.prompt([
      { name: 'id', message: 'ID:' },
      { name: 'nome', message: 'Nome:' },
      { name: 'telefone', message: 'Telefone:' },
      { name: 'endereco', message: 'Endereço:' },
      { name: 'usuario', message: 'Usuário de acesso:' },
      { type: 'password', name: 'senha', message: 'Senha:', mask: '*' },
      { type: 'list', name: 'nivelPermissao', message: 'Nível de Permissão:', choices: Object.values(NivelPermissao) },
    ]);
    const funcionarios = FileManager.carregar<Funcionario>(this.ARQUIVO);
    if (funcionarios.some(f => f.id === respostas.id || f.usuario === respostas.usuario)) {
        console.log('\nErro: ID ou usuário já cadastrado.');
        return;
    }
    const novo = new Funcionario(respostas.id, respostas.nome, respostas.telefone, respostas.endereco, respostas.usuario, respostas.senha, respostas.nivelPermissao);
    funcionarios.push(novo);
    FileManager.salvar(this.ARQUIVO, funcionarios);
    console.log('\nFuncionário cadastrado com sucesso!');
  }

  private static async excluir(): Promise<void> {
    const funcionarios = FileManager.carregar<Funcionario>(this.ARQUIVO);
    if (!funcionarios.length) {
        console.log('\nNenhum funcionário para excluir.');
        return;
    }
    const { idParaExcluir } = await inquirer.prompt({
        type: 'list', name: 'idParaExcluir', message: 'Qual funcionário deseja excluir?',
        choices: funcionarios.map(f => ({name: `${f.nome} (ID: ${f.id})`, value: f.id}))
    });
    const novosFuncionarios = funcionarios.filter(f => f.id !== idParaExcluir);
    FileManager.salvar(this.ARQUIVO, novosFuncionarios);
    console.log('\nFuncionário excluído com sucesso!');
  }
}
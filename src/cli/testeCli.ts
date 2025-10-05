import inquirer from 'inquirer';
import { Teste } from '../models/Teste';
import { TipoTeste, ResultadoTeste } from '../models/enums';
import { FileManager } from '../services/FileManager';
import { AuthService } from '../services/AuthService';
import { NivelPermissao } from '../models/enums';

export class TesteCLI {
  private static readonly ARQUIVO = 'testes.txt';

  public static async gerenciar(): Promise<void> {
    if (!AuthService.verificarPermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])) {
        console.log('\nAcesso negado. Apenas Administradores e Engenheiros podem gerenciar testes.');
        return;
    }

    let executando = true;
    while (executando) {
      console.log('\n--- Gerenciar Testes ---');
      const { opcao } = await inquirer.prompt({
        type: 'list', name: 'opcao', message: 'Escolha uma ação:',
        choices: ['Listar Testes', 'Registrar Novo Teste', 'Excluir Teste', 'Voltar'],
      });

      switch (opcao) {
        case 'Listar Testes': await this.listar(); break;
        case 'Registrar Novo Teste': await this.registrar(); break;
        case 'Excluir Teste': await this.excluir(); break;
        case 'Voltar': executando = false; break;
      }
    }
  }

  private static async listar(): Promise<void> {
    const testes = FileManager.carregar<Teste>(this.ARQUIVO);
    if (!testes.length) {
      console.log('\nNenhum teste registrado.');
      return;
    }
    console.table(testes.map(t => ({...t, data: t.data.toLocaleString()})));
  }

  private static async registrar(): Promise<void> {
    const respostas = await inquirer.prompt([
      { name: 'id', message: 'ID do Teste:' },
      { type: 'list', name: 'tipo', message: 'Tipo de Teste:', choices: Object.values(TipoTeste) },
      { type: 'list', name: 'resultado', message: 'Resultado do Teste:', choices: Object.values(ResultadoTeste) },
    ]);

    const testes = FileManager.carregar<Teste>(this.ARQUIVO);
    if (testes.some(t => t.id === respostas.id)) {
        console.log('\nErro: ID já utilizado em outro teste.');
        return;
    }
    
    
    const novoTeste = new Teste(respostas.id, respostas.tipo, respostas.resultado, new Date());
    testes.push(novoTeste);
    FileManager.salvar(this.ARQUIVO, testes);
    console.log('\nTeste registrado com sucesso!');
  }

  private static async excluir(): Promise<void> {
    const testes = FileManager.carregar<Teste>(this.ARQUIVO);
    if (!testes.length) {
      console.log('\nNenhum teste para excluir.');
      return;
    }
    const { idParaExcluir } = await inquirer.prompt({
      type: 'list',
      name: 'idParaExcluir',
      message: 'Qual teste deseja excluir?',
      choices: testes.map(t => ({ name: `[${t.id}] ${t.tipo} - ${t.resultado}`, value: t.id })),
    });

    const novosTestes = testes.filter(t => t.id !== idParaExcluir);
    FileManager.salvar(this.ARQUIVO, novosTestes);
    console.log('\nTeste excluído com sucesso!');
  }
}
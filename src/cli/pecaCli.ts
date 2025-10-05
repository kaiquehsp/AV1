import inquirer from 'inquirer';
import { Peca } from '../models/Peca';
import { StatusPeca, TipoPeca } from '../models/enums';
import { FileManager } from '../services/FileManager';
import { AuthService } from '../services/AuthService';
import { NivelPermissao } from '../models/enums';

export class PecaCLI {
  private static readonly ARQUIVO = 'pecas.txt';

  public static async gerenciar(): Promise<void> {
    if (!AuthService.verificarPermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])) {
        console.log('\nAcesso negado.');
        return;
    }

    let executando = true;
    while (executando) {
      console.log('\n--- Gerenciar Peças ---');
      const { opcao } = await inquirer.prompt({
        type: 'list', name: 'opcao', message: 'Escolha uma ação:',
        choices: ['Listar', 'Cadastrar', 'Atualizar Status', 'Excluir', 'Voltar'],
      });

      switch (opcao) {
        case 'Listar': await this.listar(); break;
        case 'Cadastrar': await this.cadastrar(); break;
        case 'Atualizar Status': await this.atualizarStatus(); break;
        case 'Excluir': await this.excluir(); break;
        case 'Voltar': executando = false; break;
      }
    }
  }

  private static async listar(): Promise<void> {
    const pecas = FileManager.carregar<Peca>(this.ARQUIVO);
    if (!pecas.length) { console.log('\nNenhuma peça cadastrada.'); return; }
    console.table(pecas);
  }

  private static async cadastrar(): Promise<void> {
    const respostas = await inquirer.prompt([
      { name: 'id', message: 'ID da Peça:' },
      { name: 'nome', message: 'Nome:' },
      { type: 'list', name: 'tipo', message: 'Tipo:', choices: Object.values(TipoPeca) },
      { name: 'fornecedor', message: 'Fornecedor:' },
      { type: 'list', name: 'status', message: 'Status Inicial:', choices: Object.values(StatusPeca) },
    ]);
    const pecas = FileManager.carregar<Peca>(this.ARQUIVO);
    pecas.push(new Peca(respostas.id, respostas.nome, respostas.tipo, respostas.fornecedor, respostas.status));
    FileManager.salvar(this.ARQUIVO, pecas);
    console.log('\nPeça cadastrada com sucesso!');
  }

  private static async atualizarStatus(): Promise<void> {
    const pecas = FileManager.carregar<Peca>(this.ARQUIVO);
    if (!pecas.length) { console.log('\nNenhuma peça para atualizar.'); return; }
    const { pecaId, novoStatus } = await inquirer.prompt([
        { type: 'list', name: 'pecaId', message: 'Selecione a peça:', choices: pecas.map(p => ({name: `${p.nome} (Status: ${p.status})`, value: p.id}))},
        { type: 'list', name: 'novoStatus', message: 'Selecione o novo status:', choices: Object.values(StatusPeca)}
    ]);
    const peca = pecas.find(p => p.id === pecaId);
    if (peca) {
        peca.status = novoStatus;
        FileManager.salvar(this.ARQUIVO, pecas);
        console.log('\nStatus atualizado com sucesso!');
    }
  }

  private static async excluir(): Promise<void> {
    const pecas = FileManager.carregar<Peca>(this.ARQUIVO);
    if (!pecas.length) { console.log('\nNenhuma peça para excluir.'); return; }
    const { idParaExcluir } = await inquirer.prompt({
        type: 'list', name: 'idParaExcluir', message: 'Qual peça deseja excluir?',
        choices: pecas.map(p => ({name: `${p.nome} (ID: ${p.id})`, value: p.id}))
    });
    const novasPecas = pecas.filter(p => p.id !== idParaExcluir);
    FileManager.salvar(this.ARQUIVO, novasPecas);
    console.log('\nPeça excluída com sucesso!');
  }
}
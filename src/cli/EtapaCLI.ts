import inquirer from 'inquirer';
import { Etapa } from '../models/Etapa';
import { Funcionario } from '../models/Funcionario';
import { StatusEtapa } from '../models/enums';
import { FileManager } from '../services/FileManager';
import { AuthService } from '../services/AuthService';
import { NivelPermissao } from '../models/enums';

export class EtapaCLI {
  private static readonly ARQUIVO = 'etapas.txt';

  public static async gerenciar(): Promise<void> {
    if (!AuthService.verificarPermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO])) {
        console.log('\nAcesso negado. Apenas Administradores e Engenheiros podem gerenciar etapas.');
        return;
    }

    let executando = true;
    while (executando) {
      console.log('\n--- Gerenciar Etapas de Produção ---');
      const { opcao } = await inquirer.prompt({
        type: 'list', name: 'opcao', message: 'Escolha uma ação:',
        choices: ['Listar', 'Cadastrar', 'Atualizar Status', 'Alocar Funcionário', 'Excluir', 'Voltar'],
      });

      switch (opcao) {
        case 'Listar': await this.listar(); break;
        case 'Cadastrar': await this.cadastrar(); break;
        case 'Atualizar Status': await this.atualizarStatus(); break;
        case 'Alocar Funcionário': await this.alocarFuncionario(); break;
        case 'Excluir': await this.excluir(); break;
        case 'Voltar': executando = false; break;
      }
    }
  }

  private static async listar(): Promise<void> {
    const etapas = FileManager.carregar<Etapa>(this.ARQUIVO);
    if (!etapas.length) {
      console.log('\nNenhuma etapa cadastrada.');
      return;
    }
    console.table(etapas.map(e => ({...e, prazo: e.prazo.toLocaleDateString(), funcionariosAlocados: e.funcionariosAlocados?.map(f => f.nome).join(', ') || 'Nenhum' })));
  }

  private static async cadastrar(): Promise<void> {
    const respostas = await inquirer.prompt([
      { name: 'id', message: 'ID da Etapa:' },
      { name: 'nome', message: 'Nome da Etapa (ex: Montagem da Fuselagem):' },
      { name: 'prazo', message: 'Prazo de Conclusão (formato: AAAA-MM-DD):' },
    ]);

    const etapas = FileManager.carregar<Etapa>(this.ARQUIVO);
    if (etapas.some(e => e.id === respostas.id)) {
        console.log('\nErro: ID já cadastrado para outra etapa.');
        return;
    }
    
    const novaEtapa = new Etapa(respostas.id, respostas.nome, new Date(respostas.prazo), StatusEtapa.PENDENTE);
    etapas.push(novaEtapa);
    FileManager.salvar(this.ARQUIVO, etapas);
    console.log('\nEtapa cadastrada com sucesso!');
  }

  private static async atualizarStatus(): Promise<void> {
    const etapas = FileManager.carregar<Etapa>(this.ARQUIVO);
    if (!etapas.length) {
      console.log('\nNenhuma etapa para atualizar.');
      return;
    }

    const { etapaId, novoStatus } = await inquirer.prompt([
      {
        type: 'list',
        name: 'etapaId',
        message: 'Selecione a etapa para atualizar o status:',
        choices: etapas.map(e => ({ name: `${e.nome} (Status atual: ${e.status})`, value: e.id })),
      },
      {
        type: 'list',
        name: 'novoStatus',
        message: 'Selecione o novo status:',
        choices: Object.values(StatusEtapa),
      },
    ]);

    const etapaParaAtualizar = etapas.find(e => e.id === etapaId);
    if (etapaParaAtualizar) {
      etapaParaAtualizar.status = novoStatus;
      FileManager.salvar(this.ARQUIVO, etapas);
      console.log('\nStatus da etapa atualizado com sucesso!');
    }
  }
  
  private static async alocarFuncionario(): Promise<void> {
    const etapas = FileManager.carregar<Etapa>(this.ARQUIVO);
    const funcionarios = FileManager.carregar<Funcionario>('funcionarios.txt');

    if (!etapas.length || !funcionarios.length) {
        console.log('\nÉ necessário ter ao menos uma etapa e um funcionário cadastrado para realizar a alocação.');
        return;
    }

    const { etapaId } = await inquirer.prompt({
        type: 'list', name: 'etapaId', message: 'Selecione a etapa:',
        choices: etapas.map(e => ({name: e.nome, value: e.id})),
    });

    const etapaSelecionada = etapas.find(e => e.id === etapaId);
    if (!etapaSelecionada) return;

    const funcionariosDisponiveis = funcionarios.filter(
        func => !etapaSelecionada.funcionariosAlocados?.some(alocado => alocado.id === func.id)
    );

    if (!funcionariosDisponiveis.length) {
        console.log('\nTodos os funcionários já estão alocados nesta etapa.');
        return;
    }

    const { funcId } = await inquirer.prompt({
        type: 'list', name: 'funcId', message: 'Selecione o funcionário para alocar:',
        choices: funcionariosDisponiveis.map(f => ({name: f.nome, value: f.id})),
    });

    const funcionarioSelecionado = funcionarios.find(f => f.id === funcId);
    if (funcionarioSelecionado) {
        if (!etapaSelecionada.funcionariosAlocados) {
            etapaSelecionada.funcionariosAlocados = [];
        }
        etapaSelecionada.funcionariosAlocados.push(funcionarioSelecionado);
        FileManager.salvar(this.ARQUIVO, etapas);
        console.log(`\nFuncionário ${funcionarioSelecionado.nome} alocado à etapa ${etapaSelecionada.nome} com sucesso!`);
    }
  }

  private static async excluir(): Promise<void> {
    const etapas = FileManager.carregar<Etapa>(this.ARQUIVO);
    if (!etapas.length) {
      console.log('\nNenhuma etapa para excluir.');
      return;
    }
    const { idParaExcluir } = await inquirer.prompt({
      type: 'list',
      name: 'idParaExcluir',
      message: 'Qual etapa deseja excluir?',
      choices: etapas.map(e => ({ name: `${e.nome} (ID: ${e.id})`, value: e.id })),
    });

    const novasEtapas = etapas.filter(e => e.id !== idParaExcluir);
    FileManager.salvar(this.ARQUIVO, novasEtapas);
    console.log('\nEtapa excluída com sucesso!');
  }
}
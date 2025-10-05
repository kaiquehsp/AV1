import inquirer from 'inquirer';
import { Aeronave } from '../models/Aeronave';
import { Peca } from '../models/Peca';
import { Etapa } from '../models/Etapa';
import { Teste } from '../models/Teste';
import { TipoAeronave } from '../models/enums';
import { FileManager } from '../services/FileManager';

export class AeronaveCLI {
  private static readonly ARQUIVO = 'aeronaves.txt';

  public static async gerenciar(): Promise<void> {
    let executando = true;
    while(executando) {
      console.log('\n--- Gerenciar Aeronaves ---');
      const { opcao } = await inquirer.prompt({
        type: 'list', name: 'opcao', message: 'Escolha uma ação:',
        choices: ['Listar', 'Cadastrar', 'Detalhar Aeronave', 'Vincular Componente', 'Excluir', 'Voltar'],
      });

      switch (opcao) {
        case 'Listar': await this.listar(); break;
        case 'Cadastrar': await this.cadastrar(); break;
        case 'Detalhar Aeronave': await this.detalhar(); break;
        case 'Vincular Componente': await this.vincularComponente(); break;
        case 'Excluir': await this.excluir(); break;
        case 'Voltar': executando = false; break;
      }
    }
  }
  
  private static async listar(): Promise<void> {
    const aeronaves = FileManager.carregar<Aeronave>(this.ARQUIVO);
    if (!aeronaves.length) { console.log('\nNenhuma aeronave cadastrada.'); return; }
    console.table(aeronaves.map(a => ({codigo: a.codigo, modelo: a.modelo, tipo: a.tipo})));
  }

  private static async cadastrar(): Promise<void> {
    const respostas = await inquirer.prompt([
      { name: 'codigo', message: 'Código da Aeronave:'},
      { name: 'modelo', message: 'Modelo:'},
      { type: 'list', name: 'tipo', message: 'Tipo:', choices: Object.values(TipoAeronave)},
      { name: 'capacidade', message: 'Capacidade de Passageiros:', type: 'number'},
      { name: 'alcance', message: 'Alcance (km):', type: 'number'},
    ]);
    const aeronaves = FileManager.carregar<Aeronave>(this.ARQUIVO);
    
    if (aeronaves.some(a => a.codigo === respostas.codigo)) {
        console.log('\nErro: Já existe uma aeronave com este código. Tente novamente.');
        return;
    }

    aeronaves.push(new Aeronave(respostas.codigo, respostas.modelo, respostas.tipo, respostas.capacidade, respostas.alcance));
    FileManager.salvar(this.ARQUIVO, aeronaves);
    console.log('\nAeronave cadastrada com sucesso!');
  }
  
  private static async detalhar(): Promise<void> {
    const aeronaves = FileManager.carregar<Aeronave>(this.ARQUIVO);
    if (!aeronaves.length) { console.log('\nNenhuma aeronave cadastrada.'); return; }
    const { codigo } = await inquirer.prompt({
        type: 'list', name: 'codigo', message: 'Selecione a aeronave para ver detalhes:',
        choices: aeronaves.map(a => ({name: `${a.modelo} (${a.codigo})`, value: a.codigo}))
    });
    const aeronave = aeronaves.find(a => a.codigo === codigo);
    if (aeronave) {
        console.log(`\n--- Detalhes da Aeronave: ${aeronave.modelo} [${aeronave.codigo}] ---`);
        console.log(`Tipo: ${aeronave.tipo}, Capacidade: ${aeronave.capacidade}, Alcance: ${aeronave.alcance}km`);
        console.log('Peças:', aeronave.pecas?.map(p => p.nome).join(', ') || 'Nenhuma');
        console.log('Etapas:', aeronave.etapas?.map(e => e.nome).join(', ') || 'Nenhuma');
        console.log('Testes:', aeronave.testes?.map(t => t.tipo).join(', ') || 'Nenhum');
    }
  }

  private static async vincularComponente(): Promise<void> {
    console.log('\nFunção para vincular peças, etapas e testes a uma aeronave a ser implementada.');
  }
  
  private static async excluir(): Promise<void> {
     console.log('\nFunção para excluir uma aeronave a ser implementada.');
  }
}
import inquirer from 'inquirer';
import { AuthService } from '../services/AuthService';
import { AeronaveCLI } from './AeronaveCli';
import { EtapaCLI } from './EtapaCLI';
import { FuncionarioCLI } from './FuncionarioCLI';
import { PecaCLI } from './pecaCli';
import { RelatorioCLI } from './RelatorioCLI';
import { TesteCLI } from './testeCli';

export class Menu {
  public static async exibir(): Promise<void> {
    const usuario = AuthService.getUsuarioLogado();
    if (!usuario) { console.log('Erro: nenhum usuário logado.'); return; }

    console.log(`\nBem-vindo(a), ${usuario.nome}! [${usuario.nivelPermissao}]`);

    const { opcao } = await inquirer.prompt({
      type: 'list', name: 'opcao', message: 'Sistema Aerocode - Menu Principal',
      choices: [
        'Gerenciar Aeronaves', 'Gerenciar Peças', 'Gerenciar Etapas', 
        'Gerenciar Testes', 'Gerenciar Funcionários', 'Gerar Relatório', 'Sair',
      ],
    });

    switch (opcao) {
      case 'Gerenciar Aeronaves': await AeronaveCLI.gerenciar(); break;
      case 'Gerenciar Peças': await PecaCLI.gerenciar(); break;
      case 'Gerenciar Etapas': await EtapaCLI.gerenciar(); break;
      case 'Gerenciar Testes': await TesteCLI.gerenciar(); break;
      case 'Gerenciar Funcionários': await FuncionarioCLI.gerenciar(); break;
      case 'Gerar Relatório': await RelatorioCLI.gerenciar(); break;
      case 'Sair':
        AuthService.logout();
        console.log('\nLogout realizado. Até logo!');
        process.exit(0);
    }
  }
}
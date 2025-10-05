import inquirer from 'inquirer';
import { AuthService } from './services/AuthService';
import { Menu } from './cli/Menu';
import { FileManager } from './services/FileManager';
import { Funcionario } from './models/Funcionario';
import { NivelPermissao } from './models/enums';

const ARQUIVO_FUNCIONARIOS = 'funcionarios.txt';

async function criarPrimeiroAdmin(): Promise<void> {
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    console.log('Bem-vindo ao Sistema Aerocode!');
    console.log('Nenhum usuário encontrado. Vamos criar o primeiro administrador.');
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');

    const respostas = await inquirer.prompt([
        { name: 'id', message: 'Defina um ID para o admin (ex: "admin01"):' },
        { name: 'nome', message: 'Nome completo do administrador:' },
        { name: 'telefone', message: 'Telefone:' },
        { name: 'endereco', message: 'Endereço:' },
        { name: 'usuario', message: 'Defina um nome de usuário para login:' },
        { type: 'password', name: 'senha', message: 'Defina uma senha:', mask: '*' },
    ]);

    const admin = new Funcionario(
        respostas.id,
        respostas.nome,
        respostas.telefone,
        respostas.endereco,
        respostas.usuario,
        respostas.senha,
        NivelPermissao.ADMINISTRADOR
    );

    FileManager.salvar(ARQUIVO_FUNCIONARIOS, [admin]);
    console.log('\nAdministrador criado com sucesso! Agora você pode fazer o login.');
}

async function main() {
  console.log('=========================');
  console.log('    SISTEMA AEROCODE     ');
  console.log('=========================');

  const funcionarios = FileManager.carregar<Funcionario>(ARQUIVO_FUNCIONARIOS);
  if (funcionarios.length === 0) {
    await criarPrimeiroAdmin();
  }

  let logado = false;
  while (!logado) {
    console.log('\n--- TELA DE LOGIN ---');
    const { usuario, senha } = await inquirer.prompt([
      { name: 'usuario', message: 'Usuário:' },
      { type: 'password', name: 'senha', message: 'Senha:', mask: '*' },
    ]);
    logado = AuthService.login(usuario, senha);
    if (!logado) {
      console.log('\nUsuário ou senha inválidos. Tente novamente.\n');
    }
  }

  while (true) {
    await Menu.exibir();
  }
}

main();
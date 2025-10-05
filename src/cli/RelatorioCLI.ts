import inquirer from "inquirer";
import { Aeronave } from "../models/Aeronave";
import { Relatorio } from "../models/Relatorio";
import { FileManager } from "../services/FileManager";
import { RelatorioService } from "../services/RelatorioService";

export class RelatorioCLI {
    public static async gerenciar(): Promise<void> {
        console.log('\n--- Geração de Relatório ---');
        
        const aeronaves = FileManager.carregar<Aeronave>('aeronaves.txt');
        if (!aeronaves.length) {
            console.log('\nNenhuma aeronave cadastrada para gerar relatório.');
            return;
        }

        const { aeronaveCodigo } = await inquirer.prompt({
            type: 'list',
            name: 'aeronaveCodigo',
            message: 'Selecione a aeronave para o relatório:',
            choices: aeronaves.map(a => ({name: `${a.modelo} (${a.codigo})`, value: a.codigo}))
        });

        const aeronaveSelecionada = aeronaves.find(a => a.codigo === aeronaveCodigo);
        if (!aeronaveSelecionada) return;

        const respostas = await inquirer.prompt([
            { name: 'cliente', message: 'Nome do Cliente:'},
            { name: 'dataEntrega', message: 'Data de Entrega (AAAA-MM-DD):'},
        ]);

        const relatorio = new Relatorio(
            aeronaveSelecionada,
            respostas.cliente,
            new Date(respostas.dataEntrega)
        );

        const nomeArquivo = `relatorio_${aeronaveSelecionada.codigo}_${Date.now()}.txt`;
        RelatorioService.salvarRelatorio(relatorio, nomeArquivo);
    }
}
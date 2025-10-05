import * as fs from "fs";
import * as path from "path";
import { Relatorio } from "../models/Relatorio";

export class RelatorioService {
  public static salvarRelatorio(relatorio: Relatorio, nomeArquivo: string): void {
    const relatoriosDir = path.resolve(__dirname, '..', '..', 'relatorios');
    if (!fs.existsSync(relatoriosDir)) {
        fs.mkdirSync(relatoriosDir, { recursive: true });
    }
    const caminho = path.join(relatoriosDir, nomeArquivo);
    fs.writeFileSync(caminho, relatorio.gerar(), "utf-8");
    console.log(`\nRelatório salvo com sucesso em: ${caminho}`);
  }
}
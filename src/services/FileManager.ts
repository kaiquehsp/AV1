import * as fs from "fs";
import * as path from "path";

export class FileManager {
  private static dataDir = path.resolve(__dirname, '..', '..', 'data');

  private static ensureDataDirExists(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  public static salvar(nomeArquivo: string, dados: any[]): void {
    this.ensureDataDirExists();
    const caminho = path.join(this.dataDir, nomeArquivo);
    const replacer = (key: any, value: any) => value instanceof Date ? value.toISOString() : value;
    fs.writeFileSync(caminho, JSON.stringify(dados, replacer, 2), "utf-8");
  }

  public static carregar<T>(nomeArquivo: string): T[] {
    this.ensureDataDirExists();
    const caminho = path.join(this.dataDir, nomeArquivo);
    if (!fs.existsSync(caminho)) return [];
    
    const conteudo = fs.readFileSync(caminho, "utf-8");
    if (conteudo.trim() === '') return [];

    const reviver = (key: any, value: any) => 
      (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) 
      ? new Date(value) 
      : value;

    return JSON.parse(conteudo, reviver) as T[];
  }
}
import { Aeronave } from "./Aeronave";
export class Relatorio {
  constructor(public aeronave: Aeronave, public cliente: string, public dataEntrega: Date) {}

  public gerar(): string {
    const pecasInfo = this.aeronave.pecas.map(p => `  - [${p.id}] ${p.nome} (${p.status})`).join('\n');
    const etapasInfo = this.aeronave.etapas.map(e => `  - [${e.id}] ${e.nome} (${e.status})`).join('\n');
    const testesInfo = this.aeronave.testes.map(t => `  - [${t.id}] Teste ${t.tipo}: ${t.resultado}`).join('\n');

    return `
=========================================
      RELATÓRIO FINAL DA AERONAVE
=========================================
Cliente: ${this.cliente}
Data de Entrega Prevista: ${this.dataEntrega.toLocaleDateString()}

--- DADOS DA AERONAVE ---
Código: ${this.aeronave.codigo}
Modelo: ${this.aeronave.modelo}

--- COMPONENTES ---
Peças:
${pecasInfo || '  Nenhuma peça associada.'}

Etapas de Produção:
${etapasInfo || '  Nenhuma etapa associada.'}

Testes Realizados:
${testesInfo || '  Nenhum teste associado.'}
=========================================
    `;
  }
}
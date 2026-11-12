# Documentação da API

Refs #3. Esta rodada continua o PR #2 e altera apenas a apresentação da documentação Swagger existente. O contrato, os endpoints e a restrição que desativa a documentação em produção permanecem.

O tema usa carvão, verde claro nas ações e as cores dos métodos HTTP. Outfit e DM Mono são servidas pelo próprio aplicativo, com licenças em `src/docs/assets`; a CSP não precisa permitir novos domínios. Os controles têm altura mínima de 44 px. No celular, descrições e parâmetros se reorganizam em linhas, com margens de 20 px.

O viewport e o idioma são definidos pelo script local `docs-ui.js`. O CSS original de movimento da design-taste-frontend está copiado sem alterações. A documentação mantém altura natural para permitir consulta rápida; não foi convertida em uma landing page com blocos de tela inteira.

## Verificação da rodada

- Lint aprovado; permanece um aviso de configuração obsoleta do Biome.
- 21 testes de unidade/integração aprovados em MongoDB temporário. Cobertura de linhas: 95,23%.
- 7 testes E2E aprovados: abertura e fechamento de todas as operações e modelos, execução do health check, foco e ausência de transbordamento em 320, 390, 768 e 1440 px, além do CRUD e rejeição de operadores de banco. Nenhum dado real foi usado.
- Auditoria npm sem vulnerabilidades após atualizar Sentry dentro da versão principal 11 e fixar as dependências transitivas de test-exclude em glob 14.0.5 e minimatch 11.0.8. A cobertura foi executada novamente para verificar compatibilidade; o nível de auditoria do CI foi preservado.
- Os sete E2E foram repetidos e aprovados após os últimos ajustes de toque e acessibilidade.

## Antes e depois

| Observação | Antes | Depois |
|---|---|---|
| Captura desktop, largura 1440 px | 1440 × 2018 px | 1440 × 2594 px |
| Captura mobile, largura 390 px | Incompleta: o capturador não conseguiu percorrer toda a página sem viewport mobile | 390 × 3079 px, quatro telas, captura íntegra |
| Configuração de viewport | Ausente no HTML padrão servido pelo Swagger | `width=device-width, initial-scale=1` |
| Transbordamento horizontal | Não medido na versão anterior | Ausente nas jornadas E2E em 320, 390, 768 e 1440 px |
| Tipografia | Tema padrão do Swagger | Outfit e DM Mono locais, com fontes e licenças versionadas |

As dimensões são medidas das imagens, não notas de qualidade ou desempenho. A referência desktop foi capturada antes do tema sobre a branch de segurança existente. Não há pontuação de performance comparável. O erro da captura mobile anterior não é apresentado como imagem completa.

[Antes em desktop](evidence/before-1440.png) · [Depois em desktop](preview.png) · [Depois no celular](preview-mobile.png)

## Resultado da inspeção visual

`GATE: OPEN 30 (rounds used up)` após três rodadas. Sem waivers. O resultado não é PASS; a lista completa permanece em [open-checks.json](evidence/open-checks.json) e no [log do gate](evidence/visual-gate.log).

A inspeção permitiu corrigir contraste do selo OAS, foco das operações, visibilidade do botão de copiar caminho, carregamento das fontes, viewport mobile, alinhamento das descrições e alvos de toque das setas (32 × 26 px na segunda rodada; mínimo de 44 × 44 px na última).

Dos 30 achados restantes, 18 tratam de composição: herói, fotografias, CTAs promocionais, momentos de scroll, alturas de tela inteira, bordas de containers e o nome `.wrap`. A interface mantém a estrutura de consulta do Swagger. Sete achados interpretam links de navegação `#/...` como âncoras HTML inexistentes; a abertura de todas as operações e modelos passou no navegador. Quatro leem regras de foco do CSS original sem considerar a substituição do tema; o foco visível foi verificado por teclado. Um alerta de ordem dos títulos lê os elementos h3 originais; os grupos agora expõem `aria-level="2"`, preservando os elementos gerenciados pelo React. Essas interpretações não apagam os achados nem equivalem a uma auditoria completa de acessibilidade.

Nenhum contrato ou dado da API foi alterado pelo redesign. O diff recebeu revisão independente sem P1/P2 encontrados. A evidência funcional não substitui a inspeção da instalação real e de seu proxy TLS.

O ambiente local não utiliza uma base real. A documentação não ganha uma URL pública de produção: sua exposição continua restrita aos ambientes de desenvolvimento e teste.

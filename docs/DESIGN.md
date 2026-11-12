# Documentação da API

Refs #3. Esta rodada continua o PR #2 e altera apenas a apresentação da documentação Swagger existente. O contrato, os endpoints e a restrição que desativa a documentação em produção permanecem.

O tema usa carvão, verde claro nas ações e as cores dos métodos HTTP. Outfit e DM Mono são servidas pelo próprio aplicativo, com licenças em `src/docs/assets`; a CSP não precisa permitir novos domínios. Os controles têm altura mínima de 44 px. No celular, descrições e parâmetros se reorganizam em linhas, com margens de 20 px.

O viewport e o idioma são definidos pelo script local `docs-ui.js`. O CSS original de movimento da design-taste-frontend está copiado sem alterações. A documentação mantém altura natural para permitir consulta rápida; não foi convertida em uma landing page com blocos de tela inteira.

## Verificação da rodada

- Lint aprovado; permanece um aviso de configuração obsoleta do Biome.
- 21 testes de unidade/integração aprovados em MongoDB temporário. Cobertura de linhas: 95,23%.
- 7 testes E2E aprovados: abertura e fechamento de todas as operações e modelos, execução do health check, foco e ausência de transbordamento em 320, 390, 768 e 1440 px, além do CRUD e rejeição de operadores de banco. Nenhum dado real foi usado.
- Auditoria npm sem vulnerabilidades após atualizar Sentry dentro da versão principal 11 e fixar as dependências transitivas de test-exclude em glob 14.0.5 e minimatch 11.0.8. A cobertura foi executada novamente para verificar compatibilidade; o nível de auditoria do CI foi preservado.
- As capturas antes/depois e o relatório visual ficam em `.taste-skill` durante o trabalho; o resultado final será registrado aqui após a inspeção.

O ambiente local não utiliza uma base real. A documentação não ganha uma URL pública de produção: sua exposição continua restrita aos ambientes de desenvolvimento e teste.

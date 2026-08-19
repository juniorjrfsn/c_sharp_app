# Operação e segurança

## Configuração por ambiente

O projeto usa `Web.config`, `Web.Debug.config` e `Web.Release.config`, além de perfis de publicação em `Properties/PublishProfiles`. Configure URLs, conexões, credenciais de publicação e integrações por mecanismos seguros do ambiente de destino.

Nunca versione ou documente valores reais de senhas, tokens, chaves de máquina, connection strings completas, credenciais de Web Deploy, IPs/hosts internos ou dados pessoais.

Se um segredo for exposto no repositório ou em um artefato de publicação, trate-o como comprometido: revogue/rotacione o valor, remova-o do local exposto e revise os acessos associados. Remover apenas a linha atual não elimina versões anteriores do histórico.

## Publicação

1. Compile em `Release` e valide as funcionalidades alteradas.
2. Confirme as transformações de configuração do ambiente alvo.
3. Garanta que `App_Data/wkhtmltopdf` esteja presente e compatível com o servidor.
4. Publique usando o perfil autorizado para o ambiente.
5. Verifique login, permissões, uma consulta e um relatório após a publicação.

## Operação de sessão e PDF

- A sessão de controllers que derivam de `GSIController` expira após 90 minutos.
- A geração de PDF depende de `NReco.PdfGenerator` e `wkhtmltopdf`; verifique binário, permissões de execução e HTML produzido quando houver falha.
- Relatórios em memória devem ser validados para não revelar caminhos locais ou informação desnecessária.

## Manutenção

Mudanças de infraestrutura, integração, autenticação ou publicação devem atualizar este documento e o índice de `App_Docs`, sem incluir dados sensíveis.

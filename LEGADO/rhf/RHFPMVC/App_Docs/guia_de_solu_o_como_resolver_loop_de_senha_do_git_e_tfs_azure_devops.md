# Guia de Solução: Loop de Credenciais do Git e TFS / Azure DevOps Server

Este guia contém o passo a passo completo para resolver o problema de solicitações repetitivas de senha no **Git Credential Manager**, **Terminal** e **Visual Studio** ao conectar a servidores TFS/Azure DevOps On-Premises (ex: `https://tfs.sgi.ms.gov.br/`).

---

## 📋 Sumário
1. [Causa do Problema](#causa-do-problema)
2. [Solução 1: Criar e Usar um Personal Access Token (PAT)](#solução-1-criar-e-usar-um-personal-access-token-pat)
3. [Solução 2: Limpar Credenciais Antigas do Windows](#solução-2-limpar-credenciais-antigas-do-windows)
4. [Solução 3: Corrigir Configurações Globais do Git (Terminal)](#solução-3-corrigir-configurações-globais-do-git-terminal)
5. [Solução 4: Configurar o Visual Studio](#solução-4-configurar-o-visual-studio)
6. [Como Testar se Funcionou](#como-testar-se-funcionou)

---

## 🔍 Causa do Problema

Este problema costuma ocorrer por três motivos principais:
- **Conflito de credenciais:** O Windows salvou uma senha antiga no Gerenciador de Credenciais que é rejeitada a cada tentativa de `git pull` ou `git fetch`.
- **Múltiplos Credential Helpers:** O Git possui entradas duplicadas no arquivo `.gitconfig`.
- **Autenticação Avançada/MFA:** O servidor TFS exige um **Personal Access Token (PAT)** em vez da senha normal da rede.

---

## 🔑 Solução 1: Criar e Usar um Personal Access Token (PAT)
*(Solução mais recomendada quando a senha comum de rede continua falhando)*

1. Acesse o servidor pelo navegador: `https://tfs.sgi.ms.gov.br/`
2. Clique no ícone do seu perfil (canto superior direito) $\rightarrow$ **Personal access tokens** (Tokens de acesso pessoal).
3. Clique em **New Token** (Novo Token).
4. Defina:
   - **Name:** Ex: `Git-Desktop` ou `Visual-Studio`
   - **Scopes (Escopos):** Marque a permissão **Code (Read & Write)**.
5. Clique em **Create** e **copie o token gerado** (ele só será exibido uma vez).
6. Quando a janela pop-up do **Git Credential Manager** abrir:
   - **Username:** Seu nome de usuário (ex: `njunior`).
   - **Password:** Cole o **PAT (Token)** copiado em vez da sua senha tradicional.
   - Clique em **Continue**.

---

## 🧹 Solução 2: Limpar Credenciais Antigas do Windows

1. Pressione **`Windows + R`**, digite `control keymgr.dll` e aperte **Enter**.
2. Na janela que se abrir, selecione **Credenciais do Windows**.
3. Procure na lista por qualquer item relacionado a:
   - `git:https://tfs.sgi.ms.gov.br`
   - `ada:https://tfs.sgi.ms.gov.br`
4. Expanda a linha da credencial e clique em **Remover**.

---

## 🛠️️ Solução 3: Corrigir Configurações Globais do Git (Terminal)

Se o Git reclamar de múltiplos valores ao rodar comandos de credencial:

1. Abra o **PowerShell** ou **Git Bash**.
2. Remova todas as configurações conflitantes de credenciais:
   ```powershell
   git config --global --unset-all credential.helper
   ```
3. Defina o gerenciador padrão do Windows:
   ```powershell
   git config --global credential.helper manager
   ```
4. Se preferir atualizar o auxiliar do Git Credential Manager diretamente:
   ```powershell
   git credential-manager configure
   ```

---

## 💻 Solução 4: Configurar o Visual Studio

Se a janela continuar abrindo dentro do **Visual Studio**:

### A. Ajustar o Credential Helper Interno
1. No Visual Studio, acesse **Ferramentas (Tools)** $\rightarrow$ **Opções (Options)**.
2. Expanda **Controle de Origem (Source Control)** $\rightarrow$ **Configurações Globais do Git (Git Global Settings)**.
3. Localize **Auxiliar de Credenciais (Credential Helper)**.
4. Mude para **GCM for Windows** (ou **GCM Core** / **Unset**).
5. Clique em **OK**.

### B. Vincular a Conta do TFS ao VS
1. No canto superior direito do Visual Studio, clique no seu nome de usuário $\rightarrow$ **Configurações da Conta (Account Settings)**.
2. Em **Contas de Todos os Serviços**, clique em **Adicionar** $\rightarrow$ **Conta do Azure DevOps / TFS**.
3. Insira a URL `https://tfs.sgi.ms.gov.br/` e insira suas credenciais de rede.

---

## ✅ Como Testar se Funcionou

No terminal do PowerShell ou na janela de comandos do Git no Visual Studio, execute:

```powershell
git fetch
```

- **Sucesso:** O comando finaliza sem retornar erro e sem abrir nenhuma janela pedindo login/senha.
- **Se abrir a janela mais uma vez:** Insira o usuário e o **PAT (Token)** gerado na Solução 1. Após essa confirmação, o Windows salvará as credenciais permanentemente.
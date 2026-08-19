# Acesso pela rede interna para testes

Use estas orientações somente em redes internas autorizadas. Libere no firewall apenas a porta
necessária e restrinja o acesso aos dispositivos de teste.

## Opção 1 — Kestrel (.NET Core e .NET 5 ou superior)

Esta é a opção mais simples para projetos .NET modernos. Não se aplica diretamente a este
projeto RHFP, que usa ASP.NET MVC 5 sobre .NET Framework e normalmente executa com IIS Express.

1. No Gerenciador de Soluções do Visual Studio, abra `Properties/launchSettings.json`.
2. Localize o perfil da aplicação, normalmente identificado pelo nome do projeto.
3. Em `applicationUrl`, substitua `localhost` por `0.0.0.0`:

```json
"applicationUrl": "http://0.0.0.0:5000"
```

`0.0.0.0` faz o Kestrel aceitar conexões em todas as interfaces de rede do computador.

4. No Visual Studio, selecione o perfil com o nome do projeto, e não o perfil IIS Express.
5. Inicie a depuração.
6. No dispositivo de teste, acesse `http://SEU_IP:5000`.

## Opção 2 — IIS Express

O IIS Express bloqueia conexões externas por padrão. Esta opção requer alteração local de
configuração e execução do Visual Studio como administrador.

1. Execute o projeto uma vez com IIS Express e pare a depuração.
2. Na raiz da solução, abra `.vs/config/applicationhost.config`. A pasta `.vs` é oculta.
3. Procure o nome do projeto até encontrar a seção `<sites>`.
4. Localize os bindings do site e adicione um binding para o IP local usado no teste:

```xml
<bindings>
  <binding protocol="http" bindingInformation="*:50785:localhost" />
  <!-- Troque o IP e a porta pelos valores do seu ambiente. -->
  <binding protocol="http" bindingInformation="*:50785:192.168.1.10" />
</bindings>
```

5. Feche o Visual Studio.
6. Abra o Visual Studio usando **Executar como administrador**.
7. Execute o projeto e acesse-o a partir de outro dispositivo pelo IP e porta configurados.

## Verificações

- Confirme que o computador e o dispositivo de teste estão na mesma rede autorizada.
- Verifique se a porta escolhida está liberada no firewall local.
- Use o IP local atual da máquina; ele pode mudar entre redes.
- Após os testes, remova bindings e regras de firewall que não forem mais necessários.

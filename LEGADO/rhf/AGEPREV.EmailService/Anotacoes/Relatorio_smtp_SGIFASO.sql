-- ========================================
-- TABELA DE LOG DE E-MAILS ENVIADOS
-- ========================================
CREATE TABLE [dbo].[aso_log_emails] (
    [loe_ano]                      CHAR(4)       NOT NULL,
    [loe_sequencial]               SMALLINT      NOT NULL,
    [loe_e_cedencia]               CHAR(1)       NOT NULL,

    [asm_ano]                      CHAR(4)       NULL,
    [asm_numero]                   INT           NULL,
    [aim_sequencial]               SMALLINT      NULL,
    [ugx_codigo]                   INT           NULL,
    [aix_sequencial]               SMALLINT      NULL,

    [loe_email]                    CHAR(60)      NOT NULL,
    [loe_codigo_smtp]              CHAR(3)       NULL,        -- Código primário (Ex: "250")
    [loe_codigo_estendido]         CHAR(7)       NULL,        -- Código estendido (Ex: "2.0.0")
    [loe_desc_email]               NVARCHAR(MAX) NULL,        -- Texto ou corpo da resposta SMTP (NVARCHAR(MAX) para suportar textos grandes e unicode)
    [loe_id_email]                 VARCHAR(60)   NOT NULL,    -- Message-ID

    [loe_cd_usuario_envio_gsi]     INT           NULL,        -- Quem enviou
    [loe_dt_envio]                 DATETIME      NULL,        -- Data de envio
    [loe_cd_usuario_relatorio_gsi] INT           NULL,        -- Quem gerou relatório
    [loe_dt_retorno]               DATETIME      NULL,        -- Data da leitura SMTP

    [loe_situacao]                 CHAR(1)       NOT NULL,    -- 'E', 'R', etc.

    CONSTRAINT [PK_aso_log_emails] PRIMARY KEY CLUSTERED (
        [loe_ano] ASC, [loe_sequencial] ASC
    )
    WITH (
        PAD_INDEX = OFF,
        STATISTICS_NORECOMPUTE = OFF,
        IGNORE_DUP_KEY = OFF,
        ALLOW_ROW_LOCKS = ON,
        ALLOW_PAGE_LOCKS = ON,
        OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
) ON [PRIMARY];

-- ========================================
-- TABELA DE STATUS SMTP
-- ========================================
CREATE TABLE [dbo].[aso_smtp_status] (
    [sts_codigo_smtp]         CHAR(3)      NOT NULL,      -- Código SMTP primário
    [sts_codigo_estendido]    CHAR(7)  NOT NULL,      -- Código estendido SMTP
    [sts_descricao]           VARCHAR(200) NOT NULL,      -- Descrição legível
    [sts_sucesso]             CHAR(1)      NOT NULL,      -- 'S' ou 'N'

    -- Chave primária composta para identificar com precisão o código completo
    CONSTRAINT [PK_aso_smtp_status] PRIMARY KEY CLUSTERED (
        [sts_codigo_smtp],
        [sts_codigo_estendido]
    )
    WITH (
        PAD_INDEX = OFF,
        STATISTICS_NORECOMPUTE = OFF,
        IGNORE_DUP_KEY = OFF,
        ALLOW_ROW_LOCKS = ON,
        ALLOW_PAGE_LOCKS = ON,
        OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
) ON [PRIMARY];

-- ========================================
-- RELACIONAMENTO OPCIONAL (DESCOMENTAR SE DESEJAR USAR FK COMPOSTA)
-- ========================================
-- Obs.: para usar este relacionamento, os campos loe_codigo_smtp e loe_codigo_estendido
-- devem estar preenchidos no log, e a tabela de status precisa conter os respectivos códigos.

-- ALTER TABLE [dbo].[aso_log_emails]
-- ADD CONSTRAINT [FK_log_status_composta]
-- FOREIGN KEY ([loe_codigo_smtp], [loe_codigo_estendido])
-- REFERENCES [dbo].[aso_smtp_status]([sts_codigo_smtp], [sts_codigo_estendido]);


-- Observações de modelagem:
-- - A tabela aso_log_emails possui chave primária composta: (loe_ano, loe_sequencial).
-- - A tabela aso_smtp_status utiliza chave primária composta: (sts_codigo_smtp, sts_codigo_estendido),
--   garantindo unicidade entre códigos SMTP primários e estendidos.
-- - O relacionamento via FOREIGN KEY entre essas tabelas é opcional e foi propositalmente omitido
--   para permitir registros de logs com códigos desconhecidos ou não mapeados previamente.

-- Finalidade do campo loe_situacao:
-- Identifica o estágio do e-mail registrado no log:
--   'E' = Enviado → e-mail foi disparado, mas ainda não houve leitura de retorno
--   'R' = Retornado → resposta SMTP foi lida e processada durante a geração do relatório
-- Esse status só muda para 'R' quando o usuário executa a rotina de leitura da caixa postal.
-- Facilita filtros em consultas e geração de relatórios por status de processamento.


-- UPDATE aso_log_emails
-- SET loe_situacao = 
--     CASE 
--         WHEN loe_dt_envio IS NOT NULL AND loe_dt_retorno IS NULL THEN 'E'  -- Enviado, aguardando retorno
--         WHEN loe_dt_envio IS NOT NULL AND loe_dt_retorno IS NOT NULL THEN 'R'  -- Log retornado
--         WHEN loe_dt_envio IS NULL THEN 'P'  -- Pendente
--     END
-- WHERE /* condição específica, ex: e-mails lidos ou atualizados */;

--public enum SituacaoEmail
--{
--    E = 0, // Enviado: e-mail disparado, aguardando retorno SMTP
--    R = 1  // Retornado: resposta SMTP processada via leitura da caixa postal
--}


INSERT INTO [dbo].[aso_smtp_status] (
    [sts_codigo_smtp],
    [sts_codigo_estendido],
    [sts_descricao],
    [sts_sucesso]
)
VALUES
-- ✅ Sucesso
('250', '2.1.5', 'Mensagem enviada e entregue com sucesso.', 'C'),
('250', '2.0.0', 'Mensagem aceita pelo servidor e está a caminho do destinatário.', 'C'),
('250', '2.6.0', 'O servidor aceitou com sucesso a mensagem e ela foi colocada na fila para entrega ao destinatário.', 'C'),
('250', '',       'Tudo certo! O servidor confirmou o recebimento do comando.', 'C'),
('354', '',       'Preparando envio: o servidor está pronto para receber o conteúdo da mensagem.', 'C'),

-- ⚠️ Erros comuns
('421', '4.3.2', 'O servidor está ocupado ou fora do ar. Tente novamente mais tarde.', 'E'),
('421', '',       'Serviço temporariamente indisponível. Aguarde e tente novamente.', 'E'),
('450', '4.2.0', 'A caixa de entrada do destinatário está cheia ou inacessível no momento.', 'E'),
('450', '',       'Não foi possível entregar agora. Tente mais tarde.', 'E'),
('451', '4.3.0', 'Problema interno no servidor ao tentar enviar o e-mail.', 'E'),
('451', '',       'Erro temporário no servidor. Tente novamente em instantes.', 'E'),
('452', '4.2.2', 'O destinatário não tem espaço suficiente na caixa de entrada.', 'E'),
('452', '',       'O servidor não conseguiu armazenar a mensagem por falta de espaço.', 'E'),
('500', '5.5.2', 'Erro de comunicação. O servidor não entendeu o comando enviado.', 'E'),
('500', '',       'Comando inválido ou mal formatado.', 'E'),
('501', '5.1.3', 'Endereço de e-mail digitado incorretamente.', 'E'),
('502', '5.5.1', 'O servidor não reconhece esse tipo de comando.', 'E'),
('503', '5.5.0', 'Sequência de comandos incorreta. Pode faltar autenticação.', 'E'),
('504', '5.5.4', 'O servidor não aceita esse parâmetro ou comando.', 'E'),
('550', '5.1.1', 'O e-mail do destinatário não existe ou está incorreto.', 'E'),
('550', '5.5.0', 'A caixa de entrada do destinatário está indisponível.', 'E'),
('550', '',       'Entrega bloqueada. O servidor recusou a mensagem.', 'E'),
('551', '5.1.6', 'O servidor não aceita encaminhar para esse destinatário.', 'E'),
('552', '5.2.2', 'A caixa de entrada do destinatário está cheia.', 'E'),
('553', '5.1.2', 'Endereço de e-mail inválido ou não permitido.', 'E'),
('554', '5.7.1', 'Mensagem rejeitada. Pode ter sido considerada spam ou violar regras do servidor.', 'E'),

-- 🌐 Erros relacionados a DNS
('554', '5.4.4', 'Não foi possível localizar o domínio do destinatário. Verifique se o endereço está correto.', 'E'),
('454', '4.4.4', 'O domínio não possui servidor de e-mail configurado (registro MX ausente).', 'E'),
('554', '5.1.2', 'O domínio informado é inválido ou não existe.', 'E'),
('451', '4.4.1', 'O servidor DNS demorou demais para responder. Tente novamente mais tarde.', 'E'),
('550', '5.7.1', 'Falha na verificação de segurança do domínio (DNSSEC).', 'E'),
('554', '5.4.6', 'O servidor de e-mail do domínio está mal configurado ou é inválido.', 'E'),
('554', '5.4.7', 'Não há endereço IP configurado para o domínio do destinatário.', 'E'),
('550', '5.7.25','O IP do servidor não corresponde ao domínio esperado (falha na verificação reversa).', 'E');





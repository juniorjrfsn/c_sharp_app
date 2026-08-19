;WITH TodasQuestoes AS (
    SELECT DISTINCT qst_num_questao
    FROM eve_questoes_respostas
),
Corretas AS (
    SELECT 
        qst_num_questao,
        COUNT(*) AS qtd_corretas
    FROM eve_questoes_respostas
    WHERE qsr_e_correta = 'S'
    GROUP BY qst_num_questao
),
Marcadas AS (
    SELECT 
        eve.eve_num_evento,
        eve.eve_nome,
        eve.eve_situacao,
        eur.usr_num_usuario,
        eur.qst_num_questao,
        eur.que_num_questionario,
        eq.que_contexto,
        eq.que_situacao,
        COUNT(*) AS qtd_marcadas,
        SUM(CASE WHEN eqr.qsr_e_correta = 'S' THEN 1 ELSE 0 END) AS qtd_marcadas_corretas
    FROM eve_usuarios_respostas eur
    INNER JOIN eve_questoes_respostas eqr ON (eur.qst_num_questao = eqr.qst_num_questao AND eur.qsr_num_resposta = eqr.qsr_num_resposta)
    INNER JOIN eve_eventos eve ON (eur.eve_num_evento = eve.eve_num_evento)
    INNER JOIN eve_questionarios_questoes_respostas eqqr ON (
        eve.eve_num_evento = eqqr.eve_num_evento 
        AND eur.qst_num_questao = eqqr.qst_num_questao
    )
    INNER JOIN eve_questionarios eq ON (
        eur.eve_num_evento = eq.eve_num_evento AND eqqr.que_num_questionario = eq.que_num_questionario
    )
    GROUP BY eve.eve_num_evento, eve.eve_nome, eve.eve_situacao,
             eur.usr_num_usuario, eur.qst_num_questao, eur.que_num_questionario,
             eq.que_contexto, eq.que_situacao
),
Base AS (
    SELECT 
        u.usr_cpf,
        u.usr_num_usuario,
        u.usr_nome,
        u.usr_situacao,
        q.qst_num_questao
    FROM eve_usuarios u
    CROSS JOIN TodasQuestoes q
),
PontosPorQuestao AS (
    SELECT 
        m.eve_num_evento,
        m.eve_nome,
        m.eve_situacao,
        m.que_num_questionario,
        m.que_contexto,
        m.que_situacao,
        b.usr_cpf,
        b.usr_num_usuario,
        b.usr_nome,
        b.usr_situacao,
        b.qst_num_questao,
        CASE 
            WHEN m.qst_num_questao IS NULL THEN 0
            WHEN m.qtd_marcadas = c.qtd_corretas 
             AND m.qtd_marcadas_corretas = c.qtd_corretas 
            THEN 1 
            ELSE 0 
        END AS ponto
    FROM Base b
    INNER JOIN Corretas c ON b.qst_num_questao = c.qst_num_questao
    LEFT JOIN Marcadas m ON b.usr_num_usuario = m.usr_num_usuario 
                        AND b.qst_num_questao = m.qst_num_questao
),
PontosPorUsuario AS ( 
    SELECT 
        ppq.eve_num_evento,
        ppq.eve_nome,
        ppq.eve_situacao,
        ppq.que_num_questionario,
        ppq.que_contexto,
        ppq.que_situacao,
        ppq.usr_num_usuario,
        ppq.usr_cpf, 
        ppq.usr_nome,
        ppq.usr_situacao,
        COUNT(*) AS total_questoes_prova,
        SUM(ppq.ponto) AS pontuacao,
        ROUND(100.0 * SUM(ppq.ponto) / NULLIF(COUNT(*), 0), 2) AS percentual
    FROM PontosPorQuestao ppq
    GROUP BY ppq.usr_cpf, ppq.usr_num_usuario, ppq.usr_nome, ppq.usr_situacao,
             ppq.eve_num_evento, ppq.eve_nome, ppq.eve_situacao,
             ppq.que_num_questionario, ppq.que_contexto, ppq.que_situacao
)
SELECT 
    ppu.eve_num_evento,
    ppu.eve_nome,
    ppu.eve_situacao,
    ppu.que_num_questionario,
    ppu.que_contexto,
    ppu.que_situacao,
    MAX(ppu.usr_num_usuario) AS usr_num_usuario,
    ppu.usr_cpf, 
    ppu.usr_nome,
    ppu.usr_situacao,
    ppu.total_questoes_prova,
    ppu.pontuacao,
    ppu.percentual
FROM PontosPorUsuario ppu
GROUP BY ppu.eve_num_evento, ppu.eve_nome, ppu.eve_situacao,
         ppu.que_num_questionario, ppu.que_contexto, ppu.que_situacao, 
         ppu.usr_cpf, ppu.usr_nome, ppu.usr_situacao,
         ppu.total_questoes_prova, ppu.pontuacao, ppu.percentual
ORDER BY ppu.usr_nome ASC; 
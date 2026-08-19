WITH RespostasCorretas AS (
    SELECT 
        qst_num_questao,
        COUNT(*) AS total_corretas
    FROM dbo.eve_questoes_respostas
    WHERE qsr_e_correta = 'S'
    GROUP BY qst_num_questao
),
RespostasUsuario AS (
    SELECT 
        u.usr_num_usuario,
        u.eve_num_evento,
        u.que_num_questionario,
        u.qst_num_questao,
        COUNT(CASE WHEN r.qsr_e_correta = 'S' THEN 1 END) AS marcou_corretas,
        COUNT(CASE WHEN r.qsr_e_correta = 'N' THEN 1 END) AS marcou_erradas
    FROM dbo.eve_usuarios_respostas u
    INNER JOIN dbo.eve_questoes_respostas r
        ON u.qst_num_questao = r.qst_num_questao
       AND u.qsr_num_resposta = r.qsr_num_resposta
    WHERE u.ure_situacao = 'A'
    GROUP BY u.usr_num_usuario, u.eve_num_evento, u.que_num_questionario, u.qst_num_questao
),
Acertos AS (
    SELECT 
        ru.usr_num_usuario,
        ru.eve_num_evento,
        ru.que_num_questionario,
        ru.qst_num_questao,
        CASE 
            WHEN ru.marcou_erradas = 0 
             AND ru.marcou_corretas = rc.total_corretas 
            THEN 1 ELSE 0 
        END AS acertou
    FROM RespostasUsuario ru
    INNER JOIN RespostasCorretas rc
        ON ru.qst_num_questao = rc.qst_num_questao
),
NotasUsuario AS (
    SELECT 
        usr_num_usuario,
        eve_num_evento,
        que_num_questionario,
        SUM(acertou) AS total_acertos,
        COUNT(DISTINCT qst_num_questao) AS total_questoes,
        CAST(SUM(acertou) AS FLOAT) / COUNT(DISTINCT qst_num_questao) * 10 AS nota
    FROM Acertos
    GROUP BY usr_num_usuario, eve_num_evento, que_num_questionario
)
SELECT 
    usr_num_usuario,
    eve_num_evento,
    que_num_questionario,
    total_acertos,
    total_questoes,
    nota,
    CASE WHEN nota >= 7 THEN 'APROVADO' ELSE 'REPROVADO' END AS resultado
FROM NotasUsuario;
SELECT 
    eve.eve_num_evento,
    eve.eve_nome,
    eve.eve_descricao,
    eve.eve_local,
    eve.eve_municipio,
    eve.eve_dt_inicio,
    eve.eve_dt_fim,
    eve.eve_dt_inclusao,
    eve.eve_situacao,
    
    eq.que_num_questionario,
    eq.que_contexto,
    eq.que_publico_alvo,
    eq.que_nota_minima,
    eq.que_dt_inclusao,
    eq.que_situacao
FROM 
    [pms_eventos_desenvolvimento].[dbo].eve_eventos AS eve
INNER JOIN 
    [pms_eventos_desenvolvimento].[dbo].eve_questionarios AS eq ON eve.eve_num_evento = eq.eve_num_evento
WHERE 
    eve.eve_situacao = 'A' 
    AND eq.A = 'que_situacao';
 

SELECT 
    name AS NomeDaTabela, 
    create_date AS DataDeCriacao
FROM 
    sys.tables
ORDER BY 
    name;
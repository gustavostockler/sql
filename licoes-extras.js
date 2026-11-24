// Lições extras (exercícios novos nos módulos 1–10 e módulos 11–15), por cenário.
// Carregado antes do script.js. O script.js junta estas lições às originais.
const extraLessons = {};

extraLessons.veiculos = {
    setup: `
            INSERT INTO clientes VALUES (4, 'Ana Lima', NULL, 'SP'), (5, 'Carlos Mendes', '55667788', 'RJ'), (6, 'Beatriz Rocha', NULL, 'MG');
            INSERT INTO locacoes VALUES (5, 2, 3, 4, 880), (6, 3, 5, 2, 500), (7, 1, 7, 3, 570), (8, 5, 6, 5, 650);
    `,
    lessons: [
        // ---------- Módulo 1 ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Preço da Semana",
            concept: "Coluna calculada",
            icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Além de ler colunas, o <code>SELECT</code> pode fazer contas: <code>valor_diaria * 7</code> gera uma coluna nova calculada na hora, sem alterar a tabela. Com <code>AS</code> damos um nome claro ao resultado. É assim que montamos simulações rápidas de preço, desconto ou comissão.",
            task: "Mostre o <code>modelo</code> e o valor de uma locação de 7 dias (<code>valor_diaria * 7</code>) com o apelido <code>valor_semana</code>, para todos os <code>veiculos</code>.",
            startCode: "SELECT \n    modelo,\n    ... AS valor_semana\nFROM veiculos;",
            solution: "SELECT \n    modelo,\n    valor_diaria * 7 AS valor_semana\nFROM veiculos;",
            validator: (res) => sameResult(res, "SELECT modelo, valor_diaria * 7 FROM veiculos", { columns: ['modelo', 'valor_semana'] })
        },
        // ---------- Módulo 2 ----------
        {
            id: 101, moduleId: 2, after: 4,
            title: "Modelos que começam com C",
            concept: "LIKE",
            icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "O <code>LIKE</code> busca padrões de texto. O <code>%</code> representa qualquer sequência de caracteres e o <code>_</code> exatamente um caractere: <code>'C%'</code> encontra tudo que começa com C. No SQLite o <code>LIKE</code> ignora maiúsculas/minúsculas em letras sem acento; no SQL Server isso depende da collation do banco.",
            task: "Liste o <code>modelo</code> e a <code>marca</code> dos <code>veiculos</code> cujo modelo começa com a letra 'C'.",
            startCode: "SELECT \n    modelo,\n    marca\nFROM veiculos\nWHERE modelo LIKE ;",
            solution: "SELECT \n    modelo,\n    marca\nFROM veiculos\nWHERE modelo LIKE 'C%';",
            validator: (res) => sameResult(res, "SELECT modelo, marca FROM veiculos WHERE modelo LIKE 'C%'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Fiat e Jeep na Faixa Média",
            concept: "IN / BETWEEN",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>IN (...)</code> substitui uma sequência de <code>OR</code>: <code>marca IN ('Fiat', 'Jeep')</code>. Já <code>BETWEEN a AND b</code> filtra uma faixa de valores, incluindo os dois limites. Juntos deixam filtros de catálogo bem mais legíveis.",
            task: "Selecione todas as colunas (<code>*</code>) dos <code>veiculos</code> das marcas 'Fiat' ou 'Jeep' (use <code>IN</code>) cujo <code>valor_diaria</code> esteja entre 100 e 200 (use <code>BETWEEN</code>).",
            startCode: "SELECT \n    *\nFROM veiculos\nWHERE marca IN ()\n  AND valor_diaria BETWEEN ;",
            solution: "SELECT \n    *\nFROM veiculos\nWHERE marca IN ('Fiat', 'Jeep')\n    AND valor_diaria BETWEEN 100 AND 200;",
            validator: (res) => sameResult(res, "SELECT * FROM veiculos WHERE marca IN ('Fiat','Jeep') AND valor_diaria BETWEEN 100 AND 200")
        },
        // ---------- Módulo 3 ----------
        {
            id: 103, moduleId: 3, after: 9,
            title: "Resumo das Diárias",
            concept: "AVG / MIN / MAX",
            icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "<code>AVG()</code> calcula a média, <code>MIN()</code> o menor valor e <code>MAX()</code> o maior. Usados juntos, dão um retrato instantâneo da tabela de preços da frota. Como o <code>COUNT</code> e o <code>SUM</code>, eles resumem várias linhas em uma só.",
            task: "Em uma única linha, mostre a média do <code>valor_diaria</code> como <code>media_diaria</code>, o menor como <code>menor_diaria</code> e o maior como <code>maior_diaria</code>, considerando todos os <code>veiculos</code>.",
            startCode: "SELECT \n    AVG() AS media_diaria,\n    MIN() AS menor_diaria,\n    MAX() AS maior_diaria\nFROM veiculos;",
            solution: "SELECT \n    AVG(valor_diaria) AS media_diaria,\n    MIN(valor_diaria) AS menor_diaria,\n    MAX(valor_diaria) AS maior_diaria\nFROM veiculos;",
            validator: (res) => sameResult(res, "SELECT AVG(valor_diaria), MIN(valor_diaria), MAX(valor_diaria) FROM veiculos", { columns: ['media_diaria', 'menor_diaria', 'maior_diaria'] })
        },
        // ---------- Módulo 4 ----------
        {
            id: 104, moduleId: 4, after: 11,
            title: "Faturamento por Categoria",
            concept: "JOIN + GROUP BY",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "Muitas perguntas de negócio exigem juntar tabelas e depois agrupar. Primeiro o <code>JOIN</code> traz a categoria do veículo para cada locação; depois o <code>GROUP BY</code> soma o faturamento por categoria. A ordem lógica é: FROM/JOIN → WHERE → GROUP BY → SELECT → ORDER BY.",
            task: "Mostre a <code>categoria</code> do veículo e a soma de <code>valor_total</code> das locações como <code>faturamento</code>, ligando <code>locacoes.veiculo_id</code> a <code>veiculos.id</code>. Ordene do maior para o menor faturamento.",
            startCode: "SELECT \n    v.categoria,\n    SUM() AS faturamento\nFROM locacoes l\nJOIN veiculos v ON \nGROUP BY \nORDER BY ;",
            solution: "SELECT \n    v.categoria,\n    SUM(l.valor_total) AS faturamento\nFROM locacoes l\nJOIN veiculos v ON l.veiculo_id = v.id\nGROUP BY v.categoria\nORDER BY faturamento DESC;",
            validator: (res) => sameResult(res, "SELECT v.categoria, SUM(l.valor_total) FROM locacoes l JOIN veiculos v ON l.veiculo_id = v.id GROUP BY v.categoria ORDER BY 2 DESC", { ordered: true, columns: ['categoria', 'faturamento'] })
        },
        // ---------- Módulo 5 ----------
        {
            id: 105, moduleId: 5, after: 13,
            title: "Reajuste dos SUVs",
            concept: "UPDATE com cálculo",
            icon: '<i class="ph-fill ph-percent"></i>',
            theory: "O <code>UPDATE</code> pode usar o próprio valor da coluna no cálculo: <code>SET valor_diaria = valor_diaria * 1.1</code> aplica 10% de aumento em todas as linhas filtradas pelo <code>WHERE</code>. <code>ROUND()</code> evita casas decimais quebradas. Sempre confira o <code>WHERE</code> antes: sem ele, o reajuste vale para a frota inteira!",
            task: "Aplique um reajuste de 10% no <code>valor_diaria</code> de todos os veículos da <code>categoria</code> 'SUV', arredondando com <code>ROUND(valor_diaria * 1.1)</code>. Depois liste os SUVs para conferir.",
            startCode: "UPDATE veiculos\nSET valor_diaria = \nWHERE categoria = ;\n\nSELECT * FROM veiculos WHERE categoria = 'SUV';",
            solution: "UPDATE veiculos\nSET valor_diaria = ROUND(valor_diaria * 1.1)\nWHERE categoria = 'SUV';\n\nSELECT * FROM veiculos WHERE categoria = 'SUV';",
            validator: (res) => {
                try {
                    const r = db.exec("SELECT modelo, valor_diaria FROM veiculos WHERE modelo IN ('Compass','Renegade','Kicks','Civic','Cronos','Argo')");
                    if (!r.length) return false;
                    const v = {}; r[0].values.forEach(x => { v[x[0]] = x[1]; });
                    const suvOk = v.Compass >= 241.99 && v.Renegade >= 197.99 && v.Kicks >= 208.99;
                    const othersOk = v.Civic === 250 && v.Cronos === 130 && v.Argo === 85;
                    return suvOk && othersOk && res && res.length > 0;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 6 ----------
        {
            id: 106, moduleId: 6, after: 15,
            title: "Gasto por Cliente com CTE",
            concept: "CTE (WITH)",
            icon: '<i class="ph-fill ph-stack"></i>',
            theory: "Uma CTE (<code>WITH nome AS (...)</code>) é uma consulta nomeada que existe só durante a query. Ela deixa consultas longas legíveis, como se fossem etapas: primeiro calculamos o total por cliente, depois juntamos com os nomes. A sintaxe é a mesma no SQL Server.",
            task: "Crie uma CTE chamada <code>gastos</code> com <code>cliente_id</code> e a soma de <code>valor_total</code> como <code>total_gasto</code> (a partir de <code>locacoes</code>). Depois junte com <code>clientes</code> e mostre <code>nome</code> e <code>total_gasto</code>, do maior para o menor.",
            startCode: "WITH gastos AS (\n    SELECT \n        cliente_id,\n        ... AS total_gasto\n    FROM locacoes\n    GROUP BY \n)\nSELECT \n    c.nome,\n    g.total_gasto\nFROM gastos g\nJOIN clientes c ON \nORDER BY ;",
            solution: "WITH gastos AS (\n    SELECT \n        cliente_id,\n        SUM(valor_total) AS total_gasto\n    FROM locacoes\n    GROUP BY cliente_id\n)\nSELECT \n    c.nome,\n    g.total_gasto\nFROM gastos g\nJOIN clientes c ON g.cliente_id = c.id\nORDER BY g.total_gasto DESC;",
            validator: (res) => sameResult(res, "SELECT c.nome, SUM(l.valor_total) FROM locacoes l JOIN clientes c ON l.cliente_id = c.id GROUP BY c.id, c.nome ORDER BY 2 DESC", { ordered: true, columns: ['nome', 'total_gasto'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Carros que Já Rodaram",
            concept: "EXISTS",
            icon: '<i class="ph-fill ph-magnifying-glass-plus"></i>',
            theory: "<code>EXISTS (subquery)</code> retorna verdadeiro se a subquery encontrar pelo menos uma linha. É uma subquery correlacionada: ela usa a linha da consulta externa (<code>l.veiculo_id = v.id</code>). Ideal para perguntas do tipo 'existe algum registro ligado a este item?'. <code>NOT EXISTS</code> faz o contrário.",
            task: "Liste o <code>modelo</code> e a <code>marca</code> dos <code>veiculos</code> que possuem pelo menos uma locação, usando <code>EXISTS</code> com uma subquery em <code>locacoes</code>.",
            startCode: "SELECT \n    v.modelo,\n    v.marca\nFROM veiculos v\nWHERE EXISTS (\n    SELECT 1\n    FROM locacoes l\n    WHERE \n);",
            solution: "SELECT \n    v.modelo,\n    v.marca\nFROM veiculos v\nWHERE EXISTS (\n    SELECT 1\n    FROM locacoes l\n    WHERE l.veiculo_id = v.id\n);",
            validator: (res) => sameResult(res, "SELECT modelo, marca FROM veiculos WHERE id IN (SELECT veiculo_id FROM locacoes)")
        },
        // ---------- Módulo 7 ----------
        {
            id: 108, moduleId: 7, after: 16,
            title: "Ranking dentro da Categoria",
            concept: "ROW_NUMBER + PARTITION",
            icon: '<i class="ph-fill ph-list-numbers"></i>',
            theory: "<code>ROW_NUMBER()</code> numera as linhas 1, 2, 3... segundo o <code>ORDER BY</code> da janela. Com <code>PARTITION BY categoria</code> a contagem recomeça em cada categoria, como se fossem vários rankings separados. É a base para pegar 'o mais caro de cada grupo'.",
            task: "Mostre <code>categoria</code>, <code>modelo</code>, <code>valor_diaria</code> e uma coluna <code>posicao</code> com <code>ROW_NUMBER()</code> numerando os veículos de cada categoria do mais caro para o mais barato.",
            startCode: "SELECT \n    categoria,\n    modelo,\n    valor_diaria,\n    ROW_NUMBER() OVER (\n        PARTITION BY \n        ORDER BY \n    ) AS posicao\nFROM veiculos;",
            solution: "SELECT \n    categoria,\n    modelo,\n    valor_diaria,\n    ROW_NUMBER() OVER (\n        PARTITION BY categoria\n        ORDER BY valor_diaria DESC\n    ) AS posicao\nFROM veiculos;",
            validator: (res) => sameResult(res, "SELECT categoria, modelo, valor_diaria, ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY valor_diaria DESC) FROM veiculos", { columns: ['posicao'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Faturamento Acumulado",
            concept: "SUM() OVER",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "Com <code>SUM(coluna) OVER (ORDER BY ...)</code> a soma vai acumulando linha a linha, sem agrupar: cada linha mostra o total até ela. É o famoso 'total acumulado', usado para acompanhar metas ao longo do tempo. Funciona igual no SQL Server.",
            task: "Mostre o <code>id</code> e o <code>valor_total</code> de cada locação e uma coluna <code>acumulado</code> com a soma acumulada de <code>valor_total</code> na ordem do <code>id</code>. Ordene o resultado por <code>id</code>.",
            startCode: "SELECT \n    id,\n    valor_total,\n    SUM() OVER (ORDER BY ) AS acumulado\nFROM locacoes\nORDER BY ;",
            solution: "SELECT \n    id,\n    valor_total,\n    SUM(valor_total) OVER (ORDER BY id) AS acumulado\nFROM locacoes\nORDER BY id;",
            validator: (res) => sameResult(res, "SELECT id, valor_total, SUM(valor_total) OVER (ORDER BY id) FROM locacoes ORDER BY id", { ordered: true, columns: ['acumulado'] })
        },
        // ---------- Módulo 8 ----------
        {
            id: 110, moduleId: 8, after: 17,
            title: "Disponíveis x Alugados",
            concept: "SUM(CASE WHEN)",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "Colocar um <code>CASE</code> dentro do <code>SUM</code> cria contagens condicionais: <code>SUM(CASE WHEN status = 'Alugado' THEN 1 ELSE 0 END)</code> conta só os alugados. Assim, em uma linha por grupo, temos várias colunas de indicadores lado a lado — uma 'tabela dinâmica' feita em SQL.",
            task: "Para cada <code>categoria</code>, mostre quantos veículos estão 'Disponível' (coluna <code>disponiveis</code>) e quantos estão 'Alugado' (coluna <code>alugados</code>), usando <code>SUM(CASE WHEN ...)</code>.",
            startCode: "SELECT \n    categoria,\n    SUM(CASE WHEN ... THEN 1 ELSE 0 END) AS disponiveis,\n    SUM(CASE WHEN ... THEN 1 ELSE 0 END) AS alugados\nFROM veiculos\nGROUP BY categoria;",
            solution: "SELECT \n    categoria,\n    SUM(CASE WHEN status = 'Disponível' THEN 1 ELSE 0 END) AS disponiveis,\n    SUM(CASE WHEN status = 'Alugado' THEN 1 ELSE 0 END) AS alugados\nFROM veiculos\nGROUP BY categoria;",
            validator: (res) => sameResult(res, "SELECT categoria, SUM(CASE WHEN status = 'Disponível' THEN 1 ELSE 0 END), SUM(CASE WHEN status = 'Alugado' THEN 1 ELSE 0 END) FROM veiculos GROUP BY categoria", { columns: ['categoria', 'disponiveis', 'alugados'] })
        },
        // ---------- Módulo 10 ----------
        {
            id: 111, moduleId: 10, after: 22,
            title: "Plano da Busca por Modelo",
            concept: "EXPLAIN QUERY PLAN",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o banco vai executá-lo: se faz <i>SCAN</i> (lê a tabela inteira) ou <i>SEARCH</i> usando um índice. A coluna <code>detail</code> descreve cada passo. No SQL Server o equivalente é o 'Plano de Execução' (Ctrl+L / Ctrl+M) ou <code>SET SHOWPLAN_TEXT ON</code>.",
            task: "Veja o plano de execução da consulta <code>SELECT * FROM veiculos WHERE modelo = 'Civic'</code> usando <code>EXPLAIN QUERY PLAN</code> (repare se o índice <code>idx_modelo</code> é usado).",
            startCode: "-- escreva o comando que mostra o plano antes do SELECT\n\nSELECT *\nFROM veiculos\nWHERE modelo = 'Civic';",
            solution: "EXPLAIN QUERY PLAN\nSELECT *\nFROM veiculos\nWHERE modelo = 'Civic';",
            validator: (res) => !!(res && res.length && res[res.length - 1].columns.includes('detail') && res[res.length - 1].values.length > 0)
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Índice Temporário de Status",
            concept: "DROP INDEX",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices custam espaço e deixam INSERT/UPDATE mais lentos, então removemos os que não ajudam com <code>DROP INDEX</code>. Com <code>IF EXISTS</code> o comando não dá erro se o índice já tiver sido apagado. No SQL Server a sintaxe exige a tabela: <code>DROP INDEX IF EXISTS idx ON tabela</code>.",
            task: "Crie o índice <code>idx_veiculos_status</code> na coluna <code>status</code> de <code>veiculos</code> (com <code>IF NOT EXISTS</code>), depois remova-o com <code>DROP INDEX IF EXISTS</code>. Por fim, liste os índices restantes com <code>SELECT name FROM sqlite_master WHERE type = 'index';</code>.",
            startCode: "CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(...);\nDROP INDEX ...;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            solution: "CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(status);\nDROP INDEX IF EXISTS idx_veiculos_status;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            validator: (res) => {
                try {
                    const r = db.exec("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_veiculos_status'");
                    if (r.length && r[0].values.length) return false;
                    return sameResult(res, "SELECT name FROM sqlite_master WHERE type = 'index'");
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Clientes de Alto Valor",
            concept: "HAVING",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "O <code>WHERE</code> filtra linhas antes do agrupamento; o <code>HAVING</code> filtra os grupos depois que as agregações foram calculadas. Por isso só no <code>HAVING</code> podemos escrever condições como <code>SUM(valor_total) > 1300</code>.",
            task: "Mostre o <code>nome</code> do cliente e a soma de <code>valor_total</code> como <code>total_gasto</code>, apenas para clientes cujo total gasto em locações seja maior que 1300.",
            startCode: "SELECT \n    c.nome,\n    SUM(l.valor_total) AS total_gasto\nFROM locacoes l\nJOIN clientes c ON l.cliente_id = c.id\nGROUP BY c.id, c.nome\nHAVING ;",
            solution: "SELECT \n    c.nome,\n    SUM(l.valor_total) AS total_gasto\nFROM locacoes l\nJOIN clientes c ON l.cliente_id = c.id\nGROUP BY c.id, c.nome\nHAVING SUM(l.valor_total) > 1300;",
            validator: (res) => sameResult(res, "SELECT c.nome, SUM(l.valor_total) FROM locacoes l JOIN clientes c ON l.cliente_id = c.id GROUP BY c.id, c.nome HAVING SUM(l.valor_total) > 1300", { columns: ['nome', 'total_gasto'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Clientes e Carros Únicos",
            concept: "COUNT(DISTINCT)",
            icon: '<i class="ph-fill ph-hash"></i>',
            theory: "<code>COUNT(*)</code> conta linhas; <code>COUNT(DISTINCT coluna)</code> conta apenas valores diferentes. Se o mesmo cliente alugou três vezes, ele entra uma única vez na contagem distinta. É assim que medimos 'clientes ativos' ou 'carros que giraram'.",
            task: "Em uma linha, a partir de <code>locacoes</code>, mostre o total de locações (<code>total_locacoes</code>), quantos clientes diferentes alugaram (<code>clientes_unicos</code>) e quantos veículos diferentes foram alugados (<code>veiculos_unicos</code>).",
            startCode: "SELECT \n    COUNT(*) AS total_locacoes,\n    COUNT() AS clientes_unicos,\n    COUNT() AS veiculos_unicos\nFROM locacoes;",
            solution: "SELECT \n    COUNT(*) AS total_locacoes,\n    COUNT(DISTINCT cliente_id) AS clientes_unicos,\n    COUNT(DISTINCT veiculo_id) AS veiculos_unicos\nFROM locacoes;",
            validator: (res) => sameResult(res, "SELECT COUNT(*), COUNT(DISTINCT cliente_id), COUNT(DISTINCT veiculo_id) FROM locacoes", { columns: ['total_locacoes', 'clientes_unicos', 'veiculos_unicos'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Média por Marca e Categoria",
            concept: "GROUP BY múltiplo",
            icon: '<i class="ph-fill ph-table"></i>',
            theory: "Podemos agrupar por mais de uma coluna: <code>GROUP BY marca, categoria</code> cria um grupo para cada combinação existente. <code>ROUND(AVG(x), 2)</code> arredonda a média para 2 casas, deixando o relatório apresentável.",
            task: "Mostre <code>marca</code>, <code>categoria</code>, a quantidade de veículos (<code>qtd</code>) e a média do <code>valor_diaria</code> arredondada para 2 casas (<code>media_diaria</code>), agrupando por marca e categoria. Ordene por <code>marca</code> e depois <code>categoria</code>.",
            startCode: "SELECT \n    marca,\n    categoria,\n    COUNT(*) AS qtd,\n    ROUND(...) AS media_diaria\nFROM veiculos\nGROUP BY \nORDER BY ;",
            solution: "SELECT \n    marca,\n    categoria,\n    COUNT(*) AS qtd,\n    ROUND(AVG(valor_diaria), 2) AS media_diaria\nFROM veiculos\nGROUP BY marca, categoria\nORDER BY marca, categoria;",
            validator: (res) => sameResult(res, "SELECT marca, categoria, COUNT(*), ROUND(AVG(valor_diaria), 2) FROM veiculos GROUP BY marca, categoria ORDER BY marca, categoria", { ordered: true, columns: ['marca', 'categoria', 'qtd', 'media_diaria'] })
        },
        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Todos os Clientes e suas Locações",
            concept: "LEFT JOIN",
            icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>LEFT JOIN</code> mantém todas as linhas da tabela da esquerda, mesmo sem correspondência na direita (as colunas da direita vêm como <code>NULL</code>). Atenção: para contar, use <code>COUNT(l.id)</code> — ele ignora NULL e dá 0 para quem nunca alugou, enquanto <code>COUNT(*)</code> daria 1.",
            task: "Liste <b>todos</b> os clientes com o <code>nome</code> e a quantidade de locações de cada um (<code>qtd_locacoes</code>), incluindo quem nunca alugou (com 0).",
            startCode: "SELECT \n    c.nome,\n    COUNT() AS qtd_locacoes\nFROM clientes c\nLEFT JOIN locacoes l ON \nGROUP BY c.id, c.nome;",
            solution: "SELECT \n    c.nome,\n    COUNT(l.id) AS qtd_locacoes\nFROM clientes c\nLEFT JOIN locacoes l ON l.cliente_id = c.id\nGROUP BY c.id, c.nome;",
            validator: (res) => sameResult(res, "SELECT c.nome, (SELECT COUNT(*) FROM locacoes l WHERE l.cliente_id = c.id) FROM clientes c", { columns: ['nome', 'qtd_locacoes'] })
        },
        {
            id: 117, moduleId: 12,
            title: "Carros Parados no Pátio",
            concept: "Anti-join",
            icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "Para achar registros <b>sem</b> correspondência usamos o anti-join: <code>LEFT JOIN</code> + <code>WHERE coluna_da_direita IS NULL</code>. Se o veículo nunca apareceu em <code>locacoes</code>, as colunas da locação vêm nulas e ele é filtrado. Outra forma equivalente é <code>NOT EXISTS</code>.",
            task: "Liste o <code>modelo</code> e a <code>marca</code> dos veículos que <b>nunca</b> foram alugados, usando <code>LEFT JOIN</code> com <code>locacoes</code> e <code>IS NULL</code>.",
            startCode: "SELECT \n    v.modelo,\n    v.marca\nFROM veiculos v\nLEFT JOIN locacoes l ON \nWHERE ;",
            solution: "SELECT \n    v.modelo,\n    v.marca\nFROM veiculos v\nLEFT JOIN locacoes l ON l.veiculo_id = v.id\nWHERE l.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT modelo, marca FROM veiculos WHERE id NOT IN (SELECT veiculo_id FROM locacoes WHERE veiculo_id IS NOT NULL)")
        },
        {
            id: 118, moduleId: 12,
            title: "Pares da Mesma Marca",
            concept: "Self-join",
            icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "Um self-join liga a tabela a ela mesma usando apelidos diferentes (<code>a</code> e <code>b</code>). A condição <code>a.id &lt; b.id</code> evita parear um carro com ele mesmo e repetir o par invertido. Útil para comparar itens do mesmo grupo, como modelos concorrentes da mesma marca.",
            task: "Liste os pares de veículos da mesma <code>marca</code>: mostre <code>a.marca</code> como <code>marca</code>, <code>a.modelo</code> como <code>modelo_1</code> e <code>b.modelo</code> como <code>modelo_2</code>, usando <code>a.id &lt; b.id</code> para não repetir pares.",
            startCode: "SELECT \n    a.marca AS marca,\n    a.modelo AS modelo_1,\n    b.modelo AS modelo_2\nFROM veiculos a\nJOIN veiculos b ON \n    AND ;",
            solution: "SELECT \n    a.marca AS marca,\n    a.modelo AS modelo_1,\n    b.modelo AS modelo_2\nFROM veiculos a\nJOIN veiculos b ON a.marca = b.marca\n    AND a.id < b.id;",
            validator: (res) => sameResult(res, "SELECT a.marca, a.modelo, b.modelo FROM veiculos a JOIN veiculos b ON a.marca = b.marca AND a.id < b.id", { columns: ['marca', 'modelo_1', 'modelo_2'] })
        },
        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Clientes sem CNH",
            concept: "IS NULL",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>NULL</code> significa 'valor desconhecido', e por isso <code>cnh = NULL</code> nunca é verdadeiro. Para testar ausência de valor use <code>IS NULL</code>, e para presença <code>IS NOT NULL</code>. Isso vale igual no SQL Server.",
            task: "A locadora não pode liberar carro sem CNH. Liste o <code>nome</code> e o <code>estado</code> dos clientes cuja <code>cnh</code> não foi informada (é nula).",
            startCode: "SELECT \n    nome,\n    estado\nFROM clientes\nWHERE ;",
            solution: "SELECT \n    nome,\n    estado\nFROM clientes\nWHERE cnh IS NULL;",
            validator: (res) => sameResult(res, "SELECT nome, estado FROM clientes WHERE cnh IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Cadastro com CNH Tratada",
            concept: "COALESCE",
            icon: '<i class="ph-fill ph-puzzle-piece"></i>',
            theory: "<code>COALESCE(a, b, ...)</code> devolve o primeiro valor que não for <code>NULL</code>. É perfeito para trocar vazios por um texto padrão em relatórios. O SQLite também tem <code>IFNULL(a, b)</code>; no SQL Server o equivalente é <code>ISNULL(a, b)</code> (e o <code>COALESCE</code> também funciona).",
            task: "Liste o <code>nome</code> de todos os clientes e a CNH com o apelido <code>cnh_exibicao</code>, mostrando 'Não informada' quando a <code>cnh</code> for nula.",
            startCode: "SELECT \n    nome,\n    COALESCE() AS cnh_exibicao\nFROM clientes;",
            solution: "SELECT \n    nome,\n    COALESCE(cnh, 'Não informada') AS cnh_exibicao\nFROM clientes;",
            validator: (res) => sameResult(res, "SELECT nome, COALESCE(cnh, 'Não informada') FROM clientes", { columns: ['nome', 'cnh_exibicao'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Marcas Premium ou SUV",
            concept: "UNION / UNION ALL",
            icon: '<i class="ph-fill ph-git-merge"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas consultas e remove linhas duplicadas; <code>UNION ALL</code> empilha tudo, mantendo repetições (e é mais rápido). As duas consultas precisam ter o mesmo número de colunas, com tipos compatíveis.",
            task: "Monte uma lista <b>sem repetições</b> de <code>marca</code> que tenham veículos da categoria 'SUV' <b>ou</b> veículos com <code>valor_diaria</code> acima de 200, juntando duas consultas com <code>UNION</code>.",
            startCode: "SELECT marca FROM veiculos WHERE categoria = 'SUV'\n...\nSELECT marca FROM veiculos WHERE ;",
            solution: "SELECT marca\nFROM veiculos\nWHERE categoria = 'SUV'\nUNION\nSELECT marca\nFROM veiculos\nWHERE valor_diaria > 200;",
            validator: (res) => sameResult(res, "SELECT DISTINCT marca FROM veiculos WHERE categoria = 'SUV' OR valor_diaria > 200")
        },
        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Tabela de Manutenções",
            concept: "CREATE TABLE",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define uma tabela nova e suas regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> impede campos vazios e <code>CHECK</code> valida valores (ex.: custo não negativo). <code>IF NOT EXISTS</code> evita erro se a tabela já existir — se você criou errado, rode <code>DROP TABLE manutencoes;</code> e tente de novo. No SQL Server a chave autoincremento usa <code>IDENTITY(1,1)</code>.",
            task: "Crie (com <code>IF NOT EXISTS</code>) a tabela <code>manutencoes</code> com: <code>id</code> INTEGER chave primária; <code>veiculo_id</code> INTEGER NOT NULL; <code>descricao</code> TEXT NOT NULL; <code>custo</code> REAL com <code>CHECK (custo &gt;= 0)</code>.",
            startCode: "CREATE TABLE IF NOT EXISTS manutencoes (\n    id INTEGER ...,\n    veiculo_id INTEGER ...,\n    descricao TEXT ...,\n    custo REAL CHECK (...)\n);",
            solution: "CREATE TABLE IF NOT EXISTS manutencoes (\n    id INTEGER PRIMARY KEY,\n    veiculo_id INTEGER NOT NULL,\n    descricao TEXT NOT NULL,\n    custo REAL CHECK (custo >= 0)\n);",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('manutencoes')");
                    if (!info.length) return false;
                    const cols = {}; info[0].values.forEach(r => { cols[String(r[1]).toLowerCase()] = { notnull: r[3], pk: r[5] }; });
                    if (!cols.id || !cols.veiculo_id || !cols.descricao || !cols.custo) return false;
                    if (!cols.id.pk || !cols.veiculo_id.notnull || !cols.descricao.notnull) return false;
                    const sql = db.exec("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'manutencoes'");
                    return /check\s*\(/i.test(sql[0].values[0][0]);
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Data do Serviço",
            concept: "ALTER TABLE",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "<code>ALTER TABLE ... ADD COLUMN</code> acrescenta uma coluna a uma tabela existente sem perder os dados (as linhas antigas ficam com <code>NULL</code> nela). No SQL Server a sintaxe é <code>ALTER TABLE t ADD coluna TIPO</code>, sem a palavra COLUMN. Se a coluna já existir, o comando dá erro — é só seguir em frente.",
            task: "Adicione à tabela <code>manutencoes</code> a coluna <code>data_servico</code> do tipo TEXT.",
            startCode: "ALTER TABLE manutencoes\nADD COLUMN ...;",
            solution: "ALTER TABLE manutencoes\nADD COLUMN data_servico TEXT;",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('manutencoes')");
                    return !!(info.length && info[0].values.some(r => String(r[1]).toLowerCase() === 'data_servico'));
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "View de Faturamento por Carro",
            concept: "CREATE VIEW",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "Uma <code>VIEW</code> é uma consulta salva com nome, usada como se fosse uma tabela: <code>SELECT * FROM vw_...</code>. Ela não guarda dados, só a lógica — ótima para padronizar relatórios que todo mundo usa. No SQLite existe <code>CREATE VIEW IF NOT EXISTS</code>; no SQL Server use <code>CREATE OR ALTER VIEW</code>.",
            task: "Crie a view <code>vw_faturamento_veiculo</code> com o <code>modelo</code> e a soma de <code>valor_total</code> como <code>faturamento</code> de cada veículo (JOIN entre <code>veiculos</code> e <code>locacoes</code>). Em seguida, consulte a view ordenando por <code>faturamento</code> do maior para o menor.",
            startCode: "CREATE VIEW IF NOT EXISTS vw_faturamento_veiculo AS\nSELECT \n    v.modelo,\n    SUM() AS faturamento\nFROM veiculos v\nJOIN locacoes l ON \nGROUP BY ;\n\nSELECT * FROM vw_faturamento_veiculo ORDER BY ;",
            solution: "CREATE VIEW IF NOT EXISTS vw_faturamento_veiculo AS\nSELECT \n    v.modelo,\n    SUM(l.valor_total) AS faturamento\nFROM veiculos v\nJOIN locacoes l ON l.veiculo_id = v.id\nGROUP BY v.id, v.modelo;\n\nSELECT *\nFROM vw_faturamento_veiculo\nORDER BY faturamento DESC;",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'vw_faturamento_veiculo'");
                    if (!v.length || !v[0].values.length) return false;
                } catch (e) { return false; }
                return sameResult(res, "SELECT v.modelo, SUM(l.valor_total) FROM veiculos v JOIN locacoes l ON l.veiculo_id = v.id GROUP BY v.id, v.modelo ORDER BY 2 DESC", { ordered: true, columns: ['modelo', 'faturamento'] });
            }
        },
        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Melhor Cliente de Cada Categoria",
            concept: "CTE + JOIN + RANK",
            icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "Desafios reais juntam várias peças: uma CTE para somar o gasto por categoria e cliente, <code>RANK() OVER (PARTITION BY ...)</code> para ranquear dentro de cada categoria e um filtro final <code>WHERE posicao = 1</code>. Funções de janela não podem ir no <code>WHERE</code> da mesma consulta, por isso a CTE (ou subquery) é necessária.",
            task: "O gerente comercial quer premiar o cliente que mais gastou em cada <code>categoria</code> de veículo. Mostre <code>categoria</code>, <code>cliente</code> (nome) e <code>total_gasto</code> (soma de <code>valor_total</code>) apenas do 1º colocado de cada categoria, ordenado por <code>categoria</code>.",
            startCode: "WITH gastos AS (\n    SELECT \n        v.categoria,\n        c.nome AS cliente,\n        SUM(l.valor_total) AS total_gasto\n    FROM locacoes l\n    JOIN veiculos v ON \n    JOIN clientes c ON \n    GROUP BY \n),\nranking AS (\n    SELECT \n        *,\n        RANK() OVER (...) AS posicao\n    FROM gastos\n)\nSELECT \n    categoria,\n    cliente,\n    total_gasto\nFROM ranking\nWHERE \nORDER BY ;",
            solution: "WITH gastos AS (\n    SELECT \n        v.categoria,\n        c.nome AS cliente,\n        SUM(l.valor_total) AS total_gasto\n    FROM locacoes l\n    JOIN veiculos v ON l.veiculo_id = v.id\n    JOIN clientes c ON l.cliente_id = c.id\n    GROUP BY v.categoria, c.id, c.nome\n),\nranking AS (\n    SELECT \n        *,\n        RANK() OVER (PARTITION BY categoria ORDER BY total_gasto DESC) AS posicao\n    FROM gastos\n)\nSELECT \n    categoria,\n    cliente,\n    total_gasto\nFROM ranking\nWHERE posicao = 1\nORDER BY categoria;",
            validator: (res) => sameResult(res, "SELECT categoria, nome, total FROM (SELECT v.categoria, c.nome, SUM(l.valor_total) AS total, RANK() OVER (PARTITION BY v.categoria ORDER BY SUM(l.valor_total) DESC) AS rk FROM locacoes l JOIN veiculos v ON l.veiculo_id = v.id JOIN clientes c ON l.cliente_id = c.id GROUP BY v.categoria, c.id, c.nome) WHERE rk = 1 ORDER BY categoria", { ordered: true, columns: ['categoria', 'cliente', 'total_gasto'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Relatório por Duração",
            concept: "CASE + GROUP BY + HAVING",
            icon: '<i class="ph-fill ph-receipt"></i>',
            theory: "Um <code>CASE</code> pode criar faixas (buckets) que depois viram grupos no <code>GROUP BY</code>. Combinando com <code>HAVING</code>, mostramos só as faixas relevantes. No SQLite podemos agrupar pelo apelido da coluna; no SQL Server é preciso repetir a expressão do <code>CASE</code> no <code>GROUP BY</code>.",
            task: "A diretoria quer entender o perfil das locações por duração. Classifique cada locação em <code>faixa</code>: 'Curta' (até 3 dias), 'Média' (4 a 5 dias) e 'Longa' (6 dias ou mais). Mostre <code>faixa</code>, <code>qtd_locacoes</code>, <code>faturamento</code> (soma de <code>valor_total</code>) e <code>ticket_medio</code> (média de <code>valor_total</code> com <code>ROUND(..., 2)</code>), apenas para faixas com pelo menos 2 locações, do maior para o menor faturamento.",
            startCode: "SELECT \n    CASE \n        WHEN ... THEN 'Curta'\n        WHEN ... THEN 'Média'\n        ELSE 'Longa'\n    END AS faixa,\n    COUNT(*) AS qtd_locacoes,\n    SUM(valor_total) AS faturamento,\n    ROUND(AVG(valor_total), 2) AS ticket_medio\nFROM locacoes\nGROUP BY faixa\nHAVING \nORDER BY ;",
            solution: "SELECT \n    CASE \n        WHEN dias <= 3 THEN 'Curta'\n        WHEN dias <= 5 THEN 'Média'\n        ELSE 'Longa'\n    END AS faixa,\n    COUNT(*) AS qtd_locacoes,\n    SUM(valor_total) AS faturamento,\n    ROUND(AVG(valor_total), 2) AS ticket_medio\nFROM locacoes\nGROUP BY faixa\nHAVING COUNT(*) >= 2\nORDER BY faturamento DESC;",
            validator: (res) => sameResult(res, "SELECT f, COUNT(*), SUM(valor_total), ROUND(AVG(valor_total), 2) FROM (SELECT valor_total, CASE WHEN dias <= 3 THEN 'Curta' WHEN dias <= 5 THEN 'Média' ELSE 'Longa' END AS f FROM locacoes) GROUP BY f HAVING COUNT(*) >= 2 ORDER BY 3 DESC", { ordered: true, columns: ['faixa', 'qtd_locacoes', 'faturamento', 'ticket_medio'] })
        },
        {
            id: 127, moduleId: 15,
            title: "Participação de Cada Marca",
            concept: "CTE + % do total",
            icon: '<i class="ph-fill ph-coins"></i>',
            theory: "Para calcular participação percentual, dividimos o valor de cada grupo pelo total geral. Uma CTE com o faturamento por marca facilita: o total sai de <code>(SELECT SUM(faturamento) FROM cte)</code>. Multiplique por <code>100.0</code> para evitar divisão inteira (no SQL Server vale o mesmo cuidado).",
            task: "O financeiro quer saber quanto cada <code>marca</code> representa no faturamento. Com uma CTE de faturamento por marca (JOIN de <code>locacoes</code> com <code>veiculos</code>), mostre <code>marca</code>, <code>faturamento</code> e <code>percentual</code> = 100.0 × faturamento da marca ÷ soma do faturamento de todas as marcas, com <code>ROUND(..., 1)</code>. Ordene do maior para o menor faturamento.",
            startCode: "WITH fat AS (\n    SELECT \n        v.marca,\n        SUM(l.valor_total) AS faturamento\n    FROM locacoes l\n    JOIN veiculos v ON \n    GROUP BY \n)\nSELECT \n    marca,\n    faturamento,\n    ROUND(...) AS percentual\nFROM fat\nORDER BY ;",
            solution: "WITH fat AS (\n    SELECT \n        v.marca,\n        SUM(l.valor_total) AS faturamento\n    FROM locacoes l\n    JOIN veiculos v ON l.veiculo_id = v.id\n    GROUP BY v.marca\n)\nSELECT \n    marca,\n    faturamento,\n    ROUND(100.0 * faturamento / (SELECT SUM(faturamento) FROM fat), 1) AS percentual\nFROM fat\nORDER BY faturamento DESC;",
            validator: (res) => sameResult(res, "SELECT v.marca, SUM(l.valor_total), ROUND(100.0 * SUM(l.valor_total) / SUM(SUM(l.valor_total)) OVER (), 1) FROM locacoes l JOIN veiculos v ON l.veiculo_id = v.id GROUP BY v.marca ORDER BY 2 DESC", { ordered: true, columns: ['marca', 'faturamento', 'percentual'] })
        }
    ]
};

extraLessons.fintech = {
    setup: `
            INSERT INTO clientes VALUES (4, 'Carlos Mendes', '55555555555', 'PF'), (5, 'Tech Solar Ltda', '66666666666', 'PJ'), (6, 'Beatriz Costa', '77777777777', 'PF'), (7, 'Rafael Souza', '88888888888', 'PF');
            INSERT INTO contas VALUES (4, 1, 80000, 100000, 'Ativa'), (5, 4, 3200, NULL, 'Ativa'), (6, 5, 9800, 30000, 'Ativa'), (7, 6, 750, NULL, 'Bloqueada'), (8, 4, 0, 2000, 'Encerrada');
            INSERT INTO transacoes VALUES
                (5, 1, 'PIX Recebido', 3500, '2023-10-05'),
                (6, 2, 'Saque', 2800, '2023-10-06'),
                (7, 4, 'Deposito', 4500, '2023-10-07'),
                (8, 5, 'Deposito', 1200, '2023-10-08'),
                (9, 5, 'Saque', 300, '2023-10-10'),
                (10, 6, 'PIX Recebido', 2500, '2023-10-11'),
                (11, 6, 'Saque', 900, '2023-10-12'),
                (12, 2, 'PIX Recebido', 1500, '2023-10-15'),
                (13, 4, 'Saque', 2000, '2023-10-18'),
                (14, 7, 'Deposito', 150, '2023-10-20'),
                (15, 1, 'Saque', 4000, '2023-11-02'),
                (16, 6, 'Deposito', 3000, '2023-11-05'),
                (17, 5, 'PIX Recebido', 600, '2023-11-08');
    `,
    lessons: [
        // ---------- Módulo 1 ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Saldo com Rendimento",
            concept: "Coluna calculada",
            icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Dá para fazer contas direto no <code>SELECT</code>: <code>saldo * 1.01</code> gera uma coluna nova, sem alterar a tabela. Combine com <code>AS</code> para dar um nome claro ao resultado. É assim que se projetam rendimentos, tarifas e juros em relatórios rápidos.",
            task: "A área de investimentos quer projetar o saldo com 1% de rendimento. Selecione <code>id</code>, <code>saldo</code> e <code>saldo * 1.01</code> com o apelido <code>saldo_projetado</code>, da tabela <code>contas</code>.",
            startCode: "SELECT \n    id, \n    saldo, \n    ... AS saldo_projetado\nFROM contas;",
            solution: "SELECT \n    id, \n    saldo, \n    saldo * 1.01 AS saldo_projetado\nFROM contas;",
            validator: (res) => sameResult(res, "SELECT id, saldo, saldo * 1.01 FROM contas", { columns: ['saldo_projetado'] })
        },
        // ---------- Módulo 2 ----------
        {
            id: 101, moduleId: 2, after: 4,
            title: "Empresas Ltda",
            concept: "LIKE",
            icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "O <code>LIKE</code> busca padrões em texto: <code>%</code> representa qualquer sequência de caracteres e <code>_</code> exatamente um caractere. <code>'%Ltda%'</code> encontra o termo em qualquer posição. Útil para achar clientes quando você só lembra parte do nome.",
            task: "O compliance quer as empresas formalizadas como Ltda. Selecione <code>nome</code> e <code>tipo_conta</code> dos <code>clientes</code> cujo <code>nome</code> contenha 'Ltda'.",
            startCode: "SELECT \n    nome, \n    tipo_conta\nFROM clientes\nWHERE nome LIKE ;",
            solution: "SELECT \n    nome, \n    tipo_conta\nFROM clientes\nWHERE nome LIKE '%Ltda%';",
            validator: (res) => sameResult(res, "SELECT nome, tipo_conta FROM clientes WHERE nome LIKE '%Ltda%'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Faixa de Monitoramento",
            concept: "IN / BETWEEN",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>IN (...)</code> testa se o valor está numa lista, substituindo vários <code>OR</code>. <code>BETWEEN a AND b</code> filtra uma faixa, incluindo os dois extremos. Juntos, deixam filtros de auditoria curtos e legíveis.",
            task: "A prevenção a fraudes monitora saídas e PIX de valor médio. Selecione <code>id</code>, <code>tipo</code> e <code>valor</code> das <code>transacoes</code> cujo <code>tipo</code> esteja em ('Saque', 'PIX Recebido') e cujo <code>valor</code> esteja entre 1000 e 3000.",
            startCode: "SELECT \n    id, \n    tipo, \n    valor\nFROM transacoes\nWHERE tipo IN ()\n  AND valor BETWEEN ;",
            solution: "SELECT \n    id, \n    tipo, \n    valor\nFROM transacoes\nWHERE tipo IN ('Saque', 'PIX Recebido')\n  AND valor BETWEEN 1000 AND 3000;",
            validator: (res) => sameResult(res, "SELECT id, tipo, valor FROM transacoes WHERE tipo IN ('Saque', 'PIX Recebido') AND valor >= 1000 AND valor <= 3000")
        },
        // ---------- Módulo 3 ----------
        {
            id: 103, moduleId: 3, after: 9,
            title: "Raio-X dos Saldos Ativos",
            concept: "AVG / MIN / MAX",
            icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "<code>AVG()</code> calcula a média, <code>MIN()</code> o menor e <code>MAX()</code> o maior valor de uma coluna. Podem ser usadas juntas na mesma consulta e combinadas com <code>WHERE</code> para olhar só um recorte da carteira.",
            task: "Para as <code>contas</code> com <code>status</code> 'Ativa', mostre <code>AVG(saldo)</code> como <code>saldo_medio</code>, <code>MIN(saldo)</code> como <code>menor_saldo</code> e <code>MAX(saldo)</code> como <code>maior_saldo</code>.",
            startCode: "SELECT \n    ... AS saldo_medio, \n    ... AS menor_saldo, \n    ... AS maior_saldo\nFROM contas\nWHERE ;",
            solution: "SELECT \n    AVG(saldo) AS saldo_medio, \n    MIN(saldo) AS menor_saldo, \n    MAX(saldo) AS maior_saldo\nFROM contas\nWHERE status = 'Ativa';",
            validator: (res) => sameResult(res, "SELECT AVG(saldo), MIN(saldo), MAX(saldo) FROM contas WHERE status = 'Ativa'", { columns: ['saldo_medio', 'menor_saldo', 'maior_saldo'] })
        },
        // ---------- Módulo 4 ----------
        {
            id: 104, moduleId: 4, after: 11,
            title: "Movimento por Cliente",
            concept: "JOIN + GROUP BY",
            icon: '<i class="ph-fill ph-users"></i>',
            theory: "Depois de ligar as tabelas com <code>JOIN</code>, dá para agrupar pelo campo de outra tabela. Aqui as transações só conhecem a conta, mas queremos totais por <code>nome</code> do cliente: junte <code>transacoes</code> → <code>contas</code> → <code>clientes</code> e use <code>GROUP BY</code>.",
            task: "Mostre o <code>nome</code> do cliente, a quantidade de transações (<code>COUNT</code>) como <code>qtd_transacoes</code> e a soma do <code>valor</code> como <code>total_movimentado</code>, agrupando por cliente.",
            startCode: "SELECT \n    c.nome, \n    ... AS qtd_transacoes, \n    ... AS total_movimentado\nFROM transacoes t\nJOIN contas o ON t.conta_id = o.id\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY ;",
            solution: "SELECT \n    c.nome, \n    COUNT(*) AS qtd_transacoes, \n    SUM(t.valor) AS total_movimentado\nFROM transacoes t\nJOIN contas o ON t.conta_id = o.id\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY c.id, c.nome;",
            validator: (res) => sameResult(res, "SELECT c.nome, COUNT(*), SUM(t.valor) FROM transacoes t JOIN contas o ON t.conta_id = o.id JOIN clientes c ON o.cliente_id = c.id GROUP BY c.id, c.nome", { columns: ['nome', 'qtd_transacoes', 'total_movimentado'] })
        },
        // ---------- Módulo 5 ----------
        {
            id: 105, moduleId: 5, after: 13,
            title: "Limite das Contas Bloqueadas",
            concept: "UPDATE com cálculo",
            icon: '<i class="ph-fill ph-lightning"></i>',
            theory: "Um <code>UPDATE</code> pode usar outras colunas da própria linha no cálculo, como <code>SET limite_credito = saldo * 0.10</code>, e alterar muitas linhas de uma vez. O <code>WHERE</code> é o que limita quem será afetado: sem ele, TODAS as contas mudam. Teste antes com um <code>SELECT</code> usando o mesmo filtro.",
            task: "Nova política de risco: toda conta com <code>status</code> 'Bloqueada' passa a ter <code>limite_credito</code> igual a 10% do próprio <code>saldo</code> (<code>saldo * 0.10</code>). Faça o <code>UPDATE</code> só nessas contas e depois liste <code>id</code>, <code>saldo</code>, <code>limite_credito</code> e <code>status</code> de todas as <code>contas</code>.",
            startCode: "UPDATE contas\nSET limite_credito = \nWHERE status = ;\n\nSELECT id, saldo, limite_credito, status FROM contas;",
            solution: "UPDATE contas\nSET limite_credito = saldo * 0.10\nWHERE status = 'Bloqueada';\n\nSELECT id, saldo, limite_credito, status FROM contas;",
            validator: (res) => {
                try {
                    const blocked = db.exec("SELECT COUNT(*) FROM contas WHERE status = 'Bloqueada'")[0].values[0][0];
                    const wrong = db.exec("SELECT COUNT(*) FROM contas WHERE status = 'Bloqueada' AND (limite_credito IS NULL OR ABS(limite_credito - saldo * 0.10) >= 1)")[0].values[0][0];
                    const othersKept = db.exec("SELECT COUNT(*) FROM contas WHERE status <> 'Bloqueada' AND (limite_credito IS NULL OR ABS(limite_credito - saldo * 0.10) >= 1)")[0].values[0][0];
                    return blocked > 0 && wrong === 0 && othersKept > 0;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 6 ----------
        {
            id: 106, moduleId: 6, after: 15,
            title: "Contas de Alto Giro",
            concept: "CTE (WITH)",
            icon: '<i class="ph-fill ph-stack"></i>',
            theory: "Uma CTE (<code>WITH nome AS (SELECT ...)</code>) cria uma tabela temporária com nome, válida só nessa consulta. Ela deixa a lógica em etapas: primeiro você calcula, depois filtra o resultado como se fosse uma tabela. A sintaxe é a mesma no SQL Server.",
            task: "Crie uma CTE chamada <code>movimento</code> com <code>conta_id</code> e <code>SUM(valor)</code> como <code>total_movimentado</code> por conta (tabela <code>transacoes</code>). Depois selecione <code>conta_id</code> e <code>total_movimentado</code> da CTE onde o total seja maior que 5000.",
            startCode: "WITH movimento AS (\n    SELECT \n        conta_id, \n        ... AS total_movimentado\n    FROM transacoes\n    GROUP BY \n)\nSELECT \n    conta_id, \n    total_movimentado\nFROM movimento\nWHERE ;",
            solution: "WITH movimento AS (\n    SELECT \n        conta_id, \n        SUM(valor) AS total_movimentado\n    FROM transacoes\n    GROUP BY conta_id\n)\nSELECT \n    conta_id, \n    total_movimentado\nFROM movimento\nWHERE total_movimentado > 5000;",
            validator: (res) => sameResult(res, "SELECT conta_id, SUM(valor) FROM transacoes GROUP BY conta_id HAVING SUM(valor) > 5000", { columns: ['conta_id', 'total_movimentado'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Clientes com Conta Bloqueada",
            concept: "EXISTS",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>EXISTS (subquery)</code> é verdadeiro quando a subquery devolve pelo menos uma linha. A subquery costuma ser correlacionada: ela usa uma coluna da consulta de fora (<code>o.cliente_id = c.id</code>). <code>NOT EXISTS</code> faz o contrário e acha quem NÃO tem correspondência.",
            task: "Liste o <code>nome</code> dos <code>clientes</code> para os quais EXISTE ao menos uma conta (<code>contas</code>) com <code>status</code> 'Bloqueada'.",
            startCode: "SELECT \n    c.nome\nFROM clientes c\nWHERE EXISTS (\n    SELECT 1\n    FROM contas o\n    WHERE \n);",
            solution: "SELECT \n    c.nome\nFROM clientes c\nWHERE EXISTS (\n    SELECT 1\n    FROM contas o\n    WHERE o.cliente_id = c.id\n      AND o.status = 'Bloqueada'\n);",
            validator: (res) => sameResult(res, "SELECT nome FROM clientes WHERE id IN (SELECT cliente_id FROM contas WHERE status = 'Bloqueada')")
        },
        // ---------- Módulo 7 ----------
        {
            id: 108, moduleId: 7, after: 16,
            title: "Ordem das Transações por Conta",
            concept: "ROW_NUMBER + PARTITION",
            icon: '<i class="ph-fill ph-list-numbers"></i>',
            theory: "<code>ROW_NUMBER() OVER (PARTITION BY coluna ORDER BY outra)</code> numera as linhas 1, 2, 3... recomeçando a contagem a cada grupo definido no <code>PARTITION BY</code>. Serve para achar a primeira compra, o último acesso ou o N-ésimo evento de cada cliente. Funciona igual no SQL Server.",
            task: "Na tabela <code>transacoes</code>, mostre <code>conta_id</code>, <code>data_hora</code>, <code>valor</code> e um número sequencial <code>ordem</code> que recomeça em cada conta, seguindo a <code>data_hora</code> (mais antiga = 1).",
            startCode: "SELECT \n    conta_id, \n    data_hora, \n    valor, \n    ROW_NUMBER() OVER (PARTITION BY  ORDER BY ) AS ordem\nFROM transacoes;",
            solution: "SELECT \n    conta_id, \n    data_hora, \n    valor, \n    ROW_NUMBER() OVER (PARTITION BY conta_id ORDER BY data_hora) AS ordem\nFROM transacoes;",
            validator: (res) => sameResult(res, "SELECT conta_id, data_hora, valor, ROW_NUMBER() OVER (PARTITION BY conta_id ORDER BY data_hora) FROM transacoes", { columns: ['ordem'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Comparar com a Transação Anterior",
            concept: "LAG()",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>LAG(coluna) OVER (ORDER BY ...)</code> traz o valor da linha anterior na ordem indicada; na primeira linha ele devolve <code>NULL</code>. É a forma clássica de comparar um evento com o anterior (variação de valor, tempo entre compras). <code>LEAD()</code> faz o mesmo olhando para a próxima linha.",
            task: "Para a conta de <code>conta_id</code> = 1, mostre <code>id</code>, <code>data_hora</code>, <code>valor</code> e o valor da transação anterior (por <code>data_hora</code>) como <code>valor_anterior</code>. Ordene por <code>data_hora</code>.",
            startCode: "SELECT \n    id, \n    data_hora, \n    valor, \n    LAG() OVER () AS valor_anterior\nFROM transacoes\nWHERE conta_id = 1\nORDER BY ;",
            solution: "SELECT \n    id, \n    data_hora, \n    valor, \n    LAG(valor) OVER (ORDER BY data_hora) AS valor_anterior\nFROM transacoes\nWHERE conta_id = 1\nORDER BY data_hora;",
            validator: (res) => sameResult(res, "SELECT id, data_hora, valor, LAG(valor) OVER (ORDER BY data_hora) FROM transacoes WHERE conta_id = 1 ORDER BY data_hora", { ordered: true, columns: ['valor_anterior'] })
        },
        // ---------- Módulo 8 ----------
        {
            id: 110, moduleId: 8, after: 17,
            title: "Entradas x Saídas por Conta",
            concept: "SUM(CASE WHEN)",
            icon: '<i class="ph-fill ph-scales"></i>',
            theory: "Colocar um <code>CASE</code> dentro do <code>SUM</code> cria uma agregação condicional: só somam as linhas que atendem à condição, e as outras contam 0. Assim um único <code>GROUP BY</code> gera várias colunas de totais lado a lado, como um mini pivô.",
            task: "Por <code>conta_id</code>, mostre <code>entradas</code> (soma do <code>valor</code> quando o <code>tipo</code> for 'Deposito' ou 'PIX Recebido', senão 0) e <code>saidas</code> (soma do <code>valor</code> quando o <code>tipo</code> for 'Saque', senão 0). Use <code>ELSE 0</code> nos dois.",
            startCode: "SELECT \n    conta_id, \n    SUM(CASE WHEN  THEN valor ELSE 0 END) AS entradas, \n    SUM(CASE WHEN  THEN valor ELSE 0 END) AS saidas\nFROM transacoes\nGROUP BY ;",
            solution: "SELECT \n    conta_id, \n    SUM(CASE WHEN tipo IN ('Deposito', 'PIX Recebido') THEN valor ELSE 0 END) AS entradas, \n    SUM(CASE WHEN tipo = 'Saque' THEN valor ELSE 0 END) AS saidas\nFROM transacoes\nGROUP BY conta_id;",
            validator: (res) => sameResult(res, "SELECT conta_id, SUM(CASE WHEN tipo IN ('Deposito', 'PIX Recebido') THEN valor ELSE 0 END), SUM(CASE WHEN tipo = 'Saque' THEN valor ELSE 0 END) FROM transacoes GROUP BY conta_id", { columns: ['conta_id', 'entradas', 'saidas'] })
        },
        // ---------- Módulo 10 ----------
        {
            id: 111, moduleId: 10, after: 22,
            title: "Plano de Execução do Extrato",
            concept: "EXPLAIN QUERY PLAN",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o SQLite vai buscar os dados: <code>SCAN</code> lê a tabela inteira e <code>SEARCH ... USING INDEX</code> usa um índice. A coluna <code>detail</code> traz essa descrição. No SQL Server o equivalente é o Plano de Execução Estimado (Ctrl+L) ou <code>SET SHOWPLAN_TEXT ON</code>.",
            task: "Veja o plano da consulta do extrato: use <code>EXPLAIN QUERY PLAN</code> em <code>SELECT * FROM transacoes WHERE conta_id = 1;</code> e observe se o índice <code>idx_conta_trans</code> aparece na coluna <code>detail</code>.",
            startCode: "EXPLAIN QUERY PLAN\nSELECT ...;",
            solution: "EXPLAIN QUERY PLAN\nSELECT *\nFROM transacoes\nWHERE conta_id = 1;",
            validator: (res) => {
                if (!res || !res.length) return false;
                const r = res[res.length - 1];
                const i = r.columns.indexOf('detail');
                return i >= 0 && r.values.some(v => String(v[i]).toLowerCase().includes('transacoes'));
            }
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Removendo Índice Provisório",
            concept: "DROP INDEX",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices aceleram leituras, mas ocupam espaço e deixam <code>INSERT</code>/<code>UPDATE</code> mais lentos, então índices sem uso devem ser removidos com <code>DROP INDEX</code>. O <code>IF EXISTS</code> evita erro se o índice já não existir. No SQL Server é preciso informar a tabela: <code>DROP INDEX IF EXISTS idx ON tabela</code>.",
            task: "Crie um índice provisório <code>idx_trans_data</code> em <code>transacoes(data_hora)</code> com <code>CREATE INDEX IF NOT EXISTS</code> e, em seguida, remova-o com <code>DROP INDEX IF EXISTS</code>.",
            startCode: "CREATE INDEX IF NOT EXISTS idx_trans_data ON transacoes(data_hora);\n\nDROP INDEX ... ;",
            solution: "CREATE INDEX IF NOT EXISTS idx_trans_data ON transacoes(data_hora);\n\nDROP INDEX IF EXISTS idx_trans_data;",
            validator: (res) => {
                try {
                    const chk = db.exec("SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND name = 'idx_trans_data'");
                    return chk[0].values[0][0] === 0;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Clientes com Patrimônio Relevante",
            concept: "HAVING",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>WHERE</code> filtra linhas ANTES do agrupamento; <code>HAVING</code> filtra os grupos DEPOIS, por isso aceita funções de agregação como <code>SUM(saldo) &gt; 5000</code>. Use <code>HAVING</code> sempre que o critério for um total, média ou contagem do grupo.",
            task: "Na tabela <code>contas</code>, mostre <code>cliente_id</code> e <code>SUM(saldo)</code> como <code>saldo_total</code>, agrupando por cliente, e mantenha apenas os clientes com saldo total maior que 5000.",
            startCode: "SELECT \n    cliente_id, \n    ... AS saldo_total\nFROM contas\nGROUP BY cliente_id\nHAVING ;",
            solution: "SELECT \n    cliente_id, \n    SUM(saldo) AS saldo_total\nFROM contas\nGROUP BY cliente_id\nHAVING SUM(saldo) > 5000;",
            validator: (res) => sameResult(res, "SELECT cliente_id, SUM(saldo) FROM contas GROUP BY cliente_id HAVING SUM(saldo) > 5000", { columns: ['cliente_id', 'saldo_total'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Alcance de Cada Tipo de Transação",
            concept: "COUNT(DISTINCT)",
            icon: '<i class="ph-fill ph-hash"></i>',
            theory: "<code>COUNT(*)</code> conta linhas; <code>COUNT(DISTINCT coluna)</code> conta apenas valores diferentes. Uma conta que fez 2 saques vale 2 no primeiro e 1 no segundo. É a diferença entre 'quantas operações' e 'quantos clientes usaram'.",
            task: "Por <code>tipo</code> de transação, mostre <code>tipo</code>, <code>COUNT(*)</code> como <code>qtd_transacoes</code> e o número de contas diferentes como <code>contas_distintas</code>.",
            startCode: "SELECT \n    tipo, \n    ... AS qtd_transacoes, \n    ... AS contas_distintas\nFROM transacoes\nGROUP BY ;",
            solution: "SELECT \n    tipo, \n    COUNT(*) AS qtd_transacoes, \n    COUNT(DISTINCT conta_id) AS contas_distintas\nFROM transacoes\nGROUP BY tipo;",
            validator: (res) => sameResult(res, "SELECT tipo, COUNT(*), COUNT(DISTINCT conta_id) FROM transacoes GROUP BY tipo", { columns: ['qtd_transacoes', 'contas_distintas'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Saldo Médio por Perfil e Status",
            concept: "GROUP BY múltiplo + ROUND",
            icon: '<i class="ph-fill ph-table"></i>',
            theory: "O <code>GROUP BY</code> aceita várias colunas: cada combinação diferente vira um grupo (ex.: PF + Ativa, PF + Bloqueada). <code>ROUND(valor, 2)</code> arredonda para 2 casas, deixando médias apresentáveis. No SQL Server, <code>ROUND</code> funciona igual.",
            task: "Junte <code>contas</code> com <code>clientes</code> e, para cada combinação de <code>tipo_conta</code> e <code>status</code>, mostre <code>tipo_conta</code>, <code>status</code>, <code>COUNT(*)</code> como <code>qtd_contas</code> e <code>ROUND(AVG(saldo), 2)</code> como <code>saldo_medio</code>.",
            startCode: "SELECT \n    c.tipo_conta, \n    o.status, \n    ... AS qtd_contas, \n    ... AS saldo_medio\nFROM contas o\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY ;",
            solution: "SELECT \n    c.tipo_conta, \n    o.status, \n    COUNT(*) AS qtd_contas, \n    ROUND(AVG(o.saldo), 2) AS saldo_medio\nFROM contas o\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY c.tipo_conta, o.status;",
            validator: (res) => sameResult(res, "SELECT c.tipo_conta, o.status, COUNT(*), ROUND(AVG(o.saldo), 2) FROM contas o JOIN clientes c ON o.cliente_id = c.id GROUP BY c.tipo_conta, o.status", { columns: ['qtd_contas', 'saldo_medio'] })
        },
        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Todos os Clientes e suas Contas",
            concept: "LEFT JOIN",
            icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>INNER JOIN</code> só traz linhas com par nas duas tabelas. O <code>LEFT JOIN</code> mantém TODAS as linhas da tabela da esquerda e preenche com <code>NULL</code> quando não há correspondência à direita. Use quando ninguém pode sumir do relatório, como clientes ainda sem conta.",
            task: "Liste TODOS os <code>clientes</code>, mesmo os sem conta: mostre <code>c.nome</code>, o <code>id</code> da conta como <code>conta_id</code> e o <code>saldo</code>, usando <code>LEFT JOIN</code> de <code>clientes</code> com <code>contas</code>.",
            startCode: "SELECT \n    c.nome, \n    o.id AS conta_id, \n    o.saldo\nFROM clientes c\n... JOIN contas o ON ;",
            solution: "SELECT \n    c.nome, \n    o.id AS conta_id, \n    o.saldo\nFROM clientes c\nLEFT JOIN contas o ON o.cliente_id = c.id;",
            validator: (res) => sameResult(res, "SELECT c.nome, o.id, o.saldo FROM clientes c LEFT JOIN contas o ON o.cliente_id = c.id", { columns: ['conta_id'] })
        },
        {
            id: 117, moduleId: 12,
            title: "Contas sem Movimentação",
            concept: "Anti-join",
            icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "O anti-join encontra registros SEM correspondência: faça um <code>LEFT JOIN</code> e filtre <code>WHERE lado_direito.id IS NULL</code>. É o jeito clássico de achar contas paradas, clientes sem compra ou cadastros órfãos. <code>NOT EXISTS</code> chega ao mesmo resultado.",
            task: "O marketing quer reativar contas paradas. Liste <code>id</code>, <code>cliente_id</code> e <code>status</code> das <code>contas</code> que NÃO têm nenhuma transação, usando <code>LEFT JOIN</code> com <code>transacoes</code> e <code>IS NULL</code>.",
            startCode: "SELECT \n    o.id, \n    o.cliente_id, \n    o.status\nFROM contas o\nLEFT JOIN transacoes t ON \nWHERE ;",
            solution: "SELECT \n    o.id, \n    o.cliente_id, \n    o.status\nFROM contas o\nLEFT JOIN transacoes t ON t.conta_id = o.id\nWHERE t.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT id, cliente_id, status FROM contas o WHERE NOT EXISTS (SELECT 1 FROM transacoes t WHERE t.conta_id = o.id)")
        },
        {
            id: 118, moduleId: 12,
            title: "Clientes com Várias Contas",
            concept: "Self-join",
            icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "Um self-join liga a tabela com ela mesma usando dois apelidos (<code>contas a</code> e <code>contas b</code>). Serve para comparar linhas da mesma tabela, como contas do mesmo titular. A condição <code>a.id &lt; b.id</code> evita parear a conta com ela mesma e repetir o par invertido.",
            task: "Encontre os pares de contas do mesmo cliente: mostre <code>a.cliente_id</code>, <code>a.id</code> como <code>conta_a</code> e <code>b.id</code> como <code>conta_b</code>, ligando <code>contas a</code> com <code>contas b</code> pelo mesmo <code>cliente_id</code> e com <code>a.id &lt; b.id</code>.",
            startCode: "SELECT \n    a.cliente_id, \n    a.id AS conta_a, \n    b.id AS conta_b\nFROM contas a\nJOIN contas b ON ;",
            solution: "SELECT \n    a.cliente_id, \n    a.id AS conta_a, \n    b.id AS conta_b\nFROM contas a\nJOIN contas b ON a.cliente_id = b.cliente_id\n    AND a.id < b.id;",
            validator: (res) => sameResult(res, "SELECT a.cliente_id, a.id, b.id FROM contas a JOIN contas b ON a.cliente_id = b.cliente_id AND a.id < b.id", { columns: ['conta_a', 'conta_b'] })
        },
        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Contas sem Limite Definido",
            concept: "IS NULL / IS NOT NULL",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>NULL</code> significa 'sem valor' e não é igual a nada, nem a outro <code>NULL</code>: por isso <code>= NULL</code> nunca encontra linhas. Use <code>IS NULL</code> para achar campos vazios e <code>IS NOT NULL</code> para o contrário.",
            task: "O crédito precisa analisar contas sem limite cadastrado. Selecione <code>id</code>, <code>cliente_id</code> e <code>saldo</code> das <code>contas</code> cujo <code>limite_credito</code> seja nulo.",
            startCode: "SELECT \n    id, \n    cliente_id, \n    saldo\nFROM contas\nWHERE limite_credito ;",
            solution: "SELECT \n    id, \n    cliente_id, \n    saldo\nFROM contas\nWHERE limite_credito IS NULL;",
            validator: (res) => sameResult(res, "SELECT id, cliente_id, saldo FROM contas WHERE limite_credito IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Poder de Compra",
            concept: "COALESCE",
            icon: '<i class="ph-fill ph-coins"></i>',
            theory: "Qualquer conta com <code>NULL</code> dá <code>NULL</code>: <code>saldo + NULL</code> é <code>NULL</code>. <code>COALESCE(a, b)</code> devolve o primeiro valor não nulo, então <code>COALESCE(limite_credito, 0)</code> troca o vazio por zero. No SQLite também existe <code>IFNULL</code>; no SQL Server, <code>ISNULL</code> (e <code>COALESCE</code> também funciona).",
            task: "Mostre <code>id</code>, <code>saldo</code>, <code>COALESCE(limite_credito, 0)</code> como <code>limite_ajustado</code> e <code>saldo</code> + limite ajustado como <code>poder_compra</code>, para todas as <code>contas</code>.",
            startCode: "SELECT \n    id, \n    saldo, \n    ... AS limite_ajustado, \n    ... AS poder_compra\nFROM contas;",
            solution: "SELECT \n    id, \n    saldo, \n    COALESCE(limite_credito, 0) AS limite_ajustado, \n    saldo + COALESCE(limite_credito, 0) AS poder_compra\nFROM contas;",
            validator: (res) => sameResult(res, "SELECT id, saldo, COALESCE(limite_credito, 0), saldo + COALESCE(limite_credito, 0) FROM contas", { columns: ['limite_ajustado', 'poder_compra'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Lista de Revisão do Compliance",
            concept: "UNION vs UNION ALL",
            icon: '<i class="ph-fill ph-selection-all"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas consultas e remove linhas repetidas; <code>UNION ALL</code> empilha tudo, inclusive repetições (e é mais rápido). As consultas precisam ter o mesmo número de colunas, e o nome final vem da primeira.",
            task: "Monte uma lista SEM repetições de contas para revisão: os <code>conta_id</code> de <code>transacoes</code> do <code>tipo</code> 'Saque' unidos aos <code>id</code> das <code>contas</code> com <code>status</code> 'Bloqueada'. A coluna deve se chamar <code>conta_id</code>.",
            startCode: "SELECT conta_id\nFROM transacoes\nWHERE tipo = 'Saque'\n...\nSELECT id\nFROM contas\nWHERE status = 'Bloqueada';",
            solution: "SELECT conta_id\nFROM transacoes\nWHERE tipo = 'Saque'\nUNION\nSELECT id\nFROM contas\nWHERE status = 'Bloqueada';",
            validator: (res) => sameResult(res, "SELECT conta_id FROM transacoes WHERE tipo = 'Saque' UNION SELECT id FROM contas WHERE status = 'Bloqueada'", { columns: ['conta_id'] })
        },
        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Tabela de Cartões",
            concept: "CREATE TABLE",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define colunas e regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> proíbe vazio e <code>CHECK (condição)</code> barra valores inválidos. <code>IF NOT EXISTS</code> evita erro ao rodar de novo (mas não altera uma tabela já existente). No SQL Server, use <code>INT IDENTITY PRIMARY KEY</code> para auto-numeração e <code>IF OBJECT_ID('cartoes') IS NULL</code> no lugar do <code>IF NOT EXISTS</code>.",
            task: "Crie (com <code>IF NOT EXISTS</code>) a tabela <code>cartoes</code> com: <code>id</code> INTEGER PRIMARY KEY, <code>conta_id</code> INTEGER NOT NULL, <code>bandeira</code> TEXT NOT NULL e <code>limite</code> INTEGER com <code>CHECK (limite &gt;= 0)</code>.",
            startCode: "CREATE TABLE IF NOT EXISTS cartoes (\n    id ...,\n    conta_id ...,\n    bandeira ...,\n    limite ...\n);",
            solution: "CREATE TABLE IF NOT EXISTS cartoes (\n    id INTEGER PRIMARY KEY,\n    conta_id INTEGER NOT NULL,\n    bandeira TEXT NOT NULL,\n    limite INTEGER CHECK (limite >= 0)\n);",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('cartoes')");
                    if (!info.length) return false;
                    const cols = {};
                    info[0].values.forEach(v => { cols[String(v[1]).toLowerCase()] = { notnull: v[3], pk: v[5] }; });
                    if (!cols.id || !cols.id.pk) return false;
                    if (!cols.conta_id || !cols.conta_id.notnull) return false;
                    if (!cols.bandeira || !cols.bandeira.notnull) return false;
                    if (!cols.limite) return false;
                    const sql = db.exec("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'cartoes'")[0].values[0][0];
                    return /check\s*\(/i.test(sql);
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Status do Cartão",
            concept: "ALTER TABLE",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "<code>ALTER TABLE tabela ADD COLUMN coluna TIPO</code> inclui uma coluna nova sem perder os dados existentes; <code>DEFAULT</code> define o valor das linhas que não informarem nada. No SQLite não existe <code>IF NOT EXISTS</code> para colunas, então rodar duas vezes dá erro de coluna duplicada. No SQL Server a sintaxe é <code>ALTER TABLE cartoes ADD status VARCHAR(20) DEFAULT 'Ativo'</code> (sem a palavra COLUMN).",
            task: "Adicione à tabela <code>cartoes</code> a coluna <code>status</code> do tipo TEXT com valor padrão 'Ativo'.",
            startCode: "ALTER TABLE cartoes\nADD COLUMN ...;",
            solution: "ALTER TABLE cartoes\nADD COLUMN status TEXT DEFAULT 'Ativo';",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('cartoes')");
                    if (!info.length) return false;
                    const col = info[0].values.find(v => String(v[1]).toLowerCase() === 'status');
                    return !!col && String(col[4]).replace(/['"]/g, '') === 'Ativo';
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "View de Saldo por Cliente",
            concept: "CREATE VIEW",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "Uma <code>VIEW</code> é uma consulta salva com nome, usada como se fosse tabela: <code>SELECT * FROM vw_...</code>. Ela não guarda dados, roda a consulta toda vez, e esconde JOINs complexos de quem só precisa do relatório. Use <code>DROP VIEW IF EXISTS</code> antes para poder recriar; no SQL Server existe <code>CREATE OR ALTER VIEW</code>.",
            task: "Crie a view <code>vw_saldo_clientes</code> com o <code>nome</code> do cliente e <code>SUM(o.saldo)</code> como <code>saldo_total</code> (JOIN de <code>clientes</code> com <code>contas</code>, agrupado por cliente). Depois selecione tudo da view ordenado por <code>saldo_total</code> decrescente.",
            startCode: "DROP VIEW IF EXISTS vw_saldo_clientes;\n\nCREATE VIEW vw_saldo_clientes AS\nSELECT \n    c.nome, \n    ... AS saldo_total\nFROM clientes c\nJOIN contas o ON \nGROUP BY ;\n\nSELECT * FROM vw_saldo_clientes\nORDER BY ;",
            solution: "DROP VIEW IF EXISTS vw_saldo_clientes;\n\nCREATE VIEW vw_saldo_clientes AS\nSELECT \n    c.nome, \n    SUM(o.saldo) AS saldo_total\nFROM clientes c\nJOIN contas o ON o.cliente_id = c.id\nGROUP BY c.id, c.nome;\n\nSELECT * FROM vw_saldo_clientes\nORDER BY saldo_total DESC;",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT COUNT(*) FROM sqlite_master WHERE type = 'view' AND name = 'vw_saldo_clientes'");
                    if (v[0].values[0][0] !== 1) return false;
                    return sameResult(res, "SELECT c.nome, SUM(o.saldo) FROM clientes c JOIN contas o ON o.cliente_id = c.id GROUP BY c.id, c.nome ORDER BY 2 DESC", { ordered: true, columns: ['saldo_total'] });
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Concentração de Volume",
            concept: "CTE + JOIN + Window",
            icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "Desafio de diretoria: combine uma CTE para totalizar, <code>RANK() OVER (ORDER BY ...)</code> para a posição e <code>SUM(...) OVER ()</code> (janela vazia = total geral) para o percentual de cada linha. Cuidado com a divisão inteira: multiplique por <code>100.0</code> para obter decimais.",
            task: "A diretoria quer saber quão concentrado está o volume movimentado. Para cada cliente com transações, mostre <code>nome</code>, <code>total_movimentado</code> (soma do <code>valor</code> das transações de todas as suas contas), <code>posicao</code> (<code>RANK()</code> pelo total, maior = 1) e <code>percentual</code> do total geral (<code>ROUND(100.0 * total / total geral, 2)</code>). Ordene por <code>posicao</code>.",
            startCode: "WITH mov AS (\n    SELECT \n        c.nome, \n        ... AS total_movimentado\n    FROM transacoes t\n    JOIN contas o ON \n    JOIN clientes c ON \n    GROUP BY \n)\nSELECT \n    nome, \n    total_movimentado, \n    ... AS posicao, \n    ... AS percentual\nFROM mov\nORDER BY ;",
            solution: "WITH mov AS (\n    SELECT \n        c.nome, \n        SUM(t.valor) AS total_movimentado\n    FROM transacoes t\n    JOIN contas o ON t.conta_id = o.id\n    JOIN clientes c ON o.cliente_id = c.id\n    GROUP BY c.id, c.nome\n)\nSELECT \n    nome, \n    total_movimentado, \n    RANK() OVER (ORDER BY total_movimentado DESC) AS posicao, \n    ROUND(100.0 * total_movimentado / SUM(total_movimentado) OVER (), 2) AS percentual\nFROM mov\nORDER BY posicao;",
            validator: (res) => sameResult(res, "WITH m AS (SELECT c.nome AS n, SUM(t.valor) AS tot FROM transacoes t JOIN contas o ON t.conta_id = o.id JOIN clientes c ON o.cliente_id = c.id GROUP BY c.id, c.nome) SELECT n, tot, RANK() OVER (ORDER BY tot DESC) AS p, ROUND(100.0 * tot / SUM(tot) OVER (), 2) FROM m ORDER BY p", { ordered: true, columns: ['nome', 'total_movimentado', 'posicao', 'percentual'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Top 2 Transações por Tipo",
            concept: "Ranking por grupo",
            icon: '<i class="ph-fill ph-ranking"></i>',
            theory: "Para 'os N maiores de cada grupo', numere as linhas com <code>ROW_NUMBER() OVER (PARTITION BY grupo ORDER BY valor DESC)</code> numa CTE e filtre <code>WHERE posicao &lt;= N</code> fora dela. Não dá para filtrar uma window function direto no <code>WHERE</code> da mesma consulta, por isso a CTE (ou subquery) é necessária, inclusive no SQL Server.",
            task: "A prevenção a fraudes quer as 2 maiores transações de cada <code>tipo</code>. Mostre <code>tipo</code>, <code>posicao</code> (1 ou 2, por <code>valor</code> decrescente dentro do tipo), <code>nome</code> do cliente e <code>valor</code>. Ordene por <code>tipo</code> e <code>posicao</code>.",
            startCode: "WITH ranking AS (\n    SELECT \n        t.tipo, \n        c.nome, \n        t.valor, \n        ROW_NUMBER() OVER (...) AS posicao\n    FROM transacoes t\n    JOIN contas o ON t.conta_id = o.id\n    JOIN clientes c ON o.cliente_id = c.id\n)\nSELECT \n    tipo, \n    posicao, \n    nome, \n    valor\nFROM ranking\nWHERE \nORDER BY ;",
            solution: "WITH ranking AS (\n    SELECT \n        t.tipo, \n        c.nome, \n        t.valor, \n        ROW_NUMBER() OVER (PARTITION BY t.tipo ORDER BY t.valor DESC) AS posicao\n    FROM transacoes t\n    JOIN contas o ON t.conta_id = o.id\n    JOIN clientes c ON o.cliente_id = c.id\n)\nSELECT \n    tipo, \n    posicao, \n    nome, \n    valor\nFROM ranking\nWHERE posicao <= 2\nORDER BY tipo, posicao;",
            validator: (res) => sameResult(res, "SELECT tipo, p, nome, valor FROM (SELECT t.tipo, c.nome, t.valor, ROW_NUMBER() OVER (PARTITION BY t.tipo ORDER BY t.valor DESC) AS p FROM transacoes t JOIN contas o ON t.conta_id = o.id JOIN clientes c ON o.cliente_id = c.id) WHERE p <= 2 ORDER BY tipo, p", { ordered: true, columns: ['tipo', 'posicao', 'nome', 'valor'] })
        },
        {
            id: 127, moduleId: 15,
            title: "Fluxo de Caixa dos Clientes",
            concept: "CASE + GROUP BY + HAVING",
            icon: '<i class="ph-fill ph-receipt"></i>',
            theory: "Relatórios gerenciais juntam tudo: <code>SUM(CASE ...)</code> separa entradas e saídas, a diferença dá o fluxo líquido, um <code>CASE</code> sobre esse resultado classifica o cliente e o <code>HAVING</code> descarta grupos pouco representativos. Repita a expressão agregada no <code>CASE</code> ou calcule numa CTE antes.",
            task: "O gerente de relacionamento quer o fluxo de caixa por cliente. Mostre <code>nome</code>, <code>entradas</code> ('Deposito' e 'PIX Recebido'), <code>saidas</code> ('Saque'), <code>fluxo_liquido</code> (entradas - saídas) e <code>classificacao</code>: 'Superavitário' se o fluxo for maior que 0, senão 'Deficitário'. Considere apenas clientes com pelo menos 3 transações e ordene por <code>fluxo_liquido</code> decrescente.",
            startCode: "SELECT \n    c.nome, \n    ... AS entradas, \n    ... AS saidas, \n    ... AS fluxo_liquido, \n    CASE \n        WHEN ... THEN 'Superavitário' \n        ELSE 'Deficitário' \n    END AS classificacao\nFROM transacoes t\nJOIN contas o ON t.conta_id = o.id\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY \nHAVING \nORDER BY ;",
            solution: "SELECT \n    c.nome, \n    SUM(CASE WHEN t.tipo IN ('Deposito', 'PIX Recebido') THEN t.valor ELSE 0 END) AS entradas, \n    SUM(CASE WHEN t.tipo = 'Saque' THEN t.valor ELSE 0 END) AS saidas, \n    SUM(CASE WHEN t.tipo = 'Saque' THEN -t.valor ELSE t.valor END) AS fluxo_liquido, \n    CASE \n        WHEN SUM(CASE WHEN t.tipo = 'Saque' THEN -t.valor ELSE t.valor END) > 0 THEN 'Superavitário' \n        ELSE 'Deficitário' \n    END AS classificacao\nFROM transacoes t\nJOIN contas o ON t.conta_id = o.id\nJOIN clientes c ON o.cliente_id = c.id\nGROUP BY c.id, c.nome\nHAVING COUNT(*) >= 3\nORDER BY fluxo_liquido DESC;",
            validator: (res) => sameResult(res, "WITH f AS (SELECT c.nome AS n, SUM(CASE WHEN t.tipo IN ('Deposito', 'PIX Recebido') THEN t.valor ELSE 0 END) AS e, SUM(CASE WHEN t.tipo = 'Saque' THEN t.valor ELSE 0 END) AS s FROM transacoes t JOIN contas o ON t.conta_id = o.id JOIN clientes c ON o.cliente_id = c.id GROUP BY c.id, c.nome HAVING COUNT(*) >= 3) SELECT n, e, s, e - s, CASE WHEN e - s > 0 THEN 'Superavitário' ELSE 'Deficitário' END FROM f ORDER BY e - s DESC", { ordered: true, columns: ['nome', 'entradas', 'saidas', 'fluxo_liquido', 'classificacao'] })
        }
    ]
};

extraLessons.farma = {
    setup: `
            INSERT INTO fornecedores VALUES (4, 'Eurofarma', NULL, 'Rio de Janeiro'), (5, 'Cimed', '555', 'Pouso Alegre'), (6, 'Aché', NULL, 'Guarulhos');
            INSERT INTO produtos VALUES (5, 'Cetirizina', 4, 'Antialérgico', 18, 80), (6, 'Azitromicina', 5, 'Antibiótico', 32, 60), (7, 'Nimesulida', 5, 'Analgésico', 14, 0), (8, 'Cefalexina', 2, 'Antibiótico', 28, 0), (9, 'Desloratadina', 4, 'Antialérgico', NULL, 40), (10, 'Diclofenaco', 1, 'Analgésico', 12, 220);
            INSERT INTO vendas VALUES (4, 1, 30, '2023-11-05'), (5, 2, 8, '2023-11-06'), (6, 5, 15, '2023-11-08'), (7, 1, 40, '2023-11-10'), (8, 6, 12, '2023-11-12'), (9, 7, 20, '2023-11-15'), (10, 10, 35, '2023-12-01'), (11, 2, 5, '2023-12-03'), (12, 3, 18, '2023-12-05'), (13, 1, 25, '2023-12-08');
    `,
    lessons: [
        // ---------- Módulo 1 ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Valor Parado no Estoque", concept: "Coluna calculada", icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Você pode fazer contas direto no <code>SELECT</code>: <code>preco * estoque</code> gera uma coluna nova, que não existe na tabela. Use <code>AS</code> para dar um nome claro a ela. É assim que o financeiro descobre quanto dinheiro está parado nas prateleiras do CD.",
            task: "Selecione <code>nome</code>, <code>preco</code>, <code>estoque</code> e o cálculo <code>preco * estoque</code> com o apelido <code>valor_estoque</code>, da tabela <code>produtos</code>.",
            startCode: "SELECT nome, preco, estoque,\n    ... AS valor_estoque\nFROM produtos;",
            solution: "SELECT\n    nome,\n    preco,\n    estoque,\n    preco * estoque AS valor_estoque\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT nome, preco, estoque, preco * estoque FROM produtos", { columns: ['valor_estoque'] })
        },
        // ---------- Módulo 2 ----------
        {
            id: 101, moduleId: 2, after: 4,
            title: "Princípios Terminados em -ina", concept: "LIKE", icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "O <code>LIKE</code> busca padrões de texto: <code>%</code> representa qualquer sequência de caracteres e <code>_</code> exatamente um. <code>'%ina'</code> acha nomes que terminam em 'ina'. No SQLite o <code>LIKE</code> ignora maiúsculas/minúsculas (letras sem acento); no SQL Server isso depende do collation do banco.",
            task: "Liste <code>nome</code> e <code>categoria</code> dos <code>produtos</code> cujo nome <b>termina</b> com 'ina'.",
            startCode: "SELECT nome, categoria\nFROM produtos\nWHERE nome LIKE ;",
            solution: "SELECT\n    nome,\n    categoria\nFROM produtos\nWHERE nome LIKE '%ina';",
            validator: (res) => sameResult(res, "SELECT nome, categoria FROM produtos WHERE nome LIKE '%ina'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Promoção de Dois Laboratórios", concept: "IN / BETWEEN", icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>IN (1, 5)</code> substitui vários <code>OR</code> (<code>fornecedor_id = 1 OR fornecedor_id = 5</code>). <code>BETWEEN 12 AND 30</code> filtra uma faixa e <b>inclui</b> as duas pontas. Os dois funcionam igual no SQL Server.",
            task: "Liste <code>nome</code>, <code>fornecedor_id</code> e <code>preco</code> dos produtos dos fornecedores 1 e 5 (use <code>IN</code>) com preço entre 12 e 30 (use <code>BETWEEN</code>).",
            startCode: "SELECT nome, fornecedor_id, preco\nFROM produtos\nWHERE fornecedor_id IN ()\n  AND preco BETWEEN ;",
            solution: "SELECT\n    nome,\n    fornecedor_id,\n    preco\nFROM produtos\nWHERE fornecedor_id IN (1, 5)\n  AND preco BETWEEN 12 AND 30;",
            validator: (res) => sameResult(res, "SELECT nome, fornecedor_id, preco FROM produtos WHERE fornecedor_id IN (1, 5) AND preco BETWEEN 12 AND 30")
        },
        // ---------- Módulo 3 ----------
        {
            id: 103, moduleId: 3, after: 9,
            title: "Faixa de Preços do Catálogo", concept: "AVG / MIN / MAX", icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>MIN()</code> e <code>MAX()</code> trazem o menor e o maior valor; <code>AVG()</code> calcula a média. Todas ignoram valores <code>NULL</code> (produtos ainda sem preço). <code>ROUND(valor, 2)</code> arredonda para 2 casas, ótimo para relatórios.",
            task: "Em uma única linha, mostre o menor preço como <code>menor_preco</code>, o maior como <code>maior_preco</code> e a média arredondada para 2 casas como <code>preco_medio</code>, da tabela <code>produtos</code>.",
            startCode: "SELECT\n    ... AS menor_preco,\n    ... AS maior_preco,\n    ... AS preco_medio\nFROM produtos;",
            solution: "SELECT\n    MIN(preco) AS menor_preco,\n    MAX(preco) AS maior_preco,\n    ROUND(AVG(preco), 2) AS preco_medio\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT MIN(preco), MAX(preco), ROUND(AVG(preco), 2) FROM produtos", { columns: ['menor_preco', 'maior_preco', 'preco_medio'] })
        },
        // ---------- Módulo 4 ----------
        {
            id: 104, moduleId: 4, after: 11,
            title: "Caixas Vendidas por Laboratório", concept: "JOIN + GROUP BY", icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "Depois de juntar as tabelas com <code>JOIN</code>, você pode agrupar o resultado por uma coluna de outra tabela. Assim, as vendas (que só conhecem o <code>produto_id</code>) viram um total por laboratório.",
            task: "Junte <code>vendas</code>, <code>produtos</code> e <code>fornecedores</code> e mostre o nome do fornecedor como <code>laboratorio</code> e a soma de <code>quantidade</code> como <code>caixas_vendidas</code>, agrupando por laboratório. Ordene por <code>caixas_vendidas</code> do maior para o menor.",
            startCode: "SELECT fornecedores.nome AS laboratorio,\n    ... AS caixas_vendidas\nFROM vendas\nJOIN produtos ON vendas.produto_id = produtos.id\nJOIN fornecedores ON produtos.fornecedor_id = fornecedores.id\nGROUP BY \nORDER BY ;",
            solution: "SELECT\n    fornecedores.nome AS laboratorio,\n    SUM(vendas.quantidade) AS caixas_vendidas\nFROM vendas\nJOIN produtos ON vendas.produto_id = produtos.id\nJOIN fornecedores ON produtos.fornecedor_id = fornecedores.id\nGROUP BY fornecedores.nome\nORDER BY caixas_vendidas DESC;",
            validator: (res) => sameResult(res, "SELECT f.nome, SUM(v.quantidade) AS t FROM vendas v JOIN produtos p ON v.produto_id = p.id JOIN fornecedores f ON p.fornecedor_id = f.id GROUP BY f.nome ORDER BY t DESC", { ordered: true, columns: ['laboratorio', 'caixas_vendidas'] })
        },
        // ---------- Módulo 5 ----------
        {
            id: 105, moduleId: 5, after: 13,
            title: "Reajuste dos Antibióticos", concept: "UPDATE com cálculo", icon: '<i class="ph-fill ph-percent"></i>',
            theory: "O <code>UPDATE</code> pode usar o valor atual da coluna no cálculo: <code>SET preco = preco * 1.10</code> aplica 10% de aumento em todas as linhas filtradas pelo <code>WHERE</code>. Sem o <code>WHERE</code>, o reajuste atingiria o catálogo inteiro! Cuidado: rodar de novo aplica o aumento outra vez.",
            task: "A CMED autorizou reajuste de 10% nos antibióticos. Atualize o <code>preco</code> de todos os produtos da categoria 'Antibiótico' para <code>ROUND(preco * 1.10, 2)</code>. Depois, rode <code>SELECT * FROM produtos WHERE categoria = 'Antibiótico';</code> para conferir.",
            startCode: "UPDATE produtos\nSET preco = \nWHERE ;\n\nSELECT * FROM produtos WHERE categoria = 'Antibiótico';",
            solution: "UPDATE produtos\nSET preco = ROUND(preco * 1.10, 2)\nWHERE categoria = 'Antibiótico';\n\nSELECT * FROM produtos WHERE categoria = 'Antibiótico';",
            validator: (res) => {
                try {
                    const orig = { 2: 35, 6: 32, 8: 28 };
                    const r = db.exec("SELECT id, preco FROM produtos WHERE id IN (1, 2, 6, 8)");
                    if (!r.length) return false;
                    const m = {};
                    r[0].values.forEach(v => { m[v[0]] = v[1]; });
                    if (m[1] !== 10) return false;
                    return Object.keys(orig).every(id => typeof m[id] === 'number' && m[id] >= orig[id] * 1.1 - 0.01)
                        && res && res.length > 0;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 6 ----------
        {
            id: 106, moduleId: 6, after: 15,
            title: "Campeões de Saída", concept: "CTE (WITH)", icon: '<i class="ph-fill ph-stack"></i>',
            theory: "A <code>CTE</code> (<code>WITH nome AS (...)</code>) cria uma tabela temporária com nome, válida só para a query. Ela deixa consultas longas legíveis: primeiro você calcula os totais, depois usa o resultado como se fosse uma tabela. A sintaxe é a mesma no SQL Server.",
            task: "Crie uma CTE chamada <code>vendas_produto</code> com <code>produto_id</code> e a soma de <code>quantidade</code> como <code>total_vendido</code>. Em seguida, junte com <code>produtos</code> e mostre <code>nome</code> e <code>total_vendido</code> apenas dos produtos que venderam <b>mais de 30</b> caixas.",
            startCode: "WITH vendas_produto AS (\n    SELECT produto_id, ... AS total_vendido\n    FROM vendas\n    GROUP BY \n)\nSELECT p.nome, vp.total_vendido\nFROM vendas_produto vp\nJOIN produtos p ON \nWHERE ;",
            solution: "WITH vendas_produto AS (\n    SELECT\n        produto_id,\n        SUM(quantidade) AS total_vendido\n    FROM vendas\n    GROUP BY produto_id\n)\nSELECT\n    p.nome,\n    vp.total_vendido\nFROM vendas_produto vp\nJOIN produtos p ON p.id = vp.produto_id\nWHERE vp.total_vendido > 30;",
            validator: (res) => sameResult(res, "SELECT p.nome, SUM(v.quantidade) FROM vendas v JOIN produtos p ON p.id = v.produto_id GROUP BY p.id, p.nome HAVING SUM(v.quantidade) > 30", { columns: ['total_vendido'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Vendidos em Dezembro", concept: "EXISTS", icon: '<i class="ph-fill ph-magnifying-glass-plus"></i>',
            theory: "<code>EXISTS (subquery)</code> é verdadeiro quando a subquery devolve pelo menos uma linha. A subquery pode olhar a linha de fora (<code>v.produto_id = p.id</code>): é uma subquery correlacionada. Ao contrário do <code>JOIN</code>, o <code>EXISTS</code> nunca duplica o produto, mesmo com várias vendas. <code>NOT EXISTS</code> faz o inverso.",
            task: "Liste o <code>nome</code> dos <code>produtos</code> que tiveram <b>pelo menos uma venda</b> em dezembro de 2023 (<code>data_venda</code> entre '2023-12-01' e '2023-12-31'), usando <code>EXISTS</code>.",
            startCode: "SELECT p.nome\nFROM produtos p\nWHERE EXISTS (\n    SELECT 1\n    FROM vendas v\n    WHERE ...\n);",
            solution: "SELECT p.nome\nFROM produtos p\nWHERE EXISTS (\n    SELECT 1\n    FROM vendas v\n    WHERE v.produto_id = p.id\n      AND v.data_venda BETWEEN '2023-12-01' AND '2023-12-31'\n);",
            validator: (res) => sameResult(res, "SELECT nome FROM produtos WHERE id IN (SELECT produto_id FROM vendas WHERE data_venda BETWEEN '2023-12-01' AND '2023-12-31')")
        },
        // ---------- Módulo 7 ----------
        {
            id: 108, moduleId: 7, after: 16,
            title: "Ranking de Preço por Categoria", concept: "ROW_NUMBER + PARTITION", icon: '<i class="ph-fill ph-list-numbers"></i>',
            theory: "<code>ROW_NUMBER()</code> numera as linhas 1, 2, 3... sem empates. Com <code>PARTITION BY categoria</code>, a contagem recomeça em cada categoria, como se fosse um ranking separado para cada prateleira. Inclua um critério de desempate no <code>ORDER BY</code> para o resultado ser previsível.",
            task: "Mostre <code>categoria</code>, <code>nome</code>, <code>preco</code> e uma coluna <code>posicao</code> com <code>ROW_NUMBER()</code> numerando os produtos dentro de cada categoria do <b>mais caro para o mais barato</b> (desempate pelo <code>nome</code> em ordem alfabética).",
            startCode: "SELECT categoria, nome, preco,\n    ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS posicao\nFROM produtos;",
            solution: "SELECT\n    categoria,\n    nome,\n    preco,\n    ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC, nome) AS posicao\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT categoria, nome, preco, ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC, nome) FROM produtos", { columns: ['posicao'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Vendas Acumuladas no Período", concept: "SUM() OVER acumulado", icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>SUM(coluna) OVER (ORDER BY data)</code> calcula um total acumulado: cada linha soma tudo o que veio antes dela, sem agrupar as linhas como o <code>GROUP BY</code>. É o famoso 'running total' usado para acompanhar metas ao longo do mês. Funciona igual no SQL Server.",
            task: "Liste <code>data_venda</code>, <code>quantidade</code> e o total acumulado de caixas como <code>acumulado</code>, usando <code>SUM(quantidade) OVER (ORDER BY data_venda)</code>. Ordene o resultado por <code>data_venda</code>.",
            startCode: "SELECT data_venda, quantidade,\n    SUM(quantidade) OVER (...) AS acumulado\nFROM vendas\nORDER BY ;",
            solution: "SELECT\n    data_venda,\n    quantidade,\n    SUM(quantidade) OVER (ORDER BY data_venda) AS acumulado\nFROM vendas\nORDER BY data_venda;",
            validator: (res) => sameResult(res, "SELECT data_venda, quantidade, SUM(quantidade) OVER (ORDER BY data_venda) FROM vendas ORDER BY data_venda", { ordered: true, columns: ['acumulado'] })
        },
        // ---------- Módulo 8 ----------
        {
            id: 110, moduleId: 8, after: 17,
            title: "Novembro x Dezembro", concept: "SUM(CASE WHEN)", icon: '<i class="ph-fill ph-columns"></i>',
            theory: "Colocar um <code>CASE</code> dentro do <code>SUM()</code> permite somar só o que atende a uma condição: <code>SUM(CASE WHEN condição THEN quantidade ELSE 0 END)</code>. Com isso você transforma linhas em colunas (um 'pivot' simples), comparando períodos lado a lado.",
            task: "Para cada <code>produto_id</code> da tabela <code>vendas</code>, mostre as caixas vendidas em novembro/2023 como <code>novembro</code> (data antes de '2023-12-01') e em dezembro/2023 como <code>dezembro</code> (a partir de '2023-12-01'). Agrupe por <code>produto_id</code>.",
            startCode: "SELECT produto_id,\n    SUM(CASE WHEN ... THEN quantidade ELSE 0 END) AS novembro,\n    SUM(CASE WHEN ... THEN quantidade ELSE 0 END) AS dezembro\nFROM vendas\nGROUP BY ;",
            solution: "SELECT\n    produto_id,\n    SUM(CASE WHEN data_venda < '2023-12-01' THEN quantidade ELSE 0 END) AS novembro,\n    SUM(CASE WHEN data_venda >= '2023-12-01' THEN quantidade ELSE 0 END) AS dezembro\nFROM vendas\nGROUP BY produto_id;",
            validator: (res) => sameResult(res, "SELECT produto_id, SUM(CASE WHEN data_venda < '2023-12-01' THEN quantidade ELSE 0 END), SUM(CASE WHEN data_venda >= '2023-12-01' THEN quantidade ELSE 0 END) FROM vendas GROUP BY produto_id", { columns: ['novembro', 'dezembro'] })
        },
        // ---------- Módulo 10 ----------
        {
            id: 111, moduleId: 10, after: 22,
            title: "O Índice Está Sendo Usado?", concept: "EXPLAIN QUERY PLAN", icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o banco pretende executá-lo. Na coluna <code>detail</code>, <code>SCAN</code> indica leitura da tabela inteira e <code>SEARCH ... USING INDEX</code> indica uso de índice. No SQL Server, o equivalente é o 'Plano de Execução Estimado' (Ctrl+L) ou <code>SET SHOWPLAN_TEXT ON</code>.",
            task: "Veja o plano de execução de <code>SELECT * FROM produtos WHERE categoria = 'Antibiótico'</code> usando <code>EXPLAIN QUERY PLAN</code>. Confira na coluna <code>detail</code> se o índice <code>idx_cat</code> aparece.",
            startCode: "EXPLAIN QUERY PLAN\nSELECT * \nFROM produtos\nWHERE ;",
            solution: "EXPLAIN QUERY PLAN\nSELECT *\nFROM produtos\nWHERE categoria = 'Antibiótico';",
            validator: (res) => {
                if (!res || !res.length) return false;
                const last = res[res.length - 1];
                const i = last.columns.indexOf('detail');
                return i >= 0 && last.values.some(v => String(v[i]).includes('produtos'));
            }
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Removendo Índice Temporário", concept: "DROP INDEX", icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices aceleram leituras, mas deixam <code>INSERT</code>/<code>UPDATE</code> mais lentos e ocupam espaço. Índices que não ajudam devem ser removidos com <code>DROP INDEX IF EXISTS nome</code> (o <code>IF EXISTS</code> evita erro se ele já não existir). No SQL Server é preciso informar a tabela: <code>DROP INDEX IF EXISTS nome ON tabela</code>. A tabela <code>sqlite_master</code> lista os objetos do banco.",
            task: "Crie o índice <code>idx_preco_tmp</code> em <code>produtos(preco)</code> com <code>IF NOT EXISTS</code>, depois remova-o com <code>DROP INDEX IF EXISTS</code>. Por fim, liste os índices restantes: <code>SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'produtos';</code> (o <code>idx_cat</code> deve continuar lá).",
            startCode: "CREATE INDEX IF NOT EXISTS idx_preco_tmp ON produtos();\n\nDROP INDEX IF EXISTS ;\n\nSELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'produtos';",
            solution: "CREATE INDEX IF NOT EXISTS idx_preco_tmp ON produtos(preco);\n\nDROP INDEX IF EXISTS idx_preco_tmp;\n\nSELECT name\nFROM sqlite_master\nWHERE type = 'index'\n  AND tbl_name = 'produtos';",
            validator: (res) => {
                try {
                    const r = db.exec("SELECT name FROM sqlite_master WHERE type = 'index' AND name IN ('idx_preco_tmp', 'idx_cat')");
                    const names = r.length ? r[0].values.map(v => v[0]) : [];
                    return !names.includes('idx_preco_tmp') && names.includes('idx_cat')
                        && sameResult(res, "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'produtos'");
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Categorias com Estoque Alto", concept: "HAVING", icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "O <code>WHERE</code> filtra linhas <b>antes</b> de agrupar; o <code>HAVING</code> filtra os grupos <b>depois</b> do <code>GROUP BY</code>, por isso aceita funções de agregação como <code>SUM(estoque) &gt; 400</code>. Use-o sempre que o filtro depender de um total.",
            task: "Mostre a <code>categoria</code> e a soma do <code>estoque</code> como <code>estoque_total</code>, apenas das categorias cujo estoque total seja <b>maior que 400</b> unidades.",
            startCode: "SELECT categoria, ... AS estoque_total\nFROM produtos\nGROUP BY categoria\nHAVING ;",
            solution: "SELECT\n    categoria,\n    SUM(estoque) AS estoque_total\nFROM produtos\nGROUP BY categoria\nHAVING SUM(estoque) > 400;",
            validator: (res) => sameResult(res, "SELECT categoria, SUM(estoque) FROM produtos GROUP BY categoria HAVING SUM(estoque) > 400", { columns: ['estoque_total'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Variedade do Mix Vendido", concept: "COUNT(DISTINCT)", icon: '<i class="ph-fill ph-hash"></i>',
            theory: "<code>COUNT(*)</code> conta linhas; <code>COUNT(DISTINCT coluna)</code> conta apenas valores diferentes. Nas vendas, o mesmo remédio aparece várias vezes, então <code>COUNT(DISTINCT produto_id)</code> responde 'quantos produtos diferentes giraram'.",
            task: "Em uma única linha, mostre o número total de vendas como <code>total_vendas</code> e a quantidade de produtos diferentes vendidos como <code>produtos_vendidos</code>, da tabela <code>vendas</code>.",
            startCode: "SELECT\n    ... AS total_vendas,\n    ... AS produtos_vendidos\nFROM vendas;",
            solution: "SELECT\n    COUNT(*) AS total_vendas,\n    COUNT(DISTINCT produto_id) AS produtos_vendidos\nFROM vendas;",
            validator: (res) => sameResult(res, "SELECT COUNT(*), COUNT(DISTINCT produto_id) FROM vendas", { columns: ['total_vendas', 'produtos_vendidos'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Preço Médio por Laboratório e Categoria", concept: "GROUP BY múltiplo", icon: '<i class="ph-fill ph-table"></i>',
            theory: "O <code>GROUP BY</code> aceita várias colunas: cada combinação diferente (laboratório + categoria) vira um grupo. Junto com <code>ROUND(AVG(preco), 2)</code>, você monta uma matriz de preços médios. Lembre: produtos com preço <code>NULL</code> são ignorados pela média.",
            task: "Mostre <code>fornecedor_id</code>, <code>categoria</code>, a quantidade de produtos como <code>qtd_produtos</code> e o preço médio arredondado para 2 casas como <code>preco_medio</code>, agrupando por <code>fornecedor_id</code> e <code>categoria</code>. Ordene por <code>fornecedor_id</code> e depois <code>categoria</code>.",
            startCode: "SELECT fornecedor_id, categoria,\n    ... AS qtd_produtos,\n    ... AS preco_medio\nFROM produtos\nGROUP BY \nORDER BY ;",
            solution: "SELECT\n    fornecedor_id,\n    categoria,\n    COUNT(*) AS qtd_produtos,\n    ROUND(AVG(preco), 2) AS preco_medio\nFROM produtos\nGROUP BY fornecedor_id, categoria\nORDER BY fornecedor_id, categoria;",
            validator: (res) => sameResult(res, "SELECT fornecedor_id, categoria, COUNT(*), ROUND(AVG(preco), 2) FROM produtos GROUP BY fornecedor_id, categoria ORDER BY fornecedor_id, categoria", { ordered: true, columns: ['qtd_produtos', 'preco_medio'] })
        },
        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Todos os Laboratórios e Seus Produtos", concept: "LEFT JOIN", icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>JOIN</code> (INNER) só mostra linhas com correspondência nas duas tabelas. O <code>LEFT JOIN</code> mantém <b>todas</b> as linhas da tabela da esquerda; quando não há par na direita, as colunas dela vêm <code>NULL</code>. É assim que um laboratório recém-cadastrado, ainda sem produtos, aparece no relatório.",
            task: "Liste <b>todos</b> os fornecedores com seus produtos: nome do fornecedor como <code>fornecedor</code> e nome do produto como <code>produto</code>, usando <code>fornecedores LEFT JOIN produtos</code>.",
            startCode: "SELECT f.nome AS fornecedor, p.nome AS produto\nFROM fornecedores f\nLEFT JOIN produtos p ON ;",
            solution: "SELECT\n    f.nome AS fornecedor,\n    p.nome AS produto\nFROM fornecedores f\nLEFT JOIN produtos p ON p.fornecedor_id = f.id;",
            validator: (res) => sameResult(res, "SELECT f.nome, p.nome FROM fornecedores f LEFT JOIN produtos p ON p.fornecedor_id = f.id", { columns: ['fornecedor', 'produto'] })
        },
        {
            id: 117, moduleId: 12,
            title: "Produtos Encalhados", concept: "Anti-join", icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "Para achar registros <b>sem</b> correspondência, faça um <code>LEFT JOIN</code> e filtre <code>WHERE tabela_direita.id IS NULL</code>: sobram só as linhas que não encontraram par. É o 'anti-join', muito usado para achar produtos que nunca venderam, clientes sem pedido etc. (<code>NOT EXISTS</code> dá o mesmo resultado).",
            task: "Liste o <code>id</code> e o <code>nome</code> dos <code>produtos</code> que <b>nunca tiveram venda</b>, usando <code>LEFT JOIN vendas</code> e <code>IS NULL</code>.",
            startCode: "SELECT p.id, p.nome\nFROM produtos p\nLEFT JOIN vendas v ON \nWHERE ;",
            solution: "SELECT\n    p.id,\n    p.nome\nFROM produtos p\nLEFT JOIN vendas v ON v.produto_id = p.id\nWHERE v.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT id, nome FROM produtos WHERE id NOT IN (SELECT produto_id FROM vendas WHERE produto_id IS NOT NULL)")
        },
        {
            id: 118, moduleId: 12,
            title: "Alternativa Mais Barata", concept: "Self-join", icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "Um self-join junta a tabela com ela mesma, usando dois apelidos (<code>a</code> e <code>b</code>) como se fossem tabelas diferentes. Assim dá para comparar linhas entre si, por exemplo: para cada remédio, quais outros da mesma categoria custam menos (sugestão de substituição no balcão).",
            task: "Usando <code>produtos a JOIN produtos b</code>, liste para cada produto as alternativas da <b>mesma categoria</b> com <b>preço menor</b>: <code>a.nome</code> como <code>produto</code>, <code>a.preco</code> como <code>preco_produto</code>, <code>b.nome</code> como <code>alternativa</code> e <code>b.preco</code> como <code>preco_alternativa</code>.",
            startCode: "SELECT a.nome AS produto, a.preco AS preco_produto,\n    b.nome AS alternativa, b.preco AS preco_alternativa\nFROM produtos a\nJOIN produtos b ON \n AND ;",
            solution: "SELECT\n    a.nome AS produto,\n    a.preco AS preco_produto,\n    b.nome AS alternativa,\n    b.preco AS preco_alternativa\nFROM produtos a\nJOIN produtos b\n    ON a.categoria = b.categoria\n   AND b.preco < a.preco;",
            validator: (res) => sameResult(res, "SELECT a.nome, a.preco, b.nome, b.preco FROM produtos a JOIN produtos b ON a.categoria = b.categoria AND b.preco < a.preco", { columns: ['produto', 'preco_produto', 'alternativa', 'preco_alternativa'] })
        },
        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Fornecedores sem CNPJ", concept: "IS NULL", icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>NULL</code> significa 'valor desconhecido' e não é igual a nada, nem a outro <code>NULL</code>: por isso <code>cnpj = NULL</code> nunca retorna linhas. Para testar, use <code>IS NULL</code> ou <code>IS NOT NULL</code>. A regra vale também no SQL Server.",
            task: "A auditoria quer saber quais laboratórios estão sem CNPJ cadastrado. Liste <code>nome</code> e <code>cidade</code> dos <code>fornecedores</code> cujo <code>cnpj</code> é nulo.",
            startCode: "SELECT nome, cidade\nFROM fornecedores\nWHERE cnpj ;",
            solution: "SELECT\n    nome,\n    cidade\nFROM fornecedores\nWHERE cnpj IS NULL;",
            validator: (res) => sameResult(res, "SELECT nome, cidade FROM fornecedores WHERE cnpj IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Preço a Definir", concept: "COALESCE", icon: '<i class="ph-fill ph-puzzle-piece"></i>',
            theory: "<code>COALESCE(a, b, ...)</code> devolve o primeiro valor que não é <code>NULL</code>. Serve para trocar vazios por um padrão na hora de exibir ou calcular. No SQLite também existe <code>IFNULL(a, b)</code>; no SQL Server, o equivalente é <code>ISNULL(a, b)</code> (e o <code>COALESCE</code> também funciona).",
            task: "Liste o <code>nome</code> dos produtos e o preço como <code>preco_tabela</code>, trocando preços nulos por <code>0</code> com <code>COALESCE</code>.",
            startCode: "SELECT nome,\n    COALESCE(...) AS preco_tabela\nFROM produtos;",
            solution: "SELECT\n    nome,\n    COALESCE(preco, 0) AS preco_tabela\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT nome, COALESCE(preco, 0) FROM produtos", { columns: ['preco_tabela'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Pauta da Reunião de Compras", concept: "UNION / UNION ALL", icon: '<i class="ph-fill ph-git-merge"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas queries (com o mesmo número de colunas) e <b>remove duplicatas</b>. <code>UNION ALL</code> empilha tudo, mantendo repetições, e é mais rápido. Use <code>UNION</code> quando quiser uma lista única.",
            task: "Monte uma lista <b>sem repetições</b> com o <code>nome</code> dos produtos que têm <code>estoque</code> menor que 150 <b>OU</b> que tiveram venda a partir de '2023-12-01' (junte <code>vendas</code> com <code>produtos</code>). Use <code>UNION</code>.",
            startCode: "SELECT nome FROM produtos WHERE ...\n\nUNION\n\nSELECT p.nome\nFROM vendas v\nJOIN produtos p ON \nWHERE ;",
            solution: "SELECT nome\nFROM produtos\nWHERE estoque < 150\n\nUNION\n\nSELECT p.nome\nFROM vendas v\nJOIN produtos p ON p.id = v.produto_id\nWHERE v.data_venda >= '2023-12-01';",
            validator: (res) => sameResult(res, "SELECT nome FROM produtos WHERE estoque < 150 OR id IN (SELECT produto_id FROM vendas WHERE data_venda >= '2023-12-01') GROUP BY nome")
        },
        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Controle de Lotes", concept: "CREATE TABLE", icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define colunas e regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> obriga o preenchimento e <code>CHECK (condição)</code> barra valores inválidos. <code>IF NOT EXISTS</code> evita erro se a tabela já existir (no SQL Server: <code>IF OBJECT_ID('lotes') IS NULL CREATE TABLE ...</code>). Se criar errado, rode <code>DROP TABLE lotes;</code> e tente de novo.",
            task: "Crie a tabela <code>lotes</code> com: <code>id</code> INTEGER <code>PRIMARY KEY</code>; <code>produto_id</code> INTEGER <code>NOT NULL</code>; <code>codigo_lote</code> TEXT <code>NOT NULL</code>; <code>validade</code> TEXT <code>NOT NULL</code>; <code>quantidade</code> INTEGER com <code>CHECK (quantidade &gt; 0)</code>.",
            startCode: "CREATE TABLE IF NOT EXISTS lotes (\n    id INTEGER ...,\n    produto_id INTEGER ...,\n    codigo_lote TEXT ...,\n    validade TEXT ...,\n    quantidade INTEGER CHECK (...)\n);",
            solution: "CREATE TABLE IF NOT EXISTS lotes (\n    id INTEGER PRIMARY KEY,\n    produto_id INTEGER NOT NULL,\n    codigo_lote TEXT NOT NULL,\n    validade TEXT NOT NULL,\n    quantidade INTEGER CHECK (quantidade > 0)\n);",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('lotes')");
                    if (!info.length) return false;
                    const cols = {};
                    info[0].values.forEach(v => { cols[String(v[1]).toLowerCase()] = { notnull: v[3], pk: v[5] }; });
                    if (!cols.id || !cols.id.pk) return false;
                    if (!['produto_id', 'codigo_lote', 'validade'].every(c => cols[c] && cols[c].notnull)) return false;
                    if (!cols.quantidade) return false;
                    let blocked = false;
                    db.exec("SAVEPOINT chk_lotes");
                    try { db.exec("INSERT INTO lotes (produto_id, codigo_lote, validade, quantidade) VALUES (1, 'TESTE', '2030-01-01', 0)"); }
                    catch (e) { blocked = true; }
                    db.exec("ROLLBACK TO chk_lotes; RELEASE chk_lotes");
                    return blocked;
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Temperatura de Armazenagem", concept: "ALTER TABLE ADD", icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "<code>ALTER TABLE tabela ADD COLUMN coluna TIPO</code> acrescenta uma coluna a uma tabela existente; as linhas antigas recebem <code>NULL</code>. No SQLite não existe <code>IF NOT EXISTS</code> para colunas: rodar de novo dá erro de coluna duplicada (sinal de que já foi feito). No SQL Server a sintaxe é <code>ALTER TABLE lotes ADD temperatura_max INT</code>, sem a palavra <code>COLUMN</code>.",
            task: "A vigilância sanitária exige registrar a temperatura máxima de armazenagem. Adicione à tabela <code>lotes</code> a coluna <code>temperatura_max</code> do tipo INTEGER.",
            startCode: "ALTER TABLE lotes\nADD COLUMN ;",
            solution: "ALTER TABLE lotes\nADD COLUMN temperatura_max INTEGER;",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('lotes')");
                    return info.length > 0 && info[0].values.some(v => String(v[1]).toLowerCase() === 'temperatura_max');
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "Painel de Estoque por Laboratório", concept: "CREATE VIEW", icon: '<i class="ph-fill ph-eye"></i>',
            theory: "Uma <code>VIEW</code> é uma query salva com nome, que você consulta como se fosse uma tabela: <code>SELECT * FROM vw_...</code>. Ela não guarda dados, roda a query na hora, então está sempre atualizada. No SQLite use <code>CREATE VIEW IF NOT EXISTS</code>; no SQL Server, <code>CREATE OR ALTER VIEW</code>. Se criar errado, rode <code>DROP VIEW vw_estoque_laboratorio;</code>.",
            task: "Crie a view <code>vw_estoque_laboratorio</code> com o nome do fornecedor como <code>laboratorio</code>, a quantidade de produtos como <code>qtd_produtos</code> e a soma do estoque como <code>estoque_total</code> (use <code>JOIN</code> entre <code>fornecedores</code> e <code>produtos</code>, agrupando por laboratório). Depois rode <code>SELECT * FROM vw_estoque_laboratorio;</code>.",
            startCode: "CREATE VIEW IF NOT EXISTS vw_estoque_laboratorio AS\nSELECT f.nome AS laboratorio,\n    ... AS qtd_produtos,\n    ... AS estoque_total\nFROM fornecedores f\nJOIN produtos p ON \nGROUP BY ;\n\nSELECT * FROM vw_estoque_laboratorio;",
            solution: "CREATE VIEW IF NOT EXISTS vw_estoque_laboratorio AS\nSELECT\n    f.nome AS laboratorio,\n    COUNT(*) AS qtd_produtos,\n    SUM(p.estoque) AS estoque_total\nFROM fornecedores f\nJOIN produtos p ON p.fornecedor_id = f.id\nGROUP BY f.nome;\n\nSELECT * FROM vw_estoque_laboratorio;",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'vw_estoque_laboratorio'");
                    if (!v.length) return false;
                    return sameResult(res, "SELECT f.nome, COUNT(*), SUM(p.estoque) FROM fornecedores f JOIN produtos p ON p.fornecedor_id = f.id GROUP BY f.nome", { columns: ['laboratorio', 'qtd_produtos', 'estoque_total'] });
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Market Share dos Laboratórios", concept: "CTE + JOIN + Window", icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "Para calcular a participação de cada parte no todo, some por grupo numa CTE e depois divida pelo total geral com <code>SUM(caixas) OVER ()</code> (janela vazia = todas as linhas). Use <code>100.0</code> para forçar divisão decimal: no SQLite (e no SQL Server) inteiro dividido por inteiro descarta as casas.",
            task: "A diretoria comercial quer o market share interno: para cada laboratório com vendas, mostre <code>laboratorio</code> (nome do fornecedor), <code>caixas</code> (soma da quantidade vendida) e <code>participacao_pct</code> (percentual sobre o total de caixas, com <code>ROUND(..., 1)</code>). Ordene do maior para o menor número de caixas.",
            startCode: "WITH por_lab AS (\n    SELECT ... AS laboratorio, ... AS caixas\n    FROM vendas v\n    JOIN ...\n    GROUP BY ...\n)\nSELECT laboratorio, caixas,\n    ... AS participacao_pct\nFROM por_lab\nORDER BY ;",
            solution: "WITH por_lab AS (\n    SELECT\n        f.nome AS laboratorio,\n        SUM(v.quantidade) AS caixas\n    FROM vendas v\n    JOIN produtos p ON p.id = v.produto_id\n    JOIN fornecedores f ON f.id = p.fornecedor_id\n    GROUP BY f.nome\n)\nSELECT\n    laboratorio,\n    caixas,\n    ROUND(100.0 * caixas / SUM(caixas) OVER (), 1) AS participacao_pct\nFROM por_lab\nORDER BY caixas DESC;",
            validator: (res) => sameResult(res, "SELECT f.nome, SUM(v.quantidade) AS c, ROUND(100.0 * SUM(v.quantidade) / (SELECT SUM(quantidade) FROM vendas v2 JOIN produtos p2 ON p2.id = v2.produto_id JOIN fornecedores f2 ON f2.id = p2.fornecedor_id), 1) FROM vendas v JOIN produtos p ON p.id = v.produto_id JOIN fornecedores f ON f.id = p.fornecedor_id GROUP BY f.nome ORDER BY c DESC", { ordered: true, columns: ['laboratorio', 'caixas', 'participacao_pct'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Campeão de Vendas por Categoria", concept: "Ranking por grupo", icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "O padrão 'top 1 por grupo' combina agregação e window function: some as vendas por produto, ranqueie com <code>RANK() OVER (PARTITION BY categoria ORDER BY total DESC)</code> numa CTE e filtre <code>WHERE posicao = 1</code> na query de fora. Window functions não podem ir direto no <code>WHERE</code>, por isso a CTE (ou subquery) é necessária.",
            task: "O gerente de categoria quer saber o produto mais vendido (em caixas) de cada categoria. Mostre <code>categoria</code>, <code>nome</code> e <code>caixas</code> (soma da quantidade vendida) apenas do 1º colocado de cada categoria, ordenado por <code>categoria</code>.",
            startCode: "WITH ranking AS (\n    SELECT p.categoria, p.nome, ... AS caixas,\n        RANK() OVER (PARTITION BY ... ORDER BY ...) AS posicao\n    FROM produtos p\n    JOIN vendas v ON \n    GROUP BY \n)\nSELECT categoria, nome, caixas\nFROM ranking\nWHERE ;",
            solution: "WITH ranking AS (\n    SELECT\n        p.categoria,\n        p.nome,\n        SUM(v.quantidade) AS caixas,\n        RANK() OVER (PARTITION BY p.categoria ORDER BY SUM(v.quantidade) DESC) AS posicao\n    FROM produtos p\n    JOIN vendas v ON v.produto_id = p.id\n    GROUP BY p.id, p.categoria, p.nome\n)\nSELECT\n    categoria,\n    nome,\n    caixas\nFROM ranking\nWHERE posicao = 1\nORDER BY categoria;",
            validator: (res) => sameResult(res, "WITH t AS (SELECT p.categoria AS c, p.nome AS n, SUM(v.quantidade) AS q FROM produtos p JOIN vendas v ON v.produto_id = p.id GROUP BY p.id) SELECT c, n, q FROM t WHERE q = (SELECT MAX(q) FROM t t2 WHERE t2.c = t.c) ORDER BY c, n", { ordered: true, columns: ['caixas'] })
        },
        {
            id: 127, moduleId: 15,
            title: "Estoque por Faixa de Preço", concept: "CASE + GROUP BY + HAVING", icon: '<i class="ph-fill ph-scales"></i>',
            theory: "Para relatórios por faixa, crie a faixa com <code>CASE</code> e agrupe por ela. O <code>HAVING</code> descarta faixas pouco representativas. No SQLite você pode agrupar pelo apelido (<code>GROUP BY faixa</code>); no SQL Server é preciso repetir a expressão <code>CASE</code> no <code>GROUP BY</code> ou usar uma CTE.",
            task: "O controller quer ver o estoque por faixa de preço. Classifique cada produto em <code>faixa</code>: 'Sem preço' se <code>preco</code> for nulo, 'Econômico' se &lt; 15, 'Intermediário' se &lt; 30 e 'Premium' nos demais. Mostre <code>faixa</code>, <code>qtd_produtos</code> e <code>estoque_total</code>, apenas das faixas com <b>pelo menos 2 produtos</b>, ordenado por <code>estoque_total</code> decrescente.",
            startCode: "SELECT\n    CASE\n        WHEN ... THEN 'Sem preço'\n        WHEN ... THEN 'Econômico'\n        WHEN ... THEN 'Intermediário'\n        ELSE 'Premium'\n    END AS faixa,\n    ... AS qtd_produtos,\n    ... AS estoque_total\nFROM produtos\nGROUP BY \nHAVING \nORDER BY ;",
            solution: "SELECT\n    CASE\n        WHEN preco IS NULL THEN 'Sem preço'\n        WHEN preco < 15 THEN 'Econômico'\n        WHEN preco < 30 THEN 'Intermediário'\n        ELSE 'Premium'\n    END AS faixa,\n    COUNT(*) AS qtd_produtos,\n    SUM(estoque) AS estoque_total\nFROM produtos\nGROUP BY faixa\nHAVING COUNT(*) >= 2\nORDER BY estoque_total DESC;",
            validator: (res) => sameResult(res, "SELECT CASE WHEN preco IS NULL THEN 'Sem preço' WHEN preco < 15 THEN 'Econômico' WHEN preco < 30 THEN 'Intermediário' ELSE 'Premium' END AS f, COUNT(*), SUM(estoque) AS e FROM produtos GROUP BY f HAVING COUNT(*) >= 2 ORDER BY e DESC", { ordered: true, columns: ['faixa', 'qtd_produtos', 'estoque_total'] })
        }
    ]
};

extraLessons.saude = {
    setup: `
        INSERT INTO beneficiarios VALUES (5, 'Eduardo Rocha', 'Premium', 600, 'Ativo'), (6, 'Gabriela Nunes', 'Executivo', 900, 'Ativo'), (7, 'Heitor Alves', 'Básico', 250, 'Ativo');
        INSERT INTO hospitais VALUES (4, 'Clínica Bem Estar', 'Contagem', NULL), (5, 'Hospital Santa Rita', 'Betim', 'Alta Complexidade');
        INSERT INTO consultas VALUES (5, 2, 3, '2024-01-08', 0), (6, 5, 1, '2024-01-12', NULL), (7, 1, 4, '2024-01-20', 30), (8, 4, 1, '2024-02-03', 0), (9, 2, 4, '2024-02-10', NULL), (10, 6, 3, '2024-02-15', 0), (11, 7, 2, '2024-02-22', 30), (12, 1, 2, '2024-03-01', 30), (13, 2, 1, '2024-03-05', 0);
    `,
    lessons: [
        // ---------- Módulos 1–10: exercícios extras ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Custo Anual do Plano",
            concept: "Coluna calculada",
            icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Dá para fazer contas direto no <code>SELECT</code>: <code>mensalidade * 12</code> gera uma coluna nova que não existe na tabela. Use <code>AS</code> para dar um nome claro a essa coluna calculada. É o jeito mais rápido de responder perguntas como \"quanto cada cliente paga por ano?\".",
            task: "Selecione <code>nome</code>, <code>mensalidade</code> e a mensalidade multiplicada por 12 com o apelido <code>custo_anual</code>, da tabela <code>beneficiarios</code>.",
            startCode: "SELECT \n    nome,\n    mensalidade,\n     AS \nFROM beneficiarios;",
            solution: "SELECT \n    nome,\n    mensalidade,\n    mensalidade * 12 AS custo_anual\nFROM beneficiarios;",
            validator: (res) => sameResult(res, "SELECT nome, mensalidade, mensalidade * 12 AS custo_anual FROM beneficiarios", { columns: ['custo_anual'] })
        },
        {
            id: 101, moduleId: 2, after: 4,
            title: "Hospitais pelo Nome",
            concept: "LIKE",
            icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "O <code>LIKE</code> filtra textos por padrão. O <code>%</code> representa \"qualquer sequência de caracteres\" e o <code>_</code> representa exatamente um caractere. <code>'Hospital%'</code> pega tudo que <b>começa</b> com Hospital; <code>'%Vida%'</code> pega tudo que <b>contém</b> Vida.",
            task: "Liste <code>nome</code> e <code>cidade</code> dos <code>hospitais</code> cujo nome começa com 'Hospital'.",
            startCode: "SELECT nome, cidade\nFROM hospitais\nWHERE nome LIKE ;",
            solution: "SELECT nome, cidade\nFROM hospitais\nWHERE nome LIKE 'Hospital%';",
            validator: (res) => sameResult(res, "SELECT nome, cidade FROM hospitais WHERE nome LIKE 'Hospital%'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Consultas do 1º Bimestre",
            concept: "IN / BETWEEN",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>IN (a, b, c)</code> substitui vários <code>OR</code> sobre a mesma coluna. <code>BETWEEN x AND y</code> filtra uma faixa <b>incluindo</b> as pontas, e funciona com números e datas no formato 'AAAA-MM-DD'. Ótimo para relatórios de período e de uma lista de unidades.",
            task: "Selecione todas as colunas (*) das <code>consultas</code> com <code>data</code> entre '2024-01-01' e '2024-02-29' (BETWEEN) e <code>hospital_id</code> em (1, 4) usando IN.",
            startCode: "SELECT * \nFROM consultas\nWHERE data BETWEEN  AND \nAND hospital_id IN ();",
            solution: "SELECT * \nFROM consultas\nWHERE data BETWEEN '2024-01-01' AND '2024-02-29'\n    AND hospital_id IN (1, 4);",
            validator: (res) => sameResult(res, "SELECT * FROM consultas WHERE data BETWEEN '2024-01-01' AND '2024-02-29' AND hospital_id IN (1, 4)")
        },
        {
            id: 103, moduleId: 3, after: 9,
            title: "Faixa de Mensalidades",
            concept: "AVG / MIN / MAX",
            icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "Além de <code>COUNT</code> e <code>SUM</code>, existem <code>AVG()</code> (média), <code>MIN()</code> (menor valor) e <code>MAX()</code> (maior valor). Juntas, elas dão um retrato rápido da carteira: ticket médio, plano mais barato e mais caro.",
            task: "Considerando apenas beneficiários com <code>status</code> 'Ativo', mostre a média da mensalidade como <code>media</code>, a menor como <code>menor</code> e a maior como <code>maior</code>.",
            startCode: "SELECT \n    AVG() AS media,\n     AS menor,\n     AS maior\nFROM beneficiarios\nWHERE ;",
            solution: "SELECT \n    AVG(mensalidade) AS media,\n    MIN(mensalidade) AS menor,\n    MAX(mensalidade) AS maior\nFROM beneficiarios\nWHERE status = 'Ativo';",
            validator: (res) => sameResult(res, "SELECT AVG(mensalidade), MIN(mensalidade), MAX(mensalidade) FROM beneficiarios WHERE status = 'Ativo'", { columns: ['media', 'menor', 'maior'] })
        },
        {
            id: 104, moduleId: 4, after: 11,
            title: "Consultas por Hospital",
            concept: "JOIN + GROUP BY",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "Combinar <code>JOIN</code> com <code>GROUP BY</code> permite agrupar por um nome legível que está em outra tabela. Primeiro você liga as tabelas, depois agrupa e conta. É assim que se monta o volume de atendimentos por unidade da rede credenciada.",
            task: "Ligue <code>consultas</code> a <code>hospitais</code> e mostre <code>hospitais.nome</code> e a quantidade de consultas de cada hospital com o apelido <code>total_consultas</code>.",
            startCode: "SELECT hospitais.nome, \nFROM consultas\nJOIN hospitais ON \nGROUP BY ;",
            solution: "SELECT \n    hospitais.nome,\n    COUNT(*) AS total_consultas\nFROM consultas\nJOIN hospitais ON consultas.hospital_id = hospitais.id\nGROUP BY hospitais.nome;",
            validator: (res) => sameResult(res, "SELECT h.nome, COUNT(*) FROM consultas c JOIN hospitais h ON c.hospital_id = h.id GROUP BY h.id", { columns: ['total_consultas'] })
        },
        {
            id: 105, moduleId: 5, after: 13,
            title: "Reajuste do Plano Premium",
            concept: "UPDATE em massa",
            icon: '<i class="ph-fill ph-percent"></i>',
            theory: "Um <code>UPDATE</code> pode usar o valor atual da coluna no cálculo: <code>SET mensalidade = mensalidade * 1.10</code> aplica 10% em todas as linhas filtradas pelo <code>WHERE</code>. Use <code>ROUND()</code> para evitar casas decimais estranhas. Sem <code>WHERE</code>, o reajuste atingiria a carteira inteira, então confira o filtro antes!",
            task: "Aplique um reajuste de 10% na <code>mensalidade</code> de todos os beneficiários do <code>plano</code> 'Premium' (use <code>ROUND(mensalidade * 1.10)</code>). Depois, liste os beneficiários Premium.",
            startCode: "UPDATE beneficiarios\nSET mensalidade = \nWHERE plano = ;\n\nSELECT * FROM beneficiarios WHERE plano = 'Premium';",
            solution: "UPDATE beneficiarios\nSET mensalidade = ROUND(mensalidade * 1.10)\nWHERE plano = 'Premium';\n\nSELECT * FROM beneficiarios WHERE plano = 'Premium';",
            validator: (res) => {
                if (!res || !res.length) return false;
                try {
                    const q = s => db.exec(s)[0].values[0][0];
                    return q("SELECT COUNT(*) FROM beneficiarios WHERE plano = 'Premium'") > 0
                        && q("SELECT COUNT(*) FROM beneficiarios WHERE plano = 'Premium' AND mensalidade <= 600") === 0
                        && q("SELECT COUNT(*) FROM beneficiarios WHERE plano = 'Executivo' AND mensalidade > 900") === 0
                        && q("SELECT COUNT(*) FROM beneficiarios WHERE plano = 'Básico' AND mensalidade > 280") === 0;
                } catch (e) { return false; }
            }
        },
        {
            id: 106, moduleId: 6, after: 15,
            title: "Coparticipação por Paciente",
            concept: "CTE (WITH)",
            icon: '<i class="ph-fill ph-stack"></i>',
            theory: "Uma CTE (<code>WITH nome AS (...)</code>) é uma consulta temporária com nome, usada logo em seguida como se fosse uma tabela. Ela deixa consultas longas legíveis, em etapas. A sintaxe é a mesma no SQL Server.",
            task: "Crie uma CTE chamada <code>gasto</code> com <code>beneficiario_id</code> e a soma da coparticipação como <code>total_copart</code> (agrupando <code>consultas</code>). Depois ligue a CTE a <code>beneficiarios</code> e mostre <code>nome</code> e <code>total_copart</code> apenas de quem tem <code>total_copart</code> maior que 0.",
            startCode: "WITH gasto AS (\n    SELECT beneficiario_id, \n    FROM consultas\n    GROUP BY \n)\nSELECT beneficiarios.nome, gasto.total_copart\nFROM gasto\nJOIN beneficiarios ON \nWHERE ;",
            solution: "WITH gasto AS (\n    SELECT beneficiario_id, SUM(coparticipacao) AS total_copart\n    FROM consultas\n    GROUP BY beneficiario_id\n)\nSELECT beneficiarios.nome, gasto.total_copart\nFROM gasto\nJOIN beneficiarios ON gasto.beneficiario_id = beneficiarios.id\nWHERE gasto.total_copart > 0;",
            validator: (res) => sameResult(res, "SELECT b.nome, SUM(c.coparticipacao) FROM consultas c JOIN beneficiarios b ON c.beneficiario_id = b.id GROUP BY b.id HAVING SUM(c.coparticipacao) > 0", { columns: ['total_copart'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Pacientes de Alta Complexidade",
            concept: "EXISTS",
            icon: '<i class="ph-fill ph-magnifying-glass-plus"></i>',
            theory: "<code>EXISTS (subquery)</code> é verdadeiro quando a subquery devolve pelo menos uma linha. A subquery costuma ser <b>correlacionada</b>: ela usa a linha da consulta de fora (ex.: <code>c.beneficiario_id = b.id</code>). Diferente do JOIN, o EXISTS não duplica o beneficiário que tem várias consultas. <code>NOT EXISTS</code> faz o contrário.",
            task: "Liste o <code>nome</code> dos beneficiários para os quais EXISTE ao menos uma consulta em hospital com <code>nivel_atendimento</code> 'Alta Complexidade'. Cada beneficiário deve aparecer uma única vez.",
            startCode: "SELECT b.nome\nFROM beneficiarios b\nWHERE EXISTS (\n    SELECT 1\n    FROM consultas c\n    JOIN hospitais h ON \n    WHERE c.beneficiario_id = \n      AND \n);",
            solution: "SELECT b.nome\nFROM beneficiarios b\nWHERE EXISTS (\n    SELECT 1\n    FROM consultas c\n    JOIN hospitais h ON c.hospital_id = h.id\n    WHERE c.beneficiario_id = b.id\n      AND h.nivel_atendimento = 'Alta Complexidade'\n);",
            validator: (res) => sameResult(res, "SELECT nome FROM beneficiarios WHERE id IN (SELECT c.beneficiario_id FROM consultas c JOIN hospitais h ON c.hospital_id = h.id WHERE h.nivel_atendimento = 'Alta Complexidade')")
        },
        {
            id: 108, moduleId: 7, after: 16,
            title: "Ranking de Mensalidade por Plano",
            concept: "ROW_NUMBER + PARTITION",
            icon: '<i class="ph-fill ph-ranking"></i>',
            theory: "<code>ROW_NUMBER() OVER (PARTITION BY coluna ORDER BY ...)</code> reinicia a numeração a cada grupo. Assim dá para montar um ranking dentro de cada plano sem perder as linhas detalhadas. Use um segundo critério no <code>ORDER BY</code> para desempatar.",
            task: "Mostre <code>nome</code>, <code>plano</code>, <code>mensalidade</code> e a posição do beneficiário dentro do seu plano como <code>posicao</code> (maior mensalidade primeiro; empate desempatado por <code>nome</code> em ordem alfabética). Ordene o resultado por <code>plano</code> e <code>posicao</code>.",
            startCode: "SELECT \n    nome,\n    plano,\n    mensalidade,\n    ROW_NUMBER() OVER (PARTITION BY  ORDER BY ) AS posicao\nFROM beneficiarios\nORDER BY ;",
            solution: "SELECT \n    nome,\n    plano,\n    mensalidade,\n    ROW_NUMBER() OVER (PARTITION BY plano ORDER BY mensalidade DESC, nome) AS posicao\nFROM beneficiarios\nORDER BY plano, posicao;",
            validator: (res) => sameResult(res, "SELECT nome, plano, mensalidade, ROW_NUMBER() OVER (PARTITION BY plano ORDER BY mensalidade DESC, nome) AS posicao FROM beneficiarios ORDER BY plano, posicao", { ordered: true, columns: ['posicao'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Coparticipação Acumulada",
            concept: "SUM() OVER",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>SUM(coluna) OVER (ORDER BY data)</code> calcula um <b>total acumulado</b>: cada linha mostra a soma de tudo até ela. É o famoso \"running total\", usado para acompanhar a arrecadação ao longo do tempo. Valores NULL são ignorados na soma.",
            task: "Liste <code>id</code>, <code>data</code>, <code>coparticipacao</code> e o total acumulado da coparticipação ordenado por <code>data</code> como <code>acumulado</code>. Ordene o resultado por <code>data</code>.",
            startCode: "SELECT \n    id,\n    data,\n    coparticipacao,\n    SUM() OVER (ORDER BY ) AS acumulado\nFROM consultas\nORDER BY ;",
            solution: "SELECT \n    id,\n    data,\n    coparticipacao,\n    SUM(coparticipacao) OVER (ORDER BY data) AS acumulado\nFROM consultas\nORDER BY data;",
            validator: (res) => sameResult(res, "SELECT id, data, coparticipacao, SUM(coparticipacao) OVER (ORDER BY data) AS acumulado FROM consultas ORDER BY data", { ordered: true, columns: ['acumulado'] })
        },
        {
            id: 110, moduleId: 8, after: 17,
            title: "Receita Ativa x Cancelados",
            concept: "SUM(CASE WHEN)",
            icon: '<i class="ph-fill ph-coins"></i>',
            theory: "Colocar um <code>CASE</code> dentro do <code>SUM</code> cria uma <b>agregação condicional</b>: só soma o que passa na condição (o resto vira 0). Assim um único <code>GROUP BY</code> gera várias métricas lado a lado, como num relatório gerencial.",
            task: "Por <code>plano</code>, mostre a soma das mensalidades apenas de quem tem <code>status</code> 'Ativo' como <code>receita_ativa</code> e quantos beneficiários estão 'Cancelado' como <code>cancelados</code>.",
            startCode: "SELECT \n    plano,\n    SUM(CASE WHEN  THEN  ELSE 0 END) AS receita_ativa,\n    SUM(CASE WHEN  THEN  ELSE 0 END) AS cancelados\nFROM beneficiarios\nGROUP BY ;",
            solution: "SELECT \n    plano,\n    SUM(CASE WHEN status = 'Ativo' THEN mensalidade ELSE 0 END) AS receita_ativa,\n    SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS cancelados\nFROM beneficiarios\nGROUP BY plano;",
            validator: (res) => sameResult(res, "SELECT plano, SUM(CASE WHEN status = 'Ativo' THEN mensalidade ELSE 0 END), SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) FROM beneficiarios GROUP BY plano", { columns: ['receita_ativa', 'cancelados'] })
        },
        {
            id: 111, moduleId: 10, after: 22,
            title: "O Índice Está Sendo Usado?",
            concept: "EXPLAIN QUERY PLAN",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o banco vai executar a consulta, sem rodá-la. A coluna <code>detail</code> diz se houve <code>SCAN</code> (varredura da tabela inteira) ou <code>SEARCH ... USING INDEX</code>. No SQL Server o equivalente é o plano de execução (Ctrl+L no SSMS ou <code>SET SHOWPLAN_ALL ON</code>).",
            task: "Veja o plano de execução da consulta <code>SELECT * FROM consultas WHERE hospital_id = 1 AND data &gt;= '2024-01-01'</code> usando <code>EXPLAIN QUERY PLAN</code>.",
            startCode: "\nSELECT * \nFROM consultas\nWHERE hospital_id = 1 AND data >= '2024-01-01';",
            solution: "EXPLAIN QUERY PLAN\nSELECT * \nFROM consultas\nWHERE hospital_id = 1 AND data >= '2024-01-01';",
            validator: (res) => !!(res && res.length && res[res.length - 1].columns.includes('detail') && res[res.length - 1].values.length > 0)
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Limpando Índices Temporários",
            concept: "DROP INDEX",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices aceleram leituras, mas custam espaço e deixam <code>INSERT</code>/<code>UPDATE</code> mais lentos. Índice que não ajuda deve ser removido com <code>DROP INDEX IF EXISTS nome</code> (o <code>IF EXISTS</code> evita erro se ele já não existir). No SQL Server a sintaxe é <code>DROP INDEX IF EXISTS nome ON tabela</code>. A lista de índices fica em <code>sqlite_master</code>.",
            task: "Crie o índice <code>idx_benef_status</code> na coluna <code>status</code> de <code>beneficiarios</code> (use <code>IF NOT EXISTS</code>), remova-o com <code>DROP INDEX IF EXISTS</code> e, por fim, liste o <code>name</code> dos índices em <code>sqlite_master</code> (<code>type = 'index'</code>). O índice <code>idx_hosp_data</code> deve continuar existindo.",
            startCode: "CREATE INDEX IF NOT EXISTS idx_benef_status ON beneficiarios();\n\nDROP INDEX ;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            solution: "CREATE INDEX IF NOT EXISTS idx_benef_status ON beneficiarios(status);\n\nDROP INDEX IF EXISTS idx_benef_status;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            validator: (res) => {
                if (!res || !res.length || !res[res.length - 1].columns.includes('name')) return false;
                try {
                    const idx = db.exec("SELECT name FROM sqlite_master WHERE type = 'index'");
                    const names = idx.length ? idx[0].values.map(v => v[0]) : [];
                    return !names.includes('idx_benef_status') && names.includes('idx_hosp_data');
                } catch (e) { return false; }
            }
        },

        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Hospitais de Alto Movimento",
            concept: "HAVING",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>WHERE</code> filtra linhas <b>antes</b> do agrupamento; <code>HAVING</code> filtra os <b>grupos</b> depois, e por isso aceita funções de agregação como <code>COUNT(*)</code>. Use quando a regra for sobre o total do grupo, como \"unidades com 3 ou mais atendimentos\".",
            task: "Mostre <code>hospital_id</code> e a quantidade de consultas como <code>total_consultas</code>, apenas dos hospitais com 3 ou mais consultas.",
            startCode: "SELECT hospital_id, \nFROM consultas\nGROUP BY \nHAVING ;",
            solution: "SELECT \n    hospital_id,\n    COUNT(*) AS total_consultas\nFROM consultas\nGROUP BY hospital_id\nHAVING COUNT(*) >= 3;",
            validator: (res) => sameResult(res, "SELECT hospital_id, COUNT(*) FROM consultas GROUP BY hospital_id HAVING COUNT(*) >= 3", { columns: ['total_consultas'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Pacientes Únicos por Hospital",
            concept: "COUNT(DISTINCT)",
            icon: '<i class="ph-fill ph-users"></i>',
            theory: "<code>COUNT(*)</code> conta linhas; <code>COUNT(DISTINCT coluna)</code> conta apenas valores diferentes. Se o mesmo paciente voltou três vezes ao hospital, ele conta 3 consultas, mas 1 paciente único. Essa diferença é essencial em indicadores de uso da rede.",
            task: "Para cada <code>hospital_id</code>, mostre o total de consultas como <code>total_consultas</code> e o número de beneficiários diferentes atendidos como <code>pacientes_unicos</code>.",
            startCode: "SELECT \n    hospital_id,\n    COUNT(*) AS total_consultas,\n     AS pacientes_unicos\nFROM consultas\nGROUP BY ;",
            solution: "SELECT \n    hospital_id,\n    COUNT(*) AS total_consultas,\n    COUNT(DISTINCT beneficiario_id) AS pacientes_unicos\nFROM consultas\nGROUP BY hospital_id;",
            validator: (res) => sameResult(res, "SELECT hospital_id, COUNT(*), COUNT(DISTINCT beneficiario_id) FROM consultas GROUP BY hospital_id", { columns: ['total_consultas', 'pacientes_unicos'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Carteira por Plano e Status",
            concept: "GROUP BY + ROUND(AVG)",
            icon: '<i class="ph-fill ph-table"></i>',
            theory: "O <code>GROUP BY</code> aceita várias colunas: cada combinação diferente (ex.: Premium + Ativo) vira um grupo. <code>ROUND(AVG(x), 2)</code> arredonda a média para 2 casas, deixando o relatório apresentável. No SQL Server, cuidado: <code>AVG</code> de coluna inteira devolve inteiro.",
            task: "Agrupe <code>beneficiarios</code> por <code>plano</code> e <code>status</code> e mostre <code>plano</code>, <code>status</code>, a quantidade como <code>qtd</code> e a média da mensalidade arredondada para 2 casas como <code>media_mensalidade</code>.",
            startCode: "SELECT \n    plano,\n    status,\n     AS qtd,\n     AS media_mensalidade\nFROM beneficiarios\nGROUP BY ;",
            solution: "SELECT \n    plano,\n    status,\n    COUNT(*) AS qtd,\n    ROUND(AVG(mensalidade), 2) AS media_mensalidade\nFROM beneficiarios\nGROUP BY plano, status;",
            validator: (res) => sameResult(res, "SELECT plano, status, COUNT(*), ROUND(AVG(mensalidade), 2) FROM beneficiarios GROUP BY plano, status", { columns: ['qtd', 'media_mensalidade'] })
        },

        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Toda a Rede Credenciada",
            concept: "LEFT JOIN",
            icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>INNER JOIN</code> descarta quem não tem correspondência. O <code>LEFT JOIN</code> mantém <b>todas</b> as linhas da tabela da esquerda e preenche com NULL quando não há par. Para contar, use <code>COUNT(coluna_da_direita)</code>, que ignora NULL; <code>COUNT(*)</code> contaria 1 para hospital sem consulta.",
            task: "Liste TODOS os hospitais (mesmo sem consultas) com <code>hospitais.nome</code> e a quantidade de consultas como <code>total_consultas</code>, partindo de <code>hospitais</code> com <code>LEFT JOIN</code> em <code>consultas</code>.",
            startCode: "SELECT hospitais.nome, \nFROM hospitais\nLEFT JOIN consultas ON \nGROUP BY ;",
            solution: "SELECT \n    hospitais.nome,\n    COUNT(consultas.id) AS total_consultas\nFROM hospitais\nLEFT JOIN consultas ON consultas.hospital_id = hospitais.id\nGROUP BY hospitais.id, hospitais.nome;",
            validator: (res) => sameResult(res, "SELECT h.nome, (SELECT COUNT(*) FROM consultas c WHERE c.hospital_id = h.id) FROM hospitais h", { columns: ['total_consultas'] })
        },
        {
            id: 117, moduleId: 12,
            title: "Clientes que Nunca Consultaram",
            concept: "Anti-join",
            icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "Um <b>anti-join</b> encontra registros SEM correspondência: faça <code>LEFT JOIN</code> e filtre <code>WHERE tabela_direita.id IS NULL</code>. É a forma clássica de achar clientes que nunca usaram o plano, ótimo alvo para campanhas de prevenção.",
            task: "Liste <code>nome</code> e <code>plano</code> dos beneficiários que não têm nenhuma consulta registrada, usando <code>LEFT JOIN</code> + <code>IS NULL</code>.",
            startCode: "SELECT beneficiarios.nome, beneficiarios.plano\nFROM beneficiarios\nLEFT JOIN consultas ON \nWHERE ;",
            solution: "SELECT beneficiarios.nome, beneficiarios.plano\nFROM beneficiarios\nLEFT JOIN consultas ON consultas.beneficiario_id = beneficiarios.id\nWHERE consultas.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT nome, plano FROM beneficiarios b WHERE NOT EXISTS (SELECT 1 FROM consultas c WHERE c.beneficiario_id = b.id)")
        },
        {
            id: 118, moduleId: 12,
            title: "Colegas de Plano",
            concept: "Self-join",
            icon: '<i class="ph-fill ph-git-merge"></i>',
            theory: "Um <b>self-join</b> liga a tabela a ela mesma usando dois apelidos (<code>a</code> e <code>b</code>). Serve para comparar linhas da mesma tabela, como formar pares de clientes no mesmo plano. A condição <code>a.id &lt; b.id</code> evita parear alguém consigo mesmo e repetir o par invertido.",
            task: "Forme pares de beneficiários do mesmo <code>plano</code>: mostre <code>a.nome</code> como <code>beneficiario</code>, <code>b.nome</code> como <code>colega</code> e <code>a.plano</code>, usando <code>a.id &lt; b.id</code> para não repetir pares.",
            startCode: "SELECT \n    a.nome AS beneficiario,\n    b.nome AS colega,\n    a.plano\nFROM beneficiarios a\nJOIN beneficiarios b ON \n    AND ;",
            solution: "SELECT \n    a.nome AS beneficiario,\n    b.nome AS colega,\n    a.plano\nFROM beneficiarios a\nJOIN beneficiarios b ON a.plano = b.plano\n    AND a.id < b.id;",
            validator: (res) => sameResult(res, "SELECT a.nome, b.nome, a.plano FROM beneficiarios a JOIN beneficiarios b ON a.plano = b.plano AND a.id < b.id", { columns: ['beneficiario', 'colega'] })
        },

        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Coparticipação Pendente",
            concept: "IS NULL",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "NULL significa \"valor desconhecido\", e nada é igual a desconhecido: <code>coluna = NULL</code> nunca retorna linhas. Para testar ausência de valor use <code>IS NULL</code>, e para o contrário <code>IS NOT NULL</code>. Aqui, NULL indica consulta cuja coparticipação ainda não foi auditada.",
            task: "Liste <code>id</code>, <code>beneficiario_id</code> e <code>data</code> das <code>consultas</code> em que a <code>coparticipacao</code> ainda não foi informada (é NULL).",
            startCode: "SELECT id, beneficiario_id, data\nFROM consultas\nWHERE coparticipacao ;",
            solution: "SELECT id, beneficiario_id, data\nFROM consultas\nWHERE coparticipacao IS NULL;",
            validator: (res) => sameResult(res, "SELECT id, beneficiario_id, data FROM consultas WHERE coparticipacao IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Nível Não Classificado",
            concept: "COALESCE",
            icon: '<i class="ph-fill ph-puzzle-piece"></i>',
            theory: "<code>COALESCE(a, b, ...)</code> devolve o primeiro valor não nulo da lista. É o jeito de trocar NULL por um texto ou número padrão no relatório. No SQLite também existe <code>IFNULL(a, b)</code>; no SQL Server, <code>ISNULL(a, b)</code> ou o próprio <code>COALESCE</code>.",
            task: "Liste o <code>nome</code> dos <code>hospitais</code> e o <code>nivel_atendimento</code> com o apelido <code>nivel</code>, mostrando 'Não classificado' quando ele for NULL.",
            startCode: "SELECT \n    nome,\n    COALESCE(, ) AS nivel\nFROM hospitais;",
            solution: "SELECT \n    nome,\n    COALESCE(nivel_atendimento, 'Não classificado') AS nivel\nFROM hospitais;",
            validator: (res) => sameResult(res, "SELECT nome, COALESCE(nivel_atendimento, 'Não classificado') FROM hospitais", { columns: ['nivel'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Lista de Auditoria",
            concept: "UNION vs UNION ALL",
            icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas consultas (com o mesmo número de colunas) e <b>remove duplicados</b>. <code>UNION ALL</code> empilha tudo, mantendo repetições, e é mais rápido. Use <code>UNION</code> quando quer uma lista única, como uma lista de pessoas a contatar.",
            task: "Monte uma lista SEM repetição de <code>beneficiario_id</code> para auditoria: os ids de beneficiários com consulta de <code>coparticipacao</code> NULL, unidos aos <code>id</code> dos beneficiários do plano 'Premium'. A coluna final deve se chamar <code>beneficiario_id</code>.",
            startCode: "SELECT beneficiario_id\nFROM consultas\nWHERE \n\n\nSELECT id\nFROM beneficiarios\nWHERE ;",
            solution: "SELECT beneficiario_id\nFROM consultas\nWHERE coparticipacao IS NULL\nUNION\nSELECT id\nFROM beneficiarios\nWHERE plano = 'Premium';",
            validator: (res) => sameResult(res, "SELECT beneficiario_id FROM consultas WHERE coparticipacao IS NULL UNION SELECT id FROM beneficiarios WHERE plano = 'Premium'", { columns: ['beneficiario_id'] })
        },

        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Tabela de Exames",
            concept: "CREATE TABLE",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define colunas, tipos e regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> obriga o preenchimento e <code>CHECK (condição)</code> barra valores inválidos. <code>IF NOT EXISTS</code> evita erro se a tabela já existir (no SQL Server, use <code>IF OBJECT_ID('exames') IS NULL</code>). Errou a estrutura? Rode <code>DROP TABLE exames;</code> e crie de novo.",
            task: "Crie a tabela <code>exames</code> com: <code>id</code> INTEGER PRIMARY KEY, <code>consulta_id</code> INTEGER NOT NULL, <code>tipo</code> TEXT NOT NULL e <code>valor</code> REAL com <code>CHECK (valor &gt;= 0)</code>.",
            startCode: "CREATE TABLE IF NOT EXISTS exames (\n    id INTEGER ,\n    consulta_id INTEGER ,\n    tipo TEXT ,\n    valor REAL CHECK ()\n);",
            solution: "CREATE TABLE IF NOT EXISTS exames (\n    id INTEGER PRIMARY KEY,\n    consulta_id INTEGER NOT NULL,\n    tipo TEXT NOT NULL,\n    valor REAL CHECK (valor >= 0)\n);",
            validator: () => {
                try {
                    const info = db.exec("PRAGMA table_info('exames')");
                    if (!info.length) return false;
                    const cols = {};
                    info[0].values.forEach(v => { cols[String(v[1]).toLowerCase()] = { notnull: v[3], pk: v[5] }; });
                    const sql = db.exec("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'exames'")[0].values[0][0];
                    return cols.id && cols.id.pk === 1 && cols.consulta_id && cols.consulta_id.notnull === 1
                        && cols.tipo && cols.tipo.notnull === 1 && !!cols.valor && /check\s*\(/i.test(sql);
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Campo de Resultado",
            concept: "ALTER TABLE",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "<code>ALTER TABLE tabela ADD COLUMN coluna TIPO</code> inclui uma coluna nova sem perder os dados existentes; as linhas antigas ficam com NULL nela. No SQL Server a sintaxe é <code>ALTER TABLE tabela ADD coluna TIPO</code> (sem a palavra COLUMN). Rodar duas vezes dá erro de coluna duplicada.",
            task: "Adicione à tabela <code>exames</code> (criada na lição anterior) a coluna <code>resultado</code> do tipo TEXT. Depois rode <code>PRAGMA table_info('exames');</code> para conferir.",
            startCode: "ALTER TABLE exames\nADD COLUMN ;\n\nPRAGMA table_info('exames');",
            solution: "ALTER TABLE exames\nADD COLUMN resultado TEXT;\n\nPRAGMA table_info('exames');",
            validator: () => {
                try {
                    const info = db.exec("PRAGMA table_info('exames')");
                    return !!info.length && info[0].values.some(v => String(v[1]).toLowerCase() === 'resultado');
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "Visão de Atendimentos",
            concept: "CREATE VIEW",
            icon: '<i class="ph-fill ph-selection-all"></i>',
            theory: "Uma <code>VIEW</code> é uma consulta salva com nome; depois você faz <code>SELECT</code> nela como se fosse uma tabela, e ela sempre mostra os dados atuais. É ótima para esconder JOINs repetitivos de quem só precisa do relatório. No SQL Server, use <code>CREATE OR ALTER VIEW</code>.",
            task: "Crie a view <code>vw_atendimentos</code> com <code>consultas.id</code>, <code>beneficiarios.nome</code> como <code>paciente</code>, <code>hospitais.nome</code> como <code>hospital</code> e <code>consultas.data</code> (ligando as 3 tabelas). Em seguida, faça <code>SELECT * FROM vw_atendimentos;</code>.",
            startCode: "CREATE VIEW IF NOT EXISTS vw_atendimentos AS\nSELECT \n    consultas.id,\n     AS paciente,\n     AS hospital,\n    consultas.data\nFROM consultas\nJOIN beneficiarios ON \nJOIN hospitais ON ;\n\nSELECT * FROM vw_atendimentos;",
            solution: "CREATE VIEW IF NOT EXISTS vw_atendimentos AS\nSELECT \n    consultas.id,\n    beneficiarios.nome AS paciente,\n    hospitais.nome AS hospital,\n    consultas.data\nFROM consultas\nJOIN beneficiarios ON consultas.beneficiario_id = beneficiarios.id\nJOIN hospitais ON consultas.hospital_id = hospitais.id;\n\nSELECT * FROM vw_atendimentos;",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'vw_atendimentos'");
                    if (!v.length) return false;
                } catch (e) { return false; }
                return sameResult(res, "SELECT c.id, b.nome, h.nome, c.data FROM consultas c JOIN beneficiarios b ON c.beneficiario_id = b.id JOIN hospitais h ON c.hospital_id = h.id", { columns: ['paciente', 'hospital'] });
            }
        },

        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Hospital Líder por Cidade",
            concept: "CTE + JOIN + Window",
            icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "Desafios reais pedem etapas: primeiro agregue (CTE com <code>JOIN</code> + <code>GROUP BY</code>), depois ranqueie dentro de cada grupo (<code>ROW_NUMBER() OVER (PARTITION BY ...)</code>) e por fim filtre a posição 1. Esse padrão \"top 1 por grupo\" é um dos mais pedidos em entrevistas e no dia a dia.",
            task: "A diretoria de rede quer saber, <b>em cada cidade</b>, qual hospital teve mais consultas. Mostre <code>cidade</code>, o nome do hospital como <code>hospital</code> e <code>total_consultas</code>, apenas o líder de cada cidade (considere só hospitais com consultas). Ordene por <code>cidade</code>.",
            startCode: "WITH por_hospital AS (\n    SELECT hospitais.cidade, hospitais.nome, \n    FROM consultas\n    JOIN hospitais ON \n    GROUP BY \n),\nranking AS (\n    SELECT *, ROW_NUMBER() OVER () AS pos\n    FROM por_hospital\n)\nSELECT \nFROM ranking\nWHERE \nORDER BY ;",
            solution: "WITH por_hospital AS (\n    SELECT hospitais.cidade, hospitais.nome, COUNT(*) AS total_consultas\n    FROM consultas\n    JOIN hospitais ON consultas.hospital_id = hospitais.id\n    GROUP BY hospitais.id, hospitais.cidade, hospitais.nome\n),\nranking AS (\n    SELECT *, ROW_NUMBER() OVER (PARTITION BY cidade ORDER BY total_consultas DESC) AS pos\n    FROM por_hospital\n)\nSELECT cidade, nome AS hospital, total_consultas\nFROM ranking\nWHERE pos = 1\nORDER BY cidade;",
            validator: (res) => sameResult(res, "WITH p AS (SELECT h.cidade, h.nome, COUNT(*) AS t FROM consultas c JOIN hospitais h ON c.hospital_id = h.id GROUP BY h.id), r AS (SELECT *, RANK() OVER (PARTITION BY cidade ORDER BY t DESC) AS pos FROM p) SELECT cidade, nome, t FROM r WHERE pos = 1 ORDER BY cidade", { ordered: true, columns: ['cidade', 'hospital', 'total_consultas'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Receita por Faixa de Preço",
            concept: "CASE + GROUP BY + HAVING",
            icon: '<i class="ph-fill ph-receipt"></i>',
            theory: "Um <code>CASE</code> pode criar categorias que não existem na tabela, e essas categorias podem ser usadas no <code>GROUP BY</code>. Combinado com <code>HAVING</code> e <code>ORDER BY</code>, vira um relatório gerencial completo em uma única consulta. No SQL Server, repita a expressão do CASE no <code>GROUP BY</code> (o apelido não é aceito lá).",
            task: "O financeiro quer a receita mensal dos beneficiários <b>ativos</b> por faixa de preço: 'Alto' (mensalidade &gt;= 900), 'Médio' (&gt;= 500) e 'Entrada' (demais). Mostre <code>faixa</code>, a quantidade como <code>vidas</code> e a soma das mensalidades como <code>receita</code>, apenas das faixas com receita acima de 1000, ordenadas por <code>receita</code> decrescente.",
            startCode: "SELECT \n    CASE \n        WHEN  THEN 'Alto'\n        WHEN  THEN 'Médio'\n        ELSE 'Entrada'\n    END AS faixa,\n     AS vidas,\n     AS receita\nFROM beneficiarios\nWHERE \nGROUP BY \nHAVING \nORDER BY ;",
            solution: "SELECT \n    CASE \n        WHEN mensalidade >= 900 THEN 'Alto'\n        WHEN mensalidade >= 500 THEN 'Médio'\n        ELSE 'Entrada'\n    END AS faixa,\n    COUNT(*) AS vidas,\n    SUM(mensalidade) AS receita\nFROM beneficiarios\nWHERE status = 'Ativo'\nGROUP BY faixa\nHAVING SUM(mensalidade) > 1000\nORDER BY receita DESC;",
            validator: (res) => sameResult(res, "SELECT CASE WHEN mensalidade >= 900 THEN 'Alto' WHEN mensalidade >= 500 THEN 'Médio' ELSE 'Entrada' END AS f, COUNT(*), SUM(mensalidade) AS r FROM beneficiarios WHERE status = 'Ativo' GROUP BY f HAVING SUM(mensalidade) > 1000 ORDER BY r DESC", { ordered: true, columns: ['faixa', 'vidas', 'receita'] })
        },
        {
            id: 127, moduleId: 15,
            title: "Uso do Plano por Vida",
            concept: "CTE + LEFT JOIN + ROUND",
            icon: '<i class="ph-fill ph-target"></i>',
            theory: "Indicadores de uso dividem um volume por uma base (consultas por vida). Calcule numerador e denominador em CTEs separadas e junte com <code>LEFT JOIN</code> para não perder planos sem uso. Atenção: inteiro dividido por inteiro dá inteiro no SQLite e no SQL Server, então multiplique por <code>1.0</code> antes de dividir.",
            task: "A área atuarial quer o uso por plano, considerando só beneficiários <b>ativos</b>: mostre <code>plano</code>, o número de vidas ativas como <code>vidas_ativas</code>, o total de consultas dessas vidas como <code>consultas</code> e consultas por vida arredondado para 2 casas como <code>consultas_por_vida</code>. Ordene por <code>consultas_por_vida</code> decrescente.",
            startCode: "WITH vidas AS (\n    SELECT plano, \n    FROM beneficiarios\n    WHERE \n    GROUP BY plano\n),\nuso AS (\n    SELECT beneficiarios.plano, \n    FROM beneficiarios\n    JOIN consultas ON \n    WHERE \n    GROUP BY beneficiarios.plano\n)\nSELECT \nFROM vidas\nLEFT JOIN uso ON \nORDER BY ;",
            solution: "WITH vidas AS (\n    SELECT plano, COUNT(*) AS vidas_ativas\n    FROM beneficiarios\n    WHERE status = 'Ativo'\n    GROUP BY plano\n),\nuso AS (\n    SELECT beneficiarios.plano, COUNT(consultas.id) AS consultas\n    FROM beneficiarios\n    JOIN consultas ON consultas.beneficiario_id = beneficiarios.id\n    WHERE beneficiarios.status = 'Ativo'\n    GROUP BY beneficiarios.plano\n)\nSELECT \n    vidas.plano,\n    vidas.vidas_ativas,\n    COALESCE(uso.consultas, 0) AS consultas,\n    ROUND(COALESCE(uso.consultas, 0) * 1.0 / vidas.vidas_ativas, 2) AS consultas_por_vida\nFROM vidas\nLEFT JOIN uso ON uso.plano = vidas.plano\nORDER BY consultas_por_vida DESC;",
            validator: (res) => sameResult(res, "SELECT b.plano, COUNT(DISTINCT b.id), COUNT(c.id), ROUND(COUNT(c.id) * 1.0 / COUNT(DISTINCT b.id), 2) AS cpv FROM beneficiarios b LEFT JOIN consultas c ON c.beneficiario_id = b.id WHERE b.status = 'Ativo' GROUP BY b.plano ORDER BY cpv DESC", { ordered: true, columns: ['plano', 'vidas_ativas', 'consultas', 'consultas_por_vida'] })
        }
    ]
};

extraLessons.construtora = {
    setup: `
        INSERT INTO obras VALUES
            (4, 'Torre Atlântica', 'Rio de Janeiro', 7200000, 'Em Andamento'),
            (5, 'Vila Jardim', 'São Paulo', 2100000, 'Planejamento'),
            (6, 'Galpão Logístico Norte', 'São Paulo', 4300000, 'Paralisada'),
            (7, 'Residencial Bela Vista', 'São Paulo', 3900000, 'Em Andamento');
        INSERT INTO funcionarios VALUES
            (5, 'Carla Mendes', 'Engenheiro', 13500, 4),
            (6, 'Paulo Rocha', 'Pedreiro', 3800, 4),
            (7, 'Fernanda Lima', 'Arquiteta', 9800, NULL),
            (8, 'Ricardo Alves', 'Mestre de Obras', 6500, 6),
            (9, 'Bruno Costa', 'Pedreiro', 3200, 6);
        INSERT INTO materiais VALUES
            (4, 'Areia (m³)', 120, 200, 4),
            (5, 'Brita (m³)', 95, 150, 4),
            (6, 'Tinta Acrílica (Lata)', 60, 80, NULL),
            (7, 'Cimento (Saco)', 36, 600, 6),
            (8, 'Bloco de Concreto', 4, 5000, 6),
            (9, 'Telha Cerâmica', 3, 4000, 7);
    `,
    lessons: [
        // ---------- Módulo 1 ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Custo Total de Cada Insumo",
            concept: "Coluna calculada",
            icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Dá para fazer contas direto no <code>SELECT</code>: multiplicar, somar, dividir colunas linha a linha. Com <code>AS</code> você dá um nome (apelido) para a coluna calculada, deixando o relatório legível. É assim que o orçamentista transforma preço unitário × quantidade em custo total sem abrir planilha.",
            task: "Liste a <code>descricao</code> de cada material e o custo total do item (<code>custo_unidade * quantidade</code>) com o apelido <code>custo_total</code>.",
            startCode: "SELECT descricao,\n    ... AS custo_total\nFROM materiais;",
            solution: "SELECT descricao,\n    custo_unidade * quantidade AS custo_total\nFROM materiais;",
            validator: (res) => sameResult(res, "SELECT descricao, custo_unidade * quantidade FROM materiais", { columns: ['custo_total'] })
        },
        // ---------- Módulo 2 ----------
        {
            id: 101, moduleId: 2, after: 4,
            title: "Insumos Vendidos por Saco",
            concept: "LIKE",
            icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "<code>LIKE</code> busca padrões de texto. O <code>%</code> representa qualquer sequência de caracteres e o <code>_</code> exatamente um caractere. <code>'%Saco%'</code> encontra qualquer descrição que contenha a palavra Saco em qualquer posição.",
            task: "Selecione todas as colunas (*) dos <code>materiais</code> cuja <code>descricao</code> contenha a palavra 'Saco'.",
            startCode: "SELECT * \nFROM materiais\nWHERE descricao LIKE '';",
            solution: "SELECT * \nFROM materiais\nWHERE descricao LIKE '%Saco%';",
            validator: (res) => sameResult(res, "SELECT * FROM materiais WHERE descricao LIKE '%Saco%'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Obras de Porte Médio Ativas",
            concept: "IN / BETWEEN",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>BETWEEN a AND b</code> filtra uma faixa de valores (incluindo as pontas). <code>IN (...)</code> substitui vários <code>OR</code> sobre a mesma coluna. Juntos, deixam filtros de relatório curtos e fáceis de ler.",
            task: "Selecione <code>nome_empreendimento</code>, <code>status</code> e <code>orcamento</code> das obras com <code>orcamento</code> entre 3000000 e 6000000 (BETWEEN) e <code>status</code> em 'Em Andamento' ou 'Paralisada' (IN).",
            startCode: "SELECT nome_empreendimento, status, orcamento\nFROM obras\nWHERE orcamento BETWEEN \n  AND status IN ();",
            solution: "SELECT nome_empreendimento, status, orcamento\nFROM obras\nWHERE orcamento BETWEEN 3000000 AND 6000000\n    AND status IN ('Em Andamento', 'Paralisada');",
            validator: (res) => sameResult(res, "SELECT nome_empreendimento, status, orcamento FROM obras WHERE orcamento BETWEEN 3000000 AND 6000000 AND status IN ('Em Andamento', 'Paralisada')")
        },
        // ---------- Módulo 3 ----------
        {
            id: 103, moduleId: 3, after: 9,
            title: "Faixa Salarial da Equipe",
            concept: "AVG / MIN / MAX",
            icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "<code>AVG()</code> calcula a média, <code>MIN()</code> o menor valor e <code>MAX()</code> o maior. Usadas juntas numa só consulta, dão um retrato rápido da folha de pagamento para o RH.",
            task: "Mostre a média, o menor e o maior <code>salario</code> da tabela <code>funcionarios</code>, com os apelidos <code>media_salarial</code>, <code>menor_salario</code> e <code>maior_salario</code>.",
            startCode: "SELECT \n    ... AS media_salarial,\n    ... AS menor_salario,\n    ... AS maior_salario\nFROM funcionarios;",
            solution: "SELECT\n    AVG(salario) AS media_salarial,\n    MIN(salario) AS menor_salario,\n    MAX(salario) AS maior_salario\nFROM funcionarios;",
            validator: (res) => sameResult(res, "SELECT AVG(salario), MIN(salario), MAX(salario) FROM funcionarios", { columns: ['media_salarial', 'menor_salario', 'maior_salario'] })
        },
        // ---------- Módulo 4 ----------
        {
            id: 104, moduleId: 4, after: 11,
            title: "Tamanho da Equipe por Obra",
            concept: "JOIN + GROUP BY",
            icon: '<i class="ph-fill ph-users"></i>',
            theory: "Depois de juntar as tabelas com <code>JOIN</code>, você pode agrupar o resultado com <code>GROUP BY</code> usando colunas de qualquer uma delas. Assim o relatório mostra o nome da obra (de <code>obras</code>) e a contagem de pessoas (de <code>funcionarios</code>).",
            task: "Faça um JOIN de <code>funcionarios</code> com <code>obras</code> e mostre o <code>nome_empreendimento</code> e a quantidade de funcionários de cada obra com o apelido <code>total_funcionarios</code>.",
            startCode: "SELECT o.nome_empreendimento, \n    ... AS total_funcionarios\nFROM funcionarios f\nJOIN obras o ON f.obra_id = o.id\nGROUP BY ;",
            solution: "SELECT o.nome_empreendimento,\n    COUNT(*) AS total_funcionarios\nFROM funcionarios f\nJOIN obras o ON f.obra_id = o.id\nGROUP BY o.nome_empreendimento;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, COUNT(*) FROM funcionarios f JOIN obras o ON f.obra_id = o.id GROUP BY o.nome_empreendimento", { columns: ['total_funcionarios'] })
        },
        // ---------- Módulo 5 ----------
        {
            id: 105, moduleId: 5, after: 13,
            title: "Dissídio dos Pedreiros",
            concept: "UPDATE com cálculo",
            icon: '<i class="ph-fill ph-percent"></i>',
            theory: "O <code>UPDATE</code> pode usar o valor atual da coluna no cálculo: <code>SET salario = salario * 1.05</code> aplica 5% de aumento. O <code>WHERE</code> é o que limita o reajuste a um grupo; sem ele, TODOS os registros são alterados. <code>ROUND()</code> evita centavos quebrados.",
            task: "O sindicato fechou dissídio de 5% para quem tem <code>cargo</code> 'Pedreiro'. Atualize o <code>salario</code> deles para <code>ROUND(salario * 1.05)</code> e depois liste <code>nome</code> e <code>salario</code> dos pedreiros.",
            startCode: "UPDATE funcionarios\nSET salario = \nWHERE cargo = ;\n\nSELECT nome, salario FROM funcionarios WHERE cargo = 'Pedreiro';",
            solution: "UPDATE funcionarios\nSET salario = ROUND(salario * 1.05)\nWHERE cargo = 'Pedreiro';\n\nSELECT nome, salario FROM funcionarios WHERE cargo = 'Pedreiro';",
            validator: (res) => {
                try {
                    const pedreiros = { 'José Souza': 3500, 'Paulo Rocha': 3800, 'Bruno Costa': 3200, 'Tiago': 3500 };
                    const outros = { 'Marcos Silva': 12000, 'Aline Ferreira': 11000, 'Roberto Dias': 6000, 'Carla Mendes': 13500, 'Fernanda Lima': 9800, 'Ricardo Alves': 6500 };
                    const rows = db.exec("SELECT nome, cargo, salario FROM funcionarios")[0].values;
                    let checados = 0;
                    for (const [nome, cargo, salario] of rows) {
                        if (cargo === 'Pedreiro' && pedreiros[nome] !== undefined) {
                            if (salario < Math.round(pedreiros[nome] * 1.05) - 0.5) return false;
                            checados++;
                        }
                        if (outros[nome] !== undefined && salario !== outros[nome]) return false;
                    }
                    return checados >= 3;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 6 ----------
        {
            id: 106, moduleId: 6, after: 15,
            title: "Obras com Folha Pesada",
            concept: "CTE (WITH)",
            icon: '<i class="ph-fill ph-stack"></i>',
            theory: "Uma CTE (<code>WITH nome AS (...)</code>) cria uma tabela temporária com nome, válida só para aquela consulta. Ela quebra um problema grande em etapas legíveis: primeiro calcula, depois filtra ou junta. A sintaxe é a mesma no SQL Server.",
            task: "Crie uma CTE chamada <code>folha</code> com <code>obra_id</code> e a soma dos salários (<code>folha_mensal</code>) por obra. Depois junte com <code>obras</code> e mostre <code>nome_empreendimento</code> e <code>folha_mensal</code> só das obras com folha acima de 15000, da maior para a menor.",
            startCode: "WITH folha AS (\n    SELECT obra_id, ... AS folha_mensal\n    FROM funcionarios\n    GROUP BY \n)\nSELECT o.nome_empreendimento, f.folha_mensal\nFROM folha f\nJOIN obras o ON \nWHERE \nORDER BY ;",
            solution: "WITH folha AS (\n    SELECT obra_id, SUM(salario) AS folha_mensal\n    FROM funcionarios\n    GROUP BY obra_id\n)\nSELECT o.nome_empreendimento, f.folha_mensal\nFROM folha f\nJOIN obras o ON o.id = f.obra_id\nWHERE f.folha_mensal > 15000\nORDER BY f.folha_mensal DESC;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, SUM(f.salario) AS s FROM funcionarios f JOIN obras o ON o.id = f.obra_id GROUP BY o.id HAVING SUM(f.salario) > 15000 ORDER BY s DESC", { ordered: true, columns: ['folha_mensal'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Obras que Já Receberam Material",
            concept: "EXISTS",
            icon: '<i class="ph-fill ph-magnifying-glass-plus"></i>',
            theory: "<code>EXISTS (subquery)</code> é verdadeiro quando a subquery devolve pelo menos uma linha. A subquery é correlacionada: ela usa a linha da consulta de fora (<code>m.obra_id = o.id</code>). <code>NOT EXISTS</code> faz o contrário e acha quem não tem nenhum registro ligado.",
            task: "Liste o <code>nome_empreendimento</code> das obras para as quais EXISTE pelo menos um registro em <code>materiais</code>.",
            startCode: "SELECT nome_empreendimento\nFROM obras o\nWHERE EXISTS (\n    SELECT 1\n    FROM materiais m\n    WHERE \n);",
            solution: "SELECT nome_empreendimento\nFROM obras o\nWHERE EXISTS (\n    SELECT 1\n    FROM materiais m\n    WHERE m.obra_id = o.id\n);",
            validator: (res) => sameResult(res, "SELECT nome_empreendimento FROM obras WHERE id IN (SELECT obra_id FROM materiais WHERE obra_id IS NOT NULL)")
        },
        // ---------- Módulo 7 ----------
        {
            id: 108, moduleId: 7, after: 16,
            title: "Ranking Salarial por Cargo",
            concept: "ROW_NUMBER + PARTITION",
            icon: '<i class="ph-fill ph-ranking"></i>',
            theory: "<code>ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)</code> numera as linhas recomeçando do 1 a cada grupo. Diferente do <code>GROUP BY</code>, as linhas não são agrupadas: cada funcionário continua aparecendo, agora com a sua posição dentro do cargo.",
            task: "Mostre <code>nome</code>, <code>cargo</code>, <code>salario</code> e a posição de cada funcionário dentro do seu cargo, do maior para o menor salário (empate desempata por <code>nome</code>), com o apelido <code>posicao</code>.",
            startCode: "SELECT nome, cargo, salario,\n    ROW_NUMBER() OVER (PARTITION BY  ORDER BY ) AS posicao\nFROM funcionarios;",
            solution: "SELECT nome, cargo, salario,\n    ROW_NUMBER() OVER (PARTITION BY cargo ORDER BY salario DESC, nome) AS posicao\nFROM funcionarios;",
            validator: (res) => sameResult(res, "SELECT nome, cargo, salario, ROW_NUMBER() OVER (PARTITION BY cargo ORDER BY salario DESC, nome) FROM funcionarios", { columns: ['posicao'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Gasto Acumulado em Compras",
            concept: "SUM() OVER",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>SUM(...) OVER (ORDER BY ...)</code> calcula um total acumulado: cada linha soma o seu valor com o de todas as anteriores na ordem indicada. É o famoso \"saldo corrido\" usado no controle de custos da obra.",
            task: "Liste <code>id</code>, <code>descricao</code>, o custo do item (<code>custo_unidade * quantidade</code>) como <code>custo_total</code> e o acumulado desse custo pela ordem de <code>id</code> como <code>custo_acumulado</code>. Ordene por <code>id</code>.",
            startCode: "SELECT id, descricao,\n    custo_unidade * quantidade AS custo_total,\n    SUM(...) OVER (ORDER BY ) AS custo_acumulado\nFROM materiais\nORDER BY id;",
            solution: "SELECT id, descricao,\n    custo_unidade * quantidade AS custo_total,\n    SUM(custo_unidade * quantidade) OVER (ORDER BY id) AS custo_acumulado\nFROM materiais\nORDER BY id;",
            validator: (res) => sameResult(res, "SELECT id, descricao, custo_unidade * quantidade, SUM(custo_unidade * quantidade) OVER (ORDER BY id) FROM materiais ORDER BY id", { ordered: true, columns: ['custo_total', 'custo_acumulado'] })
        },
        // ---------- Módulo 8 ----------
        {
            id: 110, moduleId: 8, after: 17,
            title: "Composição da Equipe por Obra",
            concept: "SUM(CASE WHEN)",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "Colocar um <code>CASE WHEN</code> dentro do <code>SUM()</code> conta só as linhas que atendem à condição: <code>SUM(CASE WHEN cargo = 'Pedreiro' THEN 1 ELSE 0 END)</code>. Assim, várias contagens diferentes viram colunas lado a lado, numa espécie de tabela dinâmica.",
            task: "Junte <code>obras</code> e <code>funcionarios</code> e mostre, por <code>nome_empreendimento</code>, quantos pedreiros (<code>pedreiros</code>) e quantos engenheiros (<code>engenheiros</code>) cada obra tem.",
            startCode: "SELECT o.nome_empreendimento,\n    SUM(CASE WHEN  THEN 1 ELSE 0 END) AS pedreiros,\n    SUM(CASE WHEN  THEN 1 ELSE 0 END) AS engenheiros\nFROM obras o\nJOIN funcionarios f ON f.obra_id = o.id\nGROUP BY o.nome_empreendimento;",
            solution: "SELECT o.nome_empreendimento,\n    SUM(CASE WHEN f.cargo = 'Pedreiro' THEN 1 ELSE 0 END) AS pedreiros,\n    SUM(CASE WHEN f.cargo = 'Engenheiro' THEN 1 ELSE 0 END) AS engenheiros\nFROM obras o\nJOIN funcionarios f ON f.obra_id = o.id\nGROUP BY o.nome_empreendimento;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, SUM(f.cargo = 'Pedreiro'), SUM(f.cargo = 'Engenheiro') FROM obras o JOIN funcionarios f ON f.obra_id = o.id GROUP BY o.nome_empreendimento", { columns: ['pedreiros', 'engenheiros'] })
        },
        // ---------- Módulo 10 ----------
        {
            id: 111, moduleId: 10, after: 22,
            title: "Plano de Busca da Equipe",
            concept: "EXPLAIN QUERY PLAN",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o banco vai executar a consulta: se varre a tabela inteira (SCAN) ou usa um índice (SEARCH ... USING INDEX). No SQL Server o equivalente é o Plano de Execução (Ctrl+L / Ctrl+M no SSMS).",
            task: "Veja o plano de execução da consulta <code>SELECT * FROM funcionarios WHERE obra_id = 1</code> usando <code>EXPLAIN QUERY PLAN</code>. Confira na coluna <code>detail</code> se o índice <code>idx_func_obra</code> é usado.",
            startCode: "... \nSELECT * \nFROM funcionarios\nWHERE obra_id = 1;",
            solution: "EXPLAIN QUERY PLAN\nSELECT *\nFROM funcionarios\nWHERE obra_id = 1;",
            validator: (res) => !!(res && res.length && res[res.length - 1].columns.includes('detail'))
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Removendo Índice Temporário",
            concept: "DROP INDEX",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices aceleram leituras, mas ocupam espaço e deixam <code>INSERT</code>/<code>UPDATE</code> mais lentos. Índices que não ajudam devem ser removidos com <code>DROP INDEX IF EXISTS nome</code> (o <code>IF EXISTS</code> evita erro se ele já não existir). No SQL Server é preciso informar a tabela: <code>DROP INDEX nome ON tabela</code>.",
            task: "Crie o índice <code>idx_mat_temp</code> em <code>materiais(custo_unidade)</code> com <code>CREATE INDEX IF NOT EXISTS</code>, remova-o com <code>DROP INDEX IF EXISTS</code> e termine listando <code>name</code> de <code>sqlite_master</code> onde <code>type = 'index'</code>.",
            startCode: "CREATE INDEX IF NOT EXISTS idx_mat_temp ON materiais(custo_unidade);\n\nDROP INDEX ... ;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            solution: "CREATE INDEX IF NOT EXISTS idx_mat_temp ON materiais(custo_unidade);\n\nDROP INDEX IF EXISTS idx_mat_temp;\n\nSELECT name FROM sqlite_master WHERE type = 'index';",
            validator: (res) => {
                if (!res || !res.length || !res[res.length - 1].columns.includes('name')) return false;
                try {
                    const r = db.exec("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_mat_temp'");
                    return r.length === 0 || r[0].values.length === 0;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Obras com Muito Material",
            concept: "HAVING",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>WHERE</code> filtra linhas ANTES do agrupamento; <code>HAVING</code> filtra os grupos DEPOIS, por isso aceita funções de agregação como <code>SUM()</code> e <code>COUNT()</code>. Use quando o critério depende do total do grupo, e não de uma linha isolada.",
            task: "Mostre <code>obra_id</code> e o custo total de materiais por obra (<code>SUM(custo_unidade * quantidade)</code>) como <code>custo_materiais</code>, apenas para as obras cujo custo total passa de 40000.",
            startCode: "SELECT obra_id,\n    SUM(custo_unidade * quantidade) AS custo_materiais\nFROM materiais\nGROUP BY obra_id\nHAVING ;",
            solution: "SELECT obra_id,\n    SUM(custo_unidade * quantidade) AS custo_materiais\nFROM materiais\nGROUP BY obra_id\nHAVING SUM(custo_unidade * quantidade) > 40000;",
            validator: (res) => sameResult(res, "SELECT obra_id, SUM(custo_unidade * quantidade) FROM materiais GROUP BY obra_id HAVING SUM(custo_unidade * quantidade) > 40000", { columns: ['custo_materiais'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Variedade de Insumos",
            concept: "COUNT(DISTINCT)",
            icon: '<i class="ph-fill ph-hash"></i>',
            theory: "<code>COUNT(*)</code> conta linhas; <code>COUNT(DISTINCT coluna)</code> conta apenas valores diferentes. Se o mesmo insumo foi comprado para duas obras, ele entra duas vezes no primeiro e uma vez só no segundo.",
            task: "Em uma única linha, mostre o total de compras registradas em <code>materiais</code> como <code>total_compras</code> e a quantidade de descrições diferentes como <code>tipos_material</code>.",
            startCode: "SELECT\n    ... AS total_compras,\n    ... AS tipos_material\nFROM materiais;",
            solution: "SELECT\n    COUNT(*) AS total_compras,\n    COUNT(DISTINCT descricao) AS tipos_material\nFROM materiais;",
            validator: (res) => sameResult(res, "SELECT COUNT(*), COUNT(DISTINCT descricao) FROM materiais", { columns: ['total_compras', 'tipos_material'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Carteira por Cidade e Status",
            concept: "GROUP BY múltiplo",
            icon: '<i class="ph-fill ph-table"></i>',
            theory: "Agrupar por várias colunas (<code>GROUP BY cidade, status</code>) cria um grupo para cada combinação. <code>ROUND(valor, 2)</code> arredonda médias para duas casas, deixando o relatório apresentável.",
            task: "Mostre <code>cidade</code>, <code>status</code>, a quantidade de obras (<code>qtd_obras</code>) e o orçamento médio arredondado a 2 casas (<code>orcamento_medio</code>) para cada combinação de cidade e status. Ordene por <code>cidade</code> e depois <code>status</code>.",
            startCode: "SELECT cidade, status,\n    ... AS qtd_obras,\n    ... AS orcamento_medio\nFROM obras\nGROUP BY \nORDER BY ;",
            solution: "SELECT cidade, status,\n    COUNT(*) AS qtd_obras,\n    ROUND(AVG(orcamento), 2) AS orcamento_medio\nFROM obras\nGROUP BY cidade, status\nORDER BY cidade, status;",
            validator: (res) => sameResult(res, "SELECT cidade, status, COUNT(*), ROUND(AVG(orcamento), 2) FROM obras GROUP BY cidade, status ORDER BY cidade, status", { ordered: true, columns: ['qtd_obras', 'orcamento_medio'] })
        },
        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Todas as Obras e suas Equipes",
            concept: "LEFT JOIN",
            icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>INNER JOIN</code> só traz linhas com correspondência nas duas tabelas. O <code>LEFT JOIN</code> traz TODAS as linhas da tabela da esquerda; quando não há par na direita, as colunas dela vêm como <code>NULL</code>. Ideal para ver obras que ainda não têm equipe.",
            task: "Liste o <code>nome_empreendimento</code> de TODAS as obras e o <code>nome</code> dos funcionários alocados em cada uma, incluindo obras sem nenhum funcionário (use <code>LEFT JOIN</code>).",
            startCode: "SELECT o.nome_empreendimento, f.nome\nFROM obras o\n... funcionarios f ON ;",
            solution: "SELECT o.nome_empreendimento, f.nome\nFROM obras o\nLEFT JOIN funcionarios f ON f.obra_id = o.id;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, f.nome FROM obras o LEFT JOIN funcionarios f ON f.obra_id = o.id")
        },
        {
            id: 117, moduleId: 12,
            title: "Obras sem Equipe Alocada",
            concept: "Anti-join",
            icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "Anti-join é o truque de achar registros SEM correspondência: faça um <code>LEFT JOIN</code> e filtre <code>WHERE</code> a chave da tabela da direita <code>IS NULL</code>. Muito usado para achar obras sem equipe, clientes sem pedido, produtos sem venda.",
            task: "Liste <code>nome_empreendimento</code> e <code>status</code> das obras que NÃO têm nenhum funcionário alocado, usando <code>LEFT JOIN</code> + <code>IS NULL</code>.",
            startCode: "SELECT o.nome_empreendimento, o.status\nFROM obras o\nLEFT JOIN funcionarios f ON f.obra_id = o.id\nWHERE ;",
            solution: "SELECT o.nome_empreendimento, o.status\nFROM obras o\nLEFT JOIN funcionarios f ON f.obra_id = o.id\nWHERE f.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT nome_empreendimento, status FROM obras WHERE id NOT IN (SELECT obra_id FROM funcionarios WHERE obra_id IS NOT NULL)")
        },
        {
            id: 118, moduleId: 12,
            title: "Duplas de Colegas de Canteiro",
            concept: "Self-join",
            icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "Self-join é juntar uma tabela com ela mesma usando apelidos diferentes (<code>a</code> e <code>b</code>). Serve para comparar linhas da mesma tabela, como pessoas que trabalham na mesma obra. A condição <code>a.id &lt; b.id</code> evita parear alguém consigo mesmo e repetir a dupla invertida.",
            task: "Liste todas as duplas de funcionários que trabalham na mesma obra: <code>a.nome</code> como <code>funcionario</code> e <code>b.nome</code> como <code>colega</code>, sem repetir duplas (use <code>a.id &lt; b.id</code>).",
            startCode: "SELECT a.nome AS funcionario, b.nome AS colega\nFROM funcionarios a\nJOIN funcionarios b \n    ON \n    AND ;",
            solution: "SELECT a.nome AS funcionario, b.nome AS colega\nFROM funcionarios a\nJOIN funcionarios b\n    ON a.obra_id = b.obra_id\n    AND a.id < b.id;",
            validator: (res) => sameResult(res, "SELECT a.nome, b.nome FROM funcionarios a JOIN funcionarios b ON a.obra_id = b.obra_id AND a.id < b.id", { columns: ['funcionario', 'colega'] })
        },
        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Quem Está no Escritório",
            concept: "IS NULL",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>NULL</code> significa \"sem valor\" e não é igual a nada, nem a outro <code>NULL</code>: por isso <code>obra_id = NULL</code> nunca encontra linhas. Use <code>IS NULL</code> para achar campos vazios e <code>IS NOT NULL</code> para o contrário.",
            task: "Liste <code>nome</code> e <code>cargo</code> dos funcionários que não estão alocados em nenhuma obra (<code>obra_id</code> nulo).",
            startCode: "SELECT nome, cargo\nFROM funcionarios\nWHERE obra_id ;",
            solution: "SELECT nome, cargo\nFROM funcionarios\nWHERE obra_id IS NULL;",
            validator: (res) => sameResult(res, "SELECT nome, cargo FROM funcionarios WHERE obra_id IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Lotação de Cada Funcionário",
            concept: "COALESCE",
            icon: '<i class="ph-fill ph-puzzle-piece"></i>',
            theory: "<code>COALESCE(a, b, ...)</code> devolve o primeiro valor não nulo da lista, ótimo para trocar <code>NULL</code> por um texto padrão. No SQL Server também existe <code>ISNULL(a, b)</code>; no SQLite, <code>IFNULL(a, b)</code>.",
            task: "Faça um <code>LEFT JOIN</code> de <code>funcionarios</code> com <code>obras</code> e mostre o <code>nome</code> do funcionário e a lotação (<code>lotacao</code>): o <code>nome_empreendimento</code> ou 'Escritório Central' quando não houver obra.",
            startCode: "SELECT f.nome,\n    COALESCE(, '') AS lotacao\nFROM funcionarios f\nLEFT JOIN obras o ON f.obra_id = o.id;",
            solution: "SELECT f.nome,\n    COALESCE(o.nome_empreendimento, 'Escritório Central') AS lotacao\nFROM funcionarios f\nLEFT JOIN obras o ON f.obra_id = o.id;",
            validator: (res) => sameResult(res, "SELECT f.nome, IFNULL(o.nome_empreendimento, 'Escritório Central') FROM funcionarios f LEFT JOIN obras o ON f.obra_id = o.id", { columns: ['lotacao'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Catálogo Único de Insumos",
            concept: "UNION vs UNION ALL",
            icon: '<i class="ph-fill ph-git-merge"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas consultas e remove linhas repetidas; <code>UNION ALL</code> empilha tudo, mantendo as repetições (e é mais rápido). As duas consultas precisam ter o mesmo número de colunas, com tipos compatíveis.",
            task: "Monte a lista de <code>descricao</code> dos materiais da obra 1 empilhada com os da obra 6, SEM repetir insumos que aparecem nas duas obras.",
            startCode: "SELECT descricao FROM materiais WHERE obra_id = 1\n...\nSELECT descricao FROM materiais WHERE obra_id = 6;",
            solution: "SELECT descricao FROM materiais WHERE obra_id = 1\nUNION\nSELECT descricao FROM materiais WHERE obra_id = 6;",
            validator: (res) => sameResult(res, "SELECT DISTINCT descricao FROM materiais WHERE obra_id IN (1, 6)")
        },
        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Tabela de Medições de Obra",
            concept: "CREATE TABLE",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define colunas e regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> proíbe campo vazio e <code>CHECK (condição)</code> barra valores inválidos. <code>IF NOT EXISTS</code> evita erro se a tabela já existir; se precisar recriar, use <code>DROP TABLE IF EXISTS medicoes</code> antes.",
            task: "Crie a tabela <code>medicoes</code> com: <code>id</code> INTEGER PRIMARY KEY; <code>obra_id</code> INTEGER NOT NULL; <code>mes</code> TEXT NOT NULL; <code>percentual_concluido</code> REAL com <code>CHECK</code> para ficar entre 0 e 100.",
            startCode: "CREATE TABLE IF NOT EXISTS medicoes (\n    id INTEGER ...,\n    obra_id INTEGER ...,\n    mes TEXT ...,\n    percentual_concluido REAL CHECK (...)\n);",
            solution: "CREATE TABLE IF NOT EXISTS medicoes (\n    id INTEGER PRIMARY KEY,\n    obra_id INTEGER NOT NULL,\n    mes TEXT NOT NULL,\n    percentual_concluido REAL CHECK (percentual_concluido BETWEEN 0 AND 100)\n);",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info(medicoes)");
                    if (!info.length) return false;
                    const cols = {};
                    info[0].values.forEach(v => { cols[String(v[1]).toLowerCase()] = { notnull: v[3], pk: v[5] }; });
                    if (!cols.id || cols.id.pk !== 1) return false;
                    if (!cols.obra_id || cols.obra_id.notnull !== 1) return false;
                    if (!cols.mes || cols.mes.notnull !== 1) return false;
                    if (!cols.percentual_concluido) return false;
                    const sql = db.exec("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'medicoes'")[0].values[0][0];
                    return /check\s*\(/i.test(sql);
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Responsável pela Medição",
            concept: "ALTER TABLE",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "<code>ALTER TABLE tabela ADD COLUMN coluna TIPO</code> acrescenta uma coluna sem apagar os dados existentes (as linhas antigas ficam com <code>NULL</code> nela). No SQL Server a sintaxe é <code>ALTER TABLE tabela ADD coluna TIPO</code>, sem a palavra COLUMN. Rodar duas vezes dá erro de coluna duplicada.",
            task: "Adicione à tabela <code>medicoes</code> (criada na lição anterior) a coluna <code>responsavel</code> do tipo TEXT.",
            startCode: "ALTER TABLE medicoes\n... ;",
            solution: "ALTER TABLE medicoes\nADD COLUMN responsavel TEXT;",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info(medicoes)");
                    return info.length > 0 && info[0].values.some(v => String(v[1]).toLowerCase() === 'responsavel');
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "Visão de Alocação da Equipe",
            concept: "CREATE VIEW",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "Uma <code>VIEW</code> é uma consulta salva com nome, que se usa como se fosse uma tabela. Ela esconde JOINs repetitivos e padroniza relatórios. Para alterar uma view, apague com <code>DROP VIEW IF EXISTS</code> e crie de novo (no SQL Server existe <code>CREATE OR ALTER VIEW</code>).",
            task: "Crie a view <code>vw_alocacao</code> com <code>f.nome</code>, <code>f.cargo</code>, <code>o.nome_empreendimento</code> e <code>o.cidade</code> (JOIN de <code>funcionarios</code> com <code>obras</code>). Depois selecione tudo da view apenas onde <code>cidade</code> = 'São Paulo'.",
            startCode: "CREATE VIEW IF NOT EXISTS vw_alocacao AS\nSELECT ...\nFROM funcionarios f\nJOIN obras o ON ...;\n\nSELECT * FROM vw_alocacao WHERE ;",
            solution: "CREATE VIEW IF NOT EXISTS vw_alocacao AS\nSELECT f.nome, f.cargo, o.nome_empreendimento, o.cidade\nFROM funcionarios f\nJOIN obras o ON f.obra_id = o.id;\n\nSELECT * FROM vw_alocacao WHERE cidade = 'São Paulo';",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'vw_alocacao'");
                    if (!v.length || !v[0].values.length) return false;
                } catch (e) { return false; }
                return sameResult(res, "SELECT f.nome, f.cargo, o.nome_empreendimento, o.cidade FROM funcionarios f JOIN obras o ON f.obra_id = o.id WHERE o.cidade = 'São Paulo'");
            }
        },
        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Comprometimento do Orçamento",
            concept: "CTE + LEFT JOIN",
            icon: '<i class="ph-fill ph-target"></i>',
            theory: "Desafio da diretoria: combine CTEs para pré-calcular totais, <code>LEFT JOIN</code> para não perder obras sem lançamentos e <code>COALESCE</code> para transformar ausência em zero. Para percentuais, multiplique por <code>100.0</code> para forçar divisão decimal (no SQLite e no SQL Server, inteiro / inteiro descarta as casas).",
            task: "A diretoria quer saber, para cada obra que NÃO está 'Concluído': <code>nome_empreendimento</code>, <code>orcamento</code>, custo total de materiais (<code>custo_materiais</code>, 0 se não houver), folha mensal (<code>folha_mensal</code>, 0 se não houver) e o percentual do orçamento já gasto em materiais (<code>pct_materiais</code>, arredondado a 2 casas). Ordene por <code>pct_materiais</code> decrescente e, em empate, por <code>nome_empreendimento</code>.",
            startCode: "WITH mat AS (\n    SELECT obra_id, ... AS custo_materiais\n    FROM materiais\n    GROUP BY obra_id\n),\nfolha AS (\n    SELECT obra_id, ... AS folha_mensal\n    FROM funcionarios\n    GROUP BY obra_id\n)\nSELECT ...\nFROM obras o\nLEFT JOIN mat m ON \nLEFT JOIN folha f ON \nWHERE \nORDER BY ;",
            solution: "WITH mat AS (\n    SELECT obra_id, SUM(custo_unidade * quantidade) AS custo_materiais\n    FROM materiais\n    GROUP BY obra_id\n),\nfolha AS (\n    SELECT obra_id, SUM(salario) AS folha_mensal\n    FROM funcionarios\n    GROUP BY obra_id\n)\nSELECT o.nome_empreendimento,\n    o.orcamento,\n    COALESCE(m.custo_materiais, 0) AS custo_materiais,\n    COALESCE(f.folha_mensal, 0) AS folha_mensal,\n    ROUND(100.0 * COALESCE(m.custo_materiais, 0) / o.orcamento, 2) AS pct_materiais\nFROM obras o\nLEFT JOIN mat m ON m.obra_id = o.id\nLEFT JOIN folha f ON f.obra_id = o.id\nWHERE o.status <> 'Concluído'\nORDER BY pct_materiais DESC, o.nome_empreendimento;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, o.orcamento, IFNULL((SELECT SUM(custo_unidade * quantidade) FROM materiais WHERE obra_id = o.id), 0) AS cm, IFNULL((SELECT SUM(salario) FROM funcionarios WHERE obra_id = o.id), 0), ROUND(100.0 * IFNULL((SELECT SUM(custo_unidade * quantidade) FROM materiais WHERE obra_id = o.id), 0) / o.orcamento, 2) AS p FROM obras o WHERE o.status <> 'Concluído' ORDER BY p DESC, o.nome_empreendimento", { ordered: true, columns: ['custo_materiais', 'folha_mensal', 'pct_materiais'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Maior Salário de Cada Canteiro",
            concept: "Ranking por grupo",
            icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "Para pegar o \"top 1 de cada grupo\", numere as linhas com <code>ROW_NUMBER() OVER (PARTITION BY grupo ORDER BY valor DESC)</code> dentro de uma CTE e filtre <code>WHERE posicao = 1</code> na consulta de fora (window functions não podem ir direto no <code>WHERE</code>). Funciona igual no SQL Server.",
            task: "O RH quer o funcionário mais bem pago de cada obra: mostre <code>nome_empreendimento</code>, <code>nome</code>, <code>cargo</code> e <code>salario</code>, somente funcionários alocados em obras, ordenado por <code>salario</code> decrescente.",
            startCode: "WITH ranking AS (\n    SELECT f.*,\n        ROW_NUMBER() OVER (PARTITION BY  ORDER BY ) AS posicao\n    FROM funcionarios f\n)\nSELECT ...\nFROM ranking r\nJOIN obras o ON \nWHERE \nORDER BY ;",
            solution: "WITH ranking AS (\n    SELECT f.*,\n        ROW_NUMBER() OVER (PARTITION BY f.obra_id ORDER BY f.salario DESC) AS posicao\n    FROM funcionarios f\n)\nSELECT o.nome_empreendimento, r.nome, r.cargo, r.salario\nFROM ranking r\nJOIN obras o ON o.id = r.obra_id\nWHERE r.posicao = 1\nORDER BY r.salario DESC;",
            validator: (res) => sameResult(res, "SELECT o.nome_empreendimento, f.nome, f.cargo, f.salario FROM funcionarios f JOIN obras o ON o.id = f.obra_id WHERE f.salario = (SELECT MAX(salario) FROM funcionarios WHERE obra_id = f.obra_id) ORDER BY f.salario DESC", { ordered: true })
        },
        {
            id: 127, moduleId: 15,
            title: "Curva de Compras por Faixa",
            concept: "CASE + GROUP BY + HAVING",
            icon: '<i class="ph-fill ph-coins"></i>',
            theory: "Relatórios gerenciais costumam classificar itens em faixas com <code>CASE WHEN</code>, agrupar pela faixa e mostrar só os grupos relevantes com <code>HAVING</code>. No SQLite dá para agrupar pelo apelido da coluna; no SQL Server é preciso repetir a expressão do <code>CASE</code> no <code>GROUP BY</code> (ou usar uma CTE).",
            task: "Classifique cada compra pelo custo total (<code>custo_unidade * quantidade</code>) em <code>faixa</code>: 'Alto' se &gt;= 30000, 'Médio' se &gt;= 10000, senão 'Baixo'. Mostre <code>faixa</code>, a quantidade de itens (<code>itens</code>) e a soma dos custos (<code>valor_total</code>), apenas para faixas com pelo menos 2 itens, ordenado por <code>valor_total</code> decrescente.",
            startCode: "SELECT\n    CASE\n        WHEN  THEN 'Alto'\n        WHEN  THEN 'Médio'\n        ELSE 'Baixo'\n    END AS faixa,\n    ... AS itens,\n    ... AS valor_total\nFROM materiais\nGROUP BY \nHAVING \nORDER BY ;",
            solution: "SELECT\n    CASE\n        WHEN custo_unidade * quantidade >= 30000 THEN 'Alto'\n        WHEN custo_unidade * quantidade >= 10000 THEN 'Médio'\n        ELSE 'Baixo'\n    END AS faixa,\n    COUNT(*) AS itens,\n    SUM(custo_unidade * quantidade) AS valor_total\nFROM materiais\nGROUP BY faixa\nHAVING COUNT(*) >= 2\nORDER BY valor_total DESC;",
            validator: (res) => sameResult(res, "WITH c AS (SELECT custo_unidade * quantidade AS v FROM materiais), f AS (SELECT CASE WHEN v >= 30000 THEN 'Alto' WHEN v >= 10000 THEN 'Médio' ELSE 'Baixo' END AS fx, v FROM c) SELECT fx, COUNT(*), SUM(v) AS t FROM f GROUP BY fx HAVING COUNT(*) >= 2 ORDER BY t DESC", { ordered: true, columns: ['faixa', 'itens', 'valor_total'] })
        }
    ]
};

extraLessons.varejo = {
    setup: `
        INSERT INTO produtos VALUES (6, 'Garrafa Térmica', 'Acessórios', NULL, 90), (7, 'Corrente Reforçada', 'Peças', 'Prata', 120), (8, 'Bicicleta Infantil', 'Bicicletas', 'Verde', 900);
        INSERT INTO vendedores VALUES (4, 'Mariana Lopes', 'Brasil', NULL), (5, 'Pedro Alves', 'Europa', 40000);
        INSERT INTO vendas VALUES (6, 1, 3, 1, '2024-02-10'), (7, 2, 1, 4, '2024-02-12'), (8, 6, 5, 6, '2024-02-15'), (9, 8, 2, 2, '2024-03-01'), (10, 4, 3, 2, '2024-03-05'), (11, 7, 5, 3, '2024-03-10'), (12, 2, 3, 2, '2024-03-18'), (13, 1, 2, 1, '2024-03-20'), (14, 3, 3, 5, '2024-03-25'), (15, 1, 1, 1, '2024-03-28');
    `,
    lessons: [
        // ---------- Módulo 1 ----------
        {
            id: 100, moduleId: 1, after: 2,
            title: "Preço Promocional da Black Friday",
            concept: "Coluna calculada + AS",
            icon: '<i class="ph-fill ph-calculator"></i>',
            theory: "Você pode fazer contas direto no <code>SELECT</code>: <code>preco * 0.9</code> cria uma coluna nova que não existe na tabela. Use <code>AS</code> para dar um nome (apelido) a essa coluna calculada. É assim que se simulam descontos, impostos e margens sem alterar os dados.",
            task: "Liste <code>nome</code>, <code>preco</code> e o preço com 10% de desconto (<code>preco * 0.9</code>) com o apelido <code>preco_promocional</code>, para todos os <code>produtos</code>.",
            startCode: "SELECT \n    nome,\n    preco,\n    ... AS preco_promocional\nFROM produtos;",
            solution: "SELECT\n    nome,\n    preco,\n    preco * 0.9 AS preco_promocional\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT nome, preco, preco * 0.9 AS preco_promocional FROM produtos", { columns: ['nome', 'preco', 'preco_promocional'] })
        },
        // ---------- Módulo 2 ----------
        {
            id: 101, moduleId: 2, after: 4,
            title: "Linha de Bicicletas pelo Nome",
            concept: "LIKE",
            icon: '<i class="ph-fill ph-magnifying-glass"></i>',
            theory: "<code>LIKE</code> busca padrões de texto: <code>%</code> representa qualquer sequência de caracteres e <code>_</code> exatamente um caractere. <code>'Bicicleta%'</code> encontra tudo que começa com 'Bicicleta'. No SQLite o <code>LIKE</code> não diferencia maiúsculas de minúsculas (em letras sem acento); no SQL Server isso depende do <i>collation</i>.",
            task: "Liste <code>nome</code> e <code>preco</code> dos <code>produtos</code> cujo <code>nome</code> começa com 'Bicicleta'.",
            startCode: "SELECT nome, preco\nFROM produtos\nWHERE nome LIKE '';",
            solution: "SELECT\n    nome,\n    preco\nFROM produtos\nWHERE nome LIKE 'Bicicleta%';",
            validator: (res) => sameResult(res, "SELECT nome, preco FROM produtos WHERE nome LIKE 'Bicicleta%'")
        },
        {
            id: 102, moduleId: 2, after: 4,
            title: "Vendas de Europa e EUA no 1º Tri",
            concept: "IN / BETWEEN",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>IN (a, b, c)</code> substitui vários <code>OR</code> sobre a mesma coluna. <code>BETWEEN x AND y</code> filtra uma faixa <b>incluindo</b> as pontas, e funciona com números e com datas no formato 'AAAA-MM-DD'. Os dois juntos deixam filtros de relatório curtos e legíveis.",
            task: "Liste <code>id</code>, <code>vendedor_id</code>, <code>quantidade</code> e <code>data</code> das <code>vendas</code> feitas pelos vendedores de id 2 ou 3 (use <code>IN</code>) com <code>data</code> entre '2024-02-01' e '2024-03-31' (use <code>BETWEEN</code>).",
            startCode: "SELECT id, vendedor_id, quantidade, data\nFROM vendas\nWHERE vendedor_id IN ()\n  AND data BETWEEN '' AND '';",
            solution: "SELECT\n    id,\n    vendedor_id,\n    quantidade,\n    data\nFROM vendas\nWHERE vendedor_id IN (2, 3)\n    AND data BETWEEN '2024-02-01' AND '2024-03-31';",
            validator: (res) => sameResult(res, "SELECT id, vendedor_id, quantidade, data FROM vendas WHERE vendedor_id IN (2, 3) AND data BETWEEN '2024-02-01' AND '2024-03-31'")
        },
        // ---------- Módulo 3 ----------
        {
            id: 103, moduleId: 3, after: 9,
            title: "Faixa de Preços do Catálogo",
            concept: "AVG / MIN / MAX",
            icon: '<i class="ph-fill ph-chart-bar"></i>',
            theory: "<code>MIN()</code> e <code>MAX()</code> trazem o menor e o maior valor de uma coluna, e <code>AVG()</code> a média. Vários agregados podem aparecer no mesmo <code>SELECT</code>, gerando um resumo de uma linha só — ótimo para um painel rápido do catálogo.",
            task: "Em uma única consulta sobre <code>produtos</code>, traga o menor preço como <code>menor_preco</code>, o maior como <code>maior_preco</code> e a média como <code>preco_medio</code>.",
            startCode: "SELECT \n    MIN() AS menor_preco,\n    MAX() AS maior_preco,\n    AVG() AS preco_medio\nFROM produtos;",
            solution: "SELECT\n    MIN(preco) AS menor_preco,\n    MAX(preco) AS maior_preco,\n    AVG(preco) AS preco_medio\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT MIN(preco) AS menor_preco, MAX(preco) AS maior_preco, AVG(preco) AS preco_medio FROM produtos", { columns: ['menor_preco', 'maior_preco', 'preco_medio'] })
        },
        // ---------- Módulo 4 ----------
        {
            id: 104, moduleId: 4, after: 11,
            title: "Unidades Vendidas por Categoria",
            concept: "JOIN + GROUP BY",
            icon: '<i class="ph-fill ph-stack"></i>',
            theory: "Depois de ligar tabelas com <code>JOIN</code>, você pode agrupar pelo atributo de uma tabela e somar valores da outra. Aqui a categoria está em <code>produtos</code> e a quantidade em <code>vendas</code>: o <code>JOIN</code> junta as duas e o <code>GROUP BY</code> consolida.",
            task: "Mostre a <code>categoria</code> do produto e a soma de <code>quantidade</code> vendida como <code>total_unidades</code>, agrupando por categoria e ordenando por <code>total_unidades</code> do maior para o menor.",
            startCode: "SELECT produtos.categoria, ... AS total_unidades\nFROM vendas\nJOIN produtos ON \nGROUP BY \nORDER BY ;",
            solution: "SELECT\n    p.categoria,\n    SUM(v.quantidade) AS total_unidades\nFROM vendas v\nJOIN produtos p ON v.produto_id = p.id\nGROUP BY p.categoria\nORDER BY total_unidades DESC;",
            validator: (res) => sameResult(res, "SELECT p.categoria, SUM(v.quantidade) AS total_unidades FROM vendas v JOIN produtos p ON v.produto_id = p.id GROUP BY p.categoria ORDER BY total_unidades DESC", { ordered: true, columns: ['categoria', 'total_unidades'] })
        },
        // ---------- Módulo 5 ----------
        {
            id: 105, moduleId: 5, after: 13,
            title: "Reajuste de 10% nos Acessórios",
            concept: "UPDATE com cálculo",
            icon: '<i class="ph-fill ph-percent"></i>',
            theory: "O <code>SET</code> aceita expressões que usam o valor atual da coluna: <code>SET preco = preco * 1.10</code> reajusta cada linha com base no seu próprio preço. O <code>WHERE</code> é o que limita o reajuste a um grupo — sem ele, o catálogo inteiro muda! Use <code>ROUND()</code> para manter preços inteiros.",
            task: "Aumente em 10% o <code>preco</code> de todos os produtos da <code>categoria</code> 'Acessórios', arredondando com <code>ROUND(preco * 1.10)</code>. Depois liste <code>nome</code> e <code>preco</code> dos Acessórios. (Execute apenas uma vez!)",
            startCode: "UPDATE produtos\nSET preco = \nWHERE categoria = ;\n\nSELECT nome, preco FROM produtos WHERE categoria = 'Acessórios';",
            solution: "UPDATE produtos\nSET preco = ROUND(preco * 1.10)\nWHERE categoria = 'Acessórios';\n\nSELECT\n    nome,\n    preco\nFROM produtos\nWHERE categoria = 'Acessórios';",
            validator: (res) => {
                try {
                    const get = (id) => { const r = db.exec("SELECT preco FROM produtos WHERE id = " + id); return r.length ? r[0].values[0][0] : null; };
                    return get(2) >= 165 && get(5) >= 66 && get(1) === 2500 && get(3) === 80 && get(4) === 1800;
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 6 ----------
        {
            id: 106, moduleId: 6, after: 15,
            title: "Faturamento por Vendedor com CTE",
            concept: "CTE (WITH)",
            icon: '<i class="ph-fill ph-tree-structure"></i>',
            theory: "Uma CTE (<code>WITH nome AS (...)</code>) é uma consulta temporária com nome, usada logo em seguida como se fosse uma tabela. Ela quebra relatórios complexos em etapas legíveis: primeiro calcula, depois junta e filtra. A sintaxe é igual no SQL Server.",
            task: "Crie uma CTE chamada <code>faturamento</code> que calcule, por <code>vendedor_id</code>, a soma de <code>quantidade * preco</code> como <code>total</code> (JOIN de <code>vendas</code> com <code>produtos</code>). Depois junte com <code>vendedores</code> e mostre <code>nome</code> e <code>total</code>, ordenado por <code>total</code> decrescente.",
            startCode: "WITH faturamento AS (\n    SELECT \n        vendedor_id,\n        ... AS total\n    FROM vendas\n    JOIN produtos ON \n    GROUP BY \n)\nSELECT \nFROM faturamento\nJOIN vendedores ON \nORDER BY ;",
            solution: "WITH faturamento AS (\n    SELECT\n        v.vendedor_id,\n        SUM(v.quantidade * p.preco) AS total\n    FROM vendas v\n    JOIN produtos p ON v.produto_id = p.id\n    GROUP BY v.vendedor_id\n)\nSELECT\n    ve.nome,\n    f.total\nFROM faturamento f\nJOIN vendedores ve ON ve.id = f.vendedor_id\nORDER BY f.total DESC;",
            validator: (res) => sameResult(res, "SELECT ve.nome, SUM(v.quantidade * p.preco) AS total FROM vendas v JOIN produtos p ON v.produto_id = p.id JOIN vendedores ve ON ve.id = v.vendedor_id GROUP BY ve.id, ve.nome ORDER BY total DESC", { ordered: true, columns: ['nome', 'total'] })
        },
        {
            id: 107, moduleId: 6, after: 15,
            title: "Produtos com Vendas em Volume",
            concept: "EXISTS",
            icon: '<i class="ph-fill ph-magnifying-glass-plus"></i>',
            theory: "<code>EXISTS (subquery)</code> é verdadeiro quando a subquery retorna pelo menos uma linha. A subquery é <b>correlacionada</b>: ela usa a coluna da consulta de fora (<code>p.id</code>) e roda para cada produto. É a forma clássica de perguntar \"existe alguma venda que...?\" sem duplicar linhas como um JOIN faria.",
            task: "Liste o <code>nome</code> dos <code>produtos</code> para os quais EXISTE ao menos uma venda com <code>quantidade</code> maior ou igual a 3.",
            startCode: "SELECT nome\nFROM produtos p\nWHERE EXISTS (\n    SELECT 1\n    FROM vendas v\n    WHERE \n);",
            solution: "SELECT p.nome\nFROM produtos p\nWHERE EXISTS (\n    SELECT 1\n    FROM vendas v\n    WHERE v.produto_id = p.id\n        AND v.quantidade >= 3\n);",
            validator: (res) => sameResult(res, "SELECT p.nome FROM produtos p WHERE EXISTS (SELECT 1 FROM vendas v WHERE v.produto_id = p.id AND v.quantidade >= 3)")
        },
        // ---------- Módulo 7 ----------
        {
            id: 108, moduleId: 7, after: 16,
            title: "Sequência de Vendas de Cada Vendedor",
            concept: "ROW_NUMBER + PARTITION BY",
            icon: '<i class="ph-fill ph-list-numbers"></i>',
            theory: "<code>ROW_NUMBER()</code> numera as linhas 1, 2, 3... e <code>PARTITION BY</code> faz a contagem recomeçar a cada grupo. Com <code>ORDER BY data</code> dentro do <code>OVER</code>, você sabe qual foi a 1ª, 2ª, 3ª venda de cada vendedor — base para achar a primeira compra, a última, etc.",
            task: "Para cada venda, mostre <code>vendedor_id</code>, <code>id</code>, <code>data</code> e a numeração da venda dentro de cada vendedor, em ordem de <code>data</code>, com o apelido <code>ordem</code>.",
            startCode: "SELECT \n    vendedor_id,\n    id,\n    data,\n    ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS ordem\nFROM vendas;",
            solution: "SELECT\n    vendedor_id,\n    id,\n    data,\n    ROW_NUMBER() OVER (PARTITION BY vendedor_id ORDER BY data) AS ordem\nFROM vendas;",
            validator: (res) => sameResult(res, "SELECT vendedor_id, id, data, ROW_NUMBER() OVER (PARTITION BY vendedor_id ORDER BY data) AS ordem FROM vendas", { columns: ['ordem'] })
        },
        {
            id: 109, moduleId: 7, after: 16,
            title: "Unidades Acumuladas no Período",
            concept: "SUM() OVER (acumulado)",
            icon: '<i class="ph-fill ph-chart-line-up"></i>',
            theory: "<code>SUM(coluna) OVER (ORDER BY data)</code> gera um total acumulado (<i>running total</i>): cada linha mostra a soma de tudo até ela, sem agrupar as linhas. É o gráfico clássico de \"vendas acumuladas no mês\". Funciona igual no SQL Server.",
            task: "Mostre <code>data</code>, <code>quantidade</code> e o total acumulado de quantidade ao longo das datas como <code>acumulado</code>, ordenando o resultado por <code>data</code>.",
            startCode: "SELECT \n    data,\n    quantidade,\n    SUM() OVER () AS acumulado\nFROM vendas\nORDER BY ;",
            solution: "SELECT\n    data,\n    quantidade,\n    SUM(quantidade) OVER (ORDER BY data) AS acumulado\nFROM vendas\nORDER BY data;",
            validator: (res) => sameResult(res, "SELECT data, quantidade, SUM(quantidade) OVER (ORDER BY data) AS acumulado FROM vendas ORDER BY data", { ordered: true, columns: ['acumulado'] })
        },
        // ---------- Módulo 8 ----------
        {
            id: 110, moduleId: 8, after: 17,
            title: "Unidades por Mês para Cada Vendedor",
            concept: "SUM(CASE WHEN)",
            icon: '<i class="ph-fill ph-columns"></i>',
            theory: "Colocar um <code>CASE WHEN</code> dentro de um <code>SUM()</code> soma apenas as linhas que atendem à condição — é a agregação condicional. Assim você \"vira\" meses em colunas (um pivot) num único <code>GROUP BY</code>. No SQL Server dá para usar <code>MONTH(data)</code> no lugar de <code>STRFTIME('%m', data)</code>.",
            task: "Por <code>vendedor_id</code>, mostre as unidades vendidas em janeiro como <code>jan</code>, fevereiro como <code>fev</code> e março como <code>mar</code>, usando <code>SUM(CASE WHEN STRFTIME('%m', data) = '01' THEN quantidade ELSE 0 END)</code> e similares. Ordene por <code>vendedor_id</code>.",
            startCode: "SELECT \n    vendedor_id,\n    SUM(CASE WHEN ... THEN quantidade ELSE 0 END) AS jan,\n    SUM(CASE WHEN ... THEN quantidade ELSE 0 END) AS fev,\n    SUM(CASE WHEN ... THEN quantidade ELSE 0 END) AS mar\nFROM vendas\nGROUP BY \nORDER BY ;",
            solution: "SELECT\n    vendedor_id,\n    SUM(CASE WHEN STRFTIME('%m', data) = '01' THEN quantidade ELSE 0 END) AS jan,\n    SUM(CASE WHEN STRFTIME('%m', data) = '02' THEN quantidade ELSE 0 END) AS fev,\n    SUM(CASE WHEN STRFTIME('%m', data) = '03' THEN quantidade ELSE 0 END) AS mar\nFROM vendas\nGROUP BY vendedor_id\nORDER BY vendedor_id;",
            validator: (res) => sameResult(res, "SELECT vendedor_id, SUM(CASE WHEN STRFTIME('%m', data) = '01' THEN quantidade ELSE 0 END) AS jan, SUM(CASE WHEN STRFTIME('%m', data) = '02' THEN quantidade ELSE 0 END) AS fev, SUM(CASE WHEN STRFTIME('%m', data) = '03' THEN quantidade ELSE 0 END) AS mar FROM vendas GROUP BY vendedor_id ORDER BY vendedor_id", { ordered: true, columns: ['jan', 'fev', 'mar'] })
        },
        // ---------- Módulo 10 ----------
        {
            id: 111, moduleId: 10, after: 22,
            title: "O Índice de Data Está Sendo Usado?",
            concept: "EXPLAIN QUERY PLAN",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "<code>EXPLAIN QUERY PLAN</code> antes de um <code>SELECT</code> mostra como o SQLite vai executar a consulta: na coluna <code>detail</code>, <i>SCAN</i> indica leitura da tabela inteira e <i>SEARCH ... USING INDEX</i> indica uso de índice. No SQL Server o equivalente é o <i>Plano de Execução</i> (Ctrl+L no SSMS) ou <code>SET SHOWPLAN_TEXT ON</code>.",
            task: "Use <code>EXPLAIN QUERY PLAN</code> para ver o plano de: <code>SELECT * FROM vendas WHERE data = '2024-03-01'</code>.",
            startCode: "EXPLAIN QUERY PLAN\nSELECT *\nFROM vendas\nWHERE ;",
            solution: "EXPLAIN QUERY PLAN\nSELECT *\nFROM vendas\nWHERE data = '2024-03-01';",
            validator: (res) => !!(res && res.length && res[res.length - 1].columns.includes('detail'))
        },
        {
            id: 112, moduleId: 10, after: 22,
            title: "Removendo um Índice Desnecessário",
            concept: "DROP INDEX",
            icon: '<i class="ph-fill ph-wrench"></i>',
            theory: "Índices aceleram leituras, mas ocupam espaço e deixam <code>INSERT</code>/<code>UPDATE</code> mais lentos. Quando um índice não ajuda, remova-o com <code>DROP INDEX IF EXISTS nome</code> — o <code>IF EXISTS</code> evita erro se ele já não existir. No SQL Server a sintaxe é <code>DROP INDEX nome ON tabela</code>.",
            task: "Crie o índice <code>idx_vendas_vendedor</code> em <code>vendas(vendedor_id)</code> (com <code>IF NOT EXISTS</code>), depois remova-o com <code>DROP INDEX IF EXISTS</code> e por fim confirme com <code>SELECT COUNT(*) AS indices FROM sqlite_master WHERE type = 'index' AND name = 'idx_vendas_vendedor';</code>",
            startCode: "CREATE INDEX IF NOT EXISTS idx_vendas_vendedor ON vendas(...);\n\nDROP INDEX ...;\n\nSELECT COUNT(*) AS indices\nFROM sqlite_master\nWHERE type = 'index' AND name = 'idx_vendas_vendedor';",
            solution: "CREATE INDEX IF NOT EXISTS idx_vendas_vendedor ON vendas(vendedor_id);\n\nDROP INDEX IF EXISTS idx_vendas_vendedor;\n\nSELECT COUNT(*) AS indices\nFROM sqlite_master\nWHERE type = 'index'\n    AND name = 'idx_vendas_vendedor';",
            validator: (res) => {
                try {
                    const left = db.exec("SELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND name = 'idx_vendas_vendedor'")[0].values[0][0];
                    return left === 0 && sameResult(res, "SELECT 0 AS indices", { columns: ['indices'] });
                } catch (e) { return false; }
            }
        },
        // ---------- Módulo 11: Agregações Avançadas ----------
        {
            id: 113, moduleId: 11,
            title: "Vendedores com 3 Vendas ou Mais",
            concept: "HAVING",
            icon: '<i class="ph-fill ph-funnel"></i>',
            theory: "<code>WHERE</code> filtra linhas <b>antes</b> do agrupamento; <code>HAVING</code> filtra os <b>grupos</b> depois do <code>GROUP BY</code>, e por isso pode usar agregados como <code>COUNT(*)</code>. Use-o para perguntas como \"quais vendedores fizeram pelo menos N vendas?\".",
            task: "Mostre o <code>nome</code> do vendedor e a quantidade de vendas como <code>qtd_vendas</code>, apenas para os vendedores com 3 ou mais vendas (JOIN de <code>vendas</code> com <code>vendedores</code>).",
            startCode: "SELECT ve.nome, ... AS qtd_vendas\nFROM vendas v\nJOIN vendedores ve ON \nGROUP BY \nHAVING ;",
            solution: "SELECT\n    ve.nome,\n    COUNT(*) AS qtd_vendas\nFROM vendas v\nJOIN vendedores ve ON v.vendedor_id = ve.id\nGROUP BY ve.id, ve.nome\nHAVING COUNT(*) >= 3;",
            validator: (res) => sameResult(res, "SELECT ve.nome, COUNT(*) AS qtd_vendas FROM vendas v JOIN vendedores ve ON v.vendedor_id = ve.id GROUP BY ve.id, ve.nome HAVING COUNT(*) >= 3", { columns: ['nome', 'qtd_vendas'] })
        },
        {
            id: 114, moduleId: 11,
            title: "Mix de Produtos por Vendedor",
            concept: "COUNT(DISTINCT)",
            icon: '<i class="ph-fill ph-hash"></i>',
            theory: "<code>COUNT(coluna)</code> conta todas as ocorrências; <code>COUNT(DISTINCT coluna)</code> conta só os valores diferentes. Se um vendedor vendeu a mesma bicicleta duas vezes, ela conta uma vez só no mix. Funciona igual no SQL Server.",
            task: "Por <code>vendedor_id</code>, mostre quantos produtos DIFERENTES ele vendeu, com o apelido <code>produtos_distintos</code>.",
            startCode: "SELECT \n    vendedor_id,\n    COUNT() AS produtos_distintos\nFROM vendas\nGROUP BY ;",
            solution: "SELECT\n    vendedor_id,\n    COUNT(DISTINCT produto_id) AS produtos_distintos\nFROM vendas\nGROUP BY vendedor_id;",
            validator: (res) => sameResult(res, "SELECT vendedor_id, COUNT(DISTINCT produto_id) AS produtos_distintos FROM vendas GROUP BY vendedor_id", { columns: ['produtos_distintos'] })
        },
        {
            id: 115, moduleId: 11,
            title: "Tamanho Médio do Pedido por Categoria e Território",
            concept: "GROUP BY múltiplo + ROUND",
            icon: '<i class="ph-fill ph-table"></i>',
            theory: "<code>GROUP BY</code> aceita várias colunas: cada combinação diferente (categoria + território) vira um grupo. <code>ROUND(AVG(x), 2)</code> arredonda a média para 2 casas decimais. Atenção: no SQL Server, <code>AVG</code> de coluna inteira devolve inteiro — use <code>AVG(x * 1.0)</code> lá.",
            task: "Juntando <code>vendas</code>, <code>produtos</code> e <code>vendedores</code>, mostre <code>categoria</code>, <code>territorio</code> e a média de <code>quantidade</code> por venda arredondada a 2 casas como <code>media_unidades</code>, agrupando por categoria e território.",
            startCode: "SELECT \n    p.categoria,\n    ve.territorio,\n    ... AS media_unidades\nFROM vendas v\nJOIN produtos p ON \nJOIN vendedores ve ON \nGROUP BY ;",
            solution: "SELECT\n    p.categoria,\n    ve.territorio,\n    ROUND(AVG(v.quantidade), 2) AS media_unidades\nFROM vendas v\nJOIN produtos p ON v.produto_id = p.id\nJOIN vendedores ve ON v.vendedor_id = ve.id\nGROUP BY p.categoria, ve.territorio;",
            validator: (res) => sameResult(res, "SELECT p.categoria, ve.territorio, ROUND(AVG(v.quantidade), 2) AS media_unidades FROM vendas v JOIN produtos p ON v.produto_id = p.id JOIN vendedores ve ON v.vendedor_id = ve.id GROUP BY p.categoria, ve.territorio", { columns: ['categoria', 'territorio', 'media_unidades'] })
        },
        // ---------- Módulo 12: JOINs Avançados ----------
        {
            id: 116, moduleId: 12,
            title: "Todos os Vendedores, Mesmo Sem Vendas",
            concept: "LEFT JOIN",
            icon: '<i class="ph-fill ph-link"></i>',
            theory: "O <code>INNER JOIN</code> descarta quem não tem par; o <code>LEFT JOIN</code> mantém <b>todas</b> as linhas da tabela da esquerda e preenche com <code>NULL</code> o que faltar. Com <code>COUNT(v.id)</code> (e não <code>COUNT(*)</code>), quem não vendeu aparece com 0.",
            task: "Liste o <code>nome</code> de TODOS os vendedores e a quantidade de vendas de cada um como <code>qtd_vendas</code> (vendedores sem vendas devem aparecer com 0). Use <code>vendedores LEFT JOIN vendas</code>.",
            startCode: "SELECT ve.nome, ... AS qtd_vendas\nFROM vendedores ve\nLEFT JOIN vendas v ON \nGROUP BY ;",
            solution: "SELECT\n    ve.nome,\n    COUNT(v.id) AS qtd_vendas\nFROM vendedores ve\nLEFT JOIN vendas v ON v.vendedor_id = ve.id\nGROUP BY ve.id, ve.nome;",
            validator: (res) => sameResult(res, "SELECT ve.nome, COUNT(v.id) AS qtd_vendas FROM vendedores ve LEFT JOIN vendas v ON v.vendedor_id = ve.id GROUP BY ve.id, ve.nome", { columns: ['nome', 'qtd_vendas'] })
        },
        {
            id: 117, moduleId: 12,
            title: "Produtos Encalhados",
            concept: "Anti-join (IS NULL)",
            icon: '<i class="ph-fill ph-link-break"></i>',
            theory: "Para achar registros <b>sem</b> correspondência, faça <code>LEFT JOIN</code> e filtre <code>WHERE tabela_direita.id IS NULL</code>: só sobram as linhas da esquerda que não encontraram par. É o famoso anti-join — ideal para produtos que nunca venderam, clientes inativos etc.",
            task: "Liste o <code>nome</code> dos <code>produtos</code> que NUNCA foram vendidos, usando <code>LEFT JOIN vendas</code> e <code>IS NULL</code>.",
            startCode: "SELECT p.nome\nFROM produtos p\nLEFT JOIN vendas v ON \nWHERE ;",
            solution: "SELECT p.nome\nFROM produtos p\nLEFT JOIN vendas v ON v.produto_id = p.id\nWHERE v.id IS NULL;",
            validator: (res) => sameResult(res, "SELECT p.nome FROM produtos p LEFT JOIN vendas v ON v.produto_id = p.id WHERE v.id IS NULL")
        },
        {
            id: 118, moduleId: 12,
            title: "Duplas de Vendedores no Mesmo Território",
            concept: "Self-join",
            icon: '<i class="ph-fill ph-users"></i>',
            theory: "Um self-join junta a tabela com ela mesma usando dois apelidos (<code>a</code> e <code>b</code>). Para formar pares sem repetir (Ana–Pedro e Pedro–Ana) e sem parear alguém consigo mesmo, use <code>a.id &lt; b.id</code> na condição. Útil para montar duplas, comparar itens do mesmo grupo etc.",
            task: "Liste os pares de vendedores do mesmo <code>territorio</code>: <code>a.nome</code> como <code>vendedor_1</code>, <code>b.nome</code> como <code>vendedor_2</code> e o <code>territorio</code>, sem pares repetidos (use <code>a.id &lt; b.id</code>).",
            startCode: "SELECT \n    a.nome AS vendedor_1,\n    b.nome AS vendedor_2,\n    a.territorio\nFROM vendedores a\nJOIN vendedores b ON ;",
            solution: "SELECT\n    a.nome AS vendedor_1,\n    b.nome AS vendedor_2,\n    a.territorio\nFROM vendedores a\nJOIN vendedores b ON a.territorio = b.territorio\n    AND a.id < b.id;",
            validator: (res) => sameResult(res, "SELECT a.nome AS vendedor_1, b.nome AS vendedor_2, a.territorio FROM vendedores a JOIN vendedores b ON a.territorio = b.territorio AND a.id < b.id", { columns: ['vendedor_1', 'vendedor_2', 'territorio'] })
        },
        // ---------- Módulo 13: Nulos & Conjuntos ----------
        {
            id: 119, moduleId: 13,
            title: "Produtos Sem Cor Cadastrada",
            concept: "IS NULL",
            icon: '<i class="ph-fill ph-warning-circle"></i>',
            theory: "<code>NULL</code> significa \"valor desconhecido\" e nunca é igual a nada — nem a outro NULL. Por isso <code>cor = NULL</code> não retorna linhas; o certo é <code>cor IS NULL</code> (ou <code>IS NOT NULL</code> para o contrário). Vale igual no SQL Server.",
            task: "Liste <code>id</code> e <code>nome</code> dos <code>produtos</code> cuja <code>cor</code> não foi cadastrada (é NULL).",
            startCode: "SELECT id, nome\nFROM produtos\nWHERE cor ;",
            solution: "SELECT\n    id,\n    nome\nFROM produtos\nWHERE cor IS NULL;",
            validator: (res) => sameResult(res, "SELECT id, nome FROM produtos WHERE cor IS NULL")
        },
        {
            id: 120, moduleId: 13,
            title: "Etiqueta de Cor Sem Buracos",
            concept: "COALESCE",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>COALESCE(a, b, ...)</code> devolve o primeiro valor que não for NULL — perfeito para trocar vazios por um texto padrão em relatórios. No SQLite também existe <code>IFNULL(a, b)</code>; no SQL Server, o equivalente é <code>ISNULL(a, b)</code> (e <code>COALESCE</code> funciona nos dois).",
            task: "Liste o <code>nome</code> de todos os <code>produtos</code> e a cor, trocando NULL por 'Sem cor', com o apelido <code>cor_exibicao</code>.",
            startCode: "SELECT \n    nome,\n    COALESCE() AS cor_exibicao\nFROM produtos;",
            solution: "SELECT\n    nome,\n    COALESCE(cor, 'Sem cor') AS cor_exibicao\nFROM produtos;",
            validator: (res) => sameResult(res, "SELECT nome, COALESCE(cor, 'Sem cor') AS cor_exibicao FROM produtos", { columns: ['nome', 'cor_exibicao'] })
        },
        {
            id: 121, moduleId: 13,
            title: "Produtos Vendidos em Fevereiro ou Março",
            concept: "UNION vs UNION ALL",
            icon: '<i class="ph-fill ph-intersect"></i>',
            theory: "<code>UNION</code> empilha o resultado de duas consultas e <b>remove duplicatas</b>; <code>UNION ALL</code> empilha tudo, mantendo repetições (e é mais rápido). As duas consultas precisam ter o mesmo número de colunas, com tipos compatíveis. Igual no SQL Server.",
            task: "Usando <code>UNION</code> (sem repetições), liste os <code>produto_id</code> vendidos em fevereiro de 2024 junto com os vendidos em março de 2024 (filtre com <code>data LIKE '2024-02%'</code> e <code>data LIKE '2024-03%'</code>).",
            startCode: "SELECT produto_id FROM vendas WHERE data LIKE ''\n\nSELECT produto_id FROM vendas WHERE data LIKE '';",
            solution: "SELECT produto_id\nFROM vendas\nWHERE data LIKE '2024-02%'\nUNION\nSELECT produto_id\nFROM vendas\nWHERE data LIKE '2024-03%';",
            validator: (res) => sameResult(res, "SELECT produto_id FROM vendas WHERE data LIKE '2024-02%' UNION SELECT produto_id FROM vendas WHERE data LIKE '2024-03%'")
        },
        // ---------- Módulo 14: Criando Estruturas ----------
        {
            id: 122, moduleId: 14,
            title: "Tabela de Cupons de Desconto",
            concept: "CREATE TABLE + restrições",
            icon: '<i class="ph-fill ph-plus-square"></i>',
            theory: "<code>CREATE TABLE</code> define colunas e regras: <code>PRIMARY KEY</code> identifica cada linha, <code>NOT NULL</code> proíbe vazios e <code>CHECK (condição)</code> recusa valores fora da regra de negócio. <code>IF NOT EXISTS</code> evita erro se a tabela já existir. No SQL Server, o <code>IF NOT EXISTS</code> é feito com <code>IF OBJECT_ID('cupons') IS NULL</code>.",
            task: "Crie (com <code>IF NOT EXISTS</code>) a tabela <code>cupons</code> com: <code>id</code> INTEGER PRIMARY KEY, <code>codigo</code> TEXT NOT NULL e <code>desconto_pct</code> INTEGER com <code>CHECK (desconto_pct BETWEEN 1 AND 50)</code>. Depois insira o cupom 'BIKE10' com 10% e liste a tabela.",
            startCode: "CREATE TABLE IF NOT EXISTS cupons (\n    id INTEGER ,\n    codigo TEXT ,\n    desconto_pct INTEGER \n);\n\nINSERT INTO cupons (codigo, desconto_pct) VALUES ('', );\n\nSELECT * FROM cupons;",
            solution: "CREATE TABLE IF NOT EXISTS cupons (\n    id INTEGER PRIMARY KEY,\n    codigo TEXT NOT NULL,\n    desconto_pct INTEGER CHECK (desconto_pct BETWEEN 1 AND 50)\n);\n\nINSERT INTO cupons (codigo, desconto_pct)\nVALUES ('BIKE10', 10);\n\nSELECT * FROM cupons;",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('cupons')");
                    if (!info.length) return false;
                    const cols = {};
                    info[0].values.forEach(r => { cols[String(r[1]).toLowerCase()] = { notnull: r[3], pk: r[5] }; });
                    if (!cols.id || !cols.id.pk || !cols.codigo || !cols.codigo.notnull || !cols.desconto_pct) return false;
                    const sql = db.exec("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'cupons'")[0].values[0][0];
                    if (!/CHECK\s*\(/i.test(sql)) return false;
                    const n = db.exec("SELECT COUNT(*) FROM cupons WHERE codigo = 'BIKE10' AND desconto_pct = 10")[0].values[0][0];
                    return n > 0;
                } catch (e) { return false; }
            }
        },
        {
            id: 123, moduleId: 14,
            title: "Validade dos Cupons",
            concept: "ALTER TABLE ADD COLUMN",
            icon: '<i class="ph-fill ph-calendar"></i>',
            theory: "<code>ALTER TABLE tabela ADD COLUMN coluna TIPO</code> acrescenta uma coluna a uma tabela existente; as linhas antigas recebem NULL (ou o <code>DEFAULT</code>). O SQLite não tem <code>IF NOT EXISTS</code> para colunas, então rodar duas vezes dá erro de coluna duplicada. No SQL Server escreve-se <code>ALTER TABLE cupons ADD validade DATE</code> (sem a palavra COLUMN).",
            task: "Adicione à tabela <code>cupons</code> a coluna <code>validade</code> do tipo TEXT. Em seguida, defina <code>validade = '2024-12-31'</code> para todos os cupons e liste a tabela.",
            startCode: "ALTER TABLE cupons\nADD COLUMN ;\n\nUPDATE cupons SET validade = ;\n\nSELECT * FROM cupons;",
            solution: "ALTER TABLE cupons\nADD COLUMN validade TEXT;\n\nUPDATE cupons\nSET validade = '2024-12-31';\n\nSELECT * FROM cupons;",
            validator: (res) => {
                try {
                    const info = db.exec("PRAGMA table_info('cupons')");
                    if (!info.length || !info[0].values.some(r => String(r[1]).toLowerCase() === 'validade')) return false;
                    return db.exec("SELECT COUNT(*) FROM cupons WHERE validade = '2024-12-31'")[0].values[0][0] > 0;
                } catch (e) { return false; }
            }
        },
        {
            id: 124, moduleId: 14,
            title: "View de Faturamento por Vendedor",
            concept: "CREATE VIEW",
            icon: '<i class="ph-fill ph-eye"></i>',
            theory: "Uma <code>VIEW</code> é uma consulta salva com nome: você a consulta como uma tabela, mas os dados vêm sempre atualizados das tabelas originais. Serve para padronizar relatórios e esconder JOINs complexos. Use <code>DROP VIEW IF EXISTS</code> antes para poder recriá-la; no SQL Server existe <code>CREATE OR ALTER VIEW</code>.",
            task: "Crie a view <code>vw_faturamento_vendedor</code> com o <code>nome</code> do vendedor e a soma de <code>quantidade * preco</code> como <code>faturamento</code> (JOIN de <code>vendas</code>, <code>produtos</code> e <code>vendedores</code>, agrupado por vendedor). Depois faça <code>SELECT * FROM vw_faturamento_vendedor ORDER BY faturamento DESC</code>.",
            startCode: "DROP VIEW IF EXISTS vw_faturamento_vendedor;\n\nCREATE VIEW vw_faturamento_vendedor AS\nSELECT \n    ...\nFROM vendas v\nJOIN ...;\n\nSELECT * FROM vw_faturamento_vendedor\nORDER BY faturamento DESC;",
            solution: "DROP VIEW IF EXISTS vw_faturamento_vendedor;\n\nCREATE VIEW vw_faturamento_vendedor AS\nSELECT\n    ve.nome,\n    SUM(v.quantidade * p.preco) AS faturamento\nFROM vendas v\nJOIN produtos p ON v.produto_id = p.id\nJOIN vendedores ve ON v.vendedor_id = ve.id\nGROUP BY ve.id, ve.nome;\n\nSELECT * FROM vw_faturamento_vendedor\nORDER BY faturamento DESC;",
            validator: (res) => {
                try {
                    const v = db.exec("SELECT COUNT(*) FROM sqlite_master WHERE type = 'view' AND name = 'vw_faturamento_vendedor'")[0].values[0][0];
                    if (!v) return false;
                } catch (e) { return false; }
                return sameResult(res, "SELECT ve.nome, SUM(v.quantidade * p.preco) AS faturamento FROM vendas v JOIN produtos p ON v.produto_id = p.id JOIN vendedores ve ON v.vendedor_id = ve.id GROUP BY ve.id, ve.nome ORDER BY faturamento DESC", { ordered: true, columns: ['nome', 'faturamento'] });
            }
        },
        // ---------- Módulo 15: Desafios de Negócio ----------
        {
            id: 125, moduleId: 15,
            title: "Campeão de Faturamento de Cada Categoria",
            concept: "CTE + RANK por grupo",
            icon: '<i class="ph-fill ph-trophy"></i>',
            theory: "Para achar o \"top 1 de cada grupo\", calcule o indicador numa CTE, aplique <code>RANK() OVER (PARTITION BY grupo ORDER BY indicador DESC)</code> e filtre a posição 1 na consulta de fora (não dá para usar a window function direto no <code>WHERE</code>). O mesmo padrão funciona no SQL Server.",
            task: "<b>Pedido da diretoria comercial:</b> \"Quero saber qual produto mais faturou em cada categoria.\" Mostre <code>categoria</code>, o nome do produto como <code>produto</code> e <code>faturamento</code> (soma de <code>quantidade * preco</code>), só do 1º colocado de cada categoria (use <code>RANK()</code>; empates aparecem juntos), ordenado por <code>categoria</code>.",
            startCode: "WITH fat_produto AS (\n    SELECT \n        ...\n    FROM vendas v\n    JOIN produtos p ON \n    GROUP BY \n),\nranking AS (\n    SELECT *,\n        RANK() OVER (PARTITION BY ... ORDER BY ...) AS posicao\n    FROM fat_produto\n)\nSELECT categoria, produto, faturamento\nFROM ranking\nWHERE \nORDER BY ;",
            solution: "WITH fat_produto AS (\n    SELECT\n        p.categoria,\n        p.nome AS produto,\n        SUM(v.quantidade * p.preco) AS faturamento\n    FROM vendas v\n    JOIN produtos p ON v.produto_id = p.id\n    GROUP BY p.id, p.categoria, p.nome\n),\nranking AS (\n    SELECT\n        *,\n        RANK() OVER (PARTITION BY categoria ORDER BY faturamento DESC) AS posicao\n    FROM fat_produto\n)\nSELECT\n    categoria,\n    produto,\n    faturamento\nFROM ranking\nWHERE posicao = 1\nORDER BY categoria;",
            validator: (res) => sameResult(res, "WITH f AS (SELECT p.categoria, p.nome AS produto, SUM(v.quantidade * p.preco) AS faturamento FROM vendas v JOIN produtos p ON v.produto_id = p.id GROUP BY p.id, p.categoria, p.nome), r AS (SELECT *, RANK() OVER (PARTITION BY categoria ORDER BY faturamento DESC) AS pos FROM f) SELECT categoria, produto, faturamento FROM r WHERE pos = 1 ORDER BY categoria, produto", { columns: ['categoria', 'produto', 'faturamento'] })
        },
        {
            id: 126, moduleId: 15,
            title: "Atingimento de Meta da Equipe",
            concept: "LEFT JOIN + CASE + COALESCE",
            icon: '<i class="ph-fill ph-target"></i>',
            theory: "Relatórios de meta juntam várias peças: uma CTE para o faturamento, <code>LEFT JOIN</code> para não perder quem ainda não vendeu, <code>COALESCE</code> para transformar NULL em 0 e <code>CASE WHEN</code> para classificar. Cuidado com divisão inteira: multiplique por <code>100.0</code> para obter o percentual com casas decimais (vale também no SQL Server).",
            task: "<b>Pedido da gerente de vendas:</b> \"Preciso do status de cada vendedor frente à meta.\" Para TODOS os vendedores, mostre <code>nome</code>, <code>faturamento</code> (soma de <code>quantidade * preco</code>, 0 se não vendeu), <code>percentual_meta</code> = <code>ROUND(100.0 * faturamento / meta_vendas, 1)</code> e <code>status</code>: 'Sem meta' se <code>meta_vendas</code> for NULL; 'No ritmo' se percentual &gt;= 15; 'Atenção' se &gt;= 5; senão 'Crítico'. Ordene por <code>faturamento</code> decrescente.",
            startCode: "WITH fat AS (\n    SELECT \n        ...\n    FROM vendas v\n    JOIN produtos p ON \n    GROUP BY \n)\nSELECT \n    ve.nome,\n    ... AS faturamento,\n    ... AS percentual_meta,\n    CASE \n        WHEN ... THEN 'Sem meta'\n        ...\n    END AS status\nFROM vendedores ve\nLEFT JOIN fat f ON \nORDER BY ;",
            solution: "WITH fat AS (\n    SELECT\n        v.vendedor_id,\n        SUM(v.quantidade * p.preco) AS total\n    FROM vendas v\n    JOIN produtos p ON v.produto_id = p.id\n    GROUP BY v.vendedor_id\n)\nSELECT\n    ve.nome,\n    COALESCE(f.total, 0) AS faturamento,\n    ROUND(100.0 * COALESCE(f.total, 0) / ve.meta_vendas, 1) AS percentual_meta,\n    CASE\n        WHEN ve.meta_vendas IS NULL THEN 'Sem meta'\n        WHEN 100.0 * COALESCE(f.total, 0) / ve.meta_vendas >= 15 THEN 'No ritmo'\n        WHEN 100.0 * COALESCE(f.total, 0) / ve.meta_vendas >= 5 THEN 'Atenção'\n        ELSE 'Crítico'\n    END AS status\nFROM vendedores ve\nLEFT JOIN fat f ON f.vendedor_id = ve.id\nORDER BY faturamento DESC;",
            validator: (res) => sameResult(res, "WITH fat AS (SELECT v.vendedor_id, SUM(v.quantidade * p.preco) AS total FROM vendas v JOIN produtos p ON v.produto_id = p.id GROUP BY v.vendedor_id), b AS (SELECT ve.nome, COALESCE(f.total, 0) AS faturamento, ve.meta_vendas AS meta FROM vendedores ve LEFT JOIN fat f ON f.vendedor_id = ve.id) SELECT nome, faturamento, ROUND(100.0 * faturamento / meta, 1) AS percentual_meta, CASE WHEN meta IS NULL THEN 'Sem meta' WHEN ROUND(100.0 * faturamento / meta, 1) >= 15 THEN 'No ritmo' WHEN ROUND(100.0 * faturamento / meta, 1) >= 5 THEN 'Atenção' ELSE 'Crítico' END AS status FROM b ORDER BY faturamento DESC", { ordered: true, columns: ['nome', 'faturamento', 'percentual_meta', 'status'] })
        },
        {
            id: 127, moduleId: 15,
            title: "Curva ABC do Catálogo",
            concept: "CTE + CASE + GROUP BY",
            icon: '<i class="ph-fill ph-ranking"></i>',
            theory: "A curva ABC classifica produtos pela importância no faturamento: poucos itens A concentram a receita, muitos itens C pesam pouco. Monte o faturamento por produto numa CTE (com <code>LEFT JOIN</code> e <code>COALESCE</code> para incluir quem não vendeu), classifique com <code>CASE</code> e depois agrupe pela classe.",
            task: "<b>Pedido do comprador:</b> \"Monte a curva ABC do catálogo.\" Calcule o faturamento de cada produto (soma de <code>quantidade * preco</code>, 0 para quem não vendeu) e classifique: 'A' se &gt;= 5000, 'B' se &gt;= 1000, senão 'C'. Mostre <code>classe</code>, a quantidade de produtos como <code>qtd_produtos</code> e o faturamento somado como <code>faturamento_total</code>, ordenado por <code>classe</code>.",
            startCode: "WITH fat AS (\n    SELECT \n        p.id,\n        ... AS faturamento\n    FROM produtos p\n    LEFT JOIN vendas v ON \n    GROUP BY \n)\nSELECT \n    CASE \n        ...\n    END AS classe,\n    ... AS qtd_produtos,\n    ... AS faturamento_total\nFROM fat\nGROUP BY \nORDER BY ;",
            solution: "WITH fat AS (\n    SELECT\n        p.id,\n        COALESCE(SUM(v.quantidade * p.preco), 0) AS faturamento\n    FROM produtos p\n    LEFT JOIN vendas v ON v.produto_id = p.id\n    GROUP BY p.id\n)\nSELECT\n    CASE\n        WHEN faturamento >= 5000 THEN 'A'\n        WHEN faturamento >= 1000 THEN 'B'\n        ELSE 'C'\n    END AS classe,\n    COUNT(*) AS qtd_produtos,\n    SUM(faturamento) AS faturamento_total\nFROM fat\nGROUP BY classe\nORDER BY classe;",
            validator: (res) => sameResult(res, "WITH fat AS (SELECT p.id, COALESCE(SUM(v.quantidade * p.preco), 0) AS faturamento FROM produtos p LEFT JOIN vendas v ON v.produto_id = p.id GROUP BY p.id) SELECT CASE WHEN faturamento >= 5000 THEN 'A' WHEN faturamento >= 1000 THEN 'B' ELSE 'C' END AS classe, COUNT(*) AS qtd_produtos, SUM(faturamento) AS faturamento_total FROM fat GROUP BY classe ORDER BY classe", { ordered: true, columns: ['classe', 'qtd_produtos', 'faturamento_total'] })
        }
    ]
};

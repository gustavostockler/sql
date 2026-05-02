// --- Application State ---
let db = null;
let editor = null;
let currentLessonId = 0;
let audioEnabled = true;
let currentThemeId = null;

// --- Web Audio API for Better Sounds ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol, startTime) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime + startTime);
    oscillator.stop(audioCtx.currentTime + startTime + duration);
}

function playWinnerSound() {
    if(!audioEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playTone(261.63, 'sine', 0.15, 0.5, 0);      
    playTone(329.63, 'sine', 0.15, 0.5, 0.1);    
    playTone(392.00, 'sine', 0.15, 0.5, 0.2);    
    playTone(523.25, 'sine', 0.4, 0.5, 0.3);     
}

function playErrorSound() {
    if(!audioEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playTone(150, 'square', 0.15, 0.3, 0);
    playTone(130, 'square', 0.25, 0.3, 0.2);
}

function playWarningSound() {
    if(!audioEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playTone(400, 'sine', 0.1, 0.2, 0);
    playTone(300, 'sine', 0.15, 0.2, 0.15);
}

// --- Modules Data ---
const modules = [
    { id: 1, title: "Módulo 1: Fundamentos" },
    { id: 2, title: "Módulo 2: Filtragem de Dados" },
    { id: 3, title: "Módulo 3: Métricas & Análise" },
    { id: 4, title: "Módulo 4: Cruzamento de Tabelas" },
    { id: 5, title: "Módulo 5: Gestão do Sistema" },
    { id: 6, title: "Módulo 6: Subqueries & CTEs" },
    { id: 7, title: "Módulo 7: Window Functions" },
    { id: 8, title: "Módulo 8: CASE WHEN & Lógica" },
    { id: 9, title: "Módulo 9: Funções de Texto & Data" },
    { id: 10, title: "Módulo 10: Performance & Indexes" }
];

let completedLessons = new Set();
let SQL = null; 

// --- Theme Configurations ---
const themes = {
    veiculos: {
        title: "Stockler Veículos",
        icon: '<i class="ph-fill ph-car-profile"></i>',
        schema: [
            '<li><span class="schema-box-highlight">veiculos</span>: <code>id</code>, <code>modelo</code>, <code>marca</code>, <code>categoria</code>, <code>valor_diaria</code>, <code>status</code></li>',
            '<li><span class="schema-box-highlight">clientes</span>: <code>id</code>, <code>nome</code>, <code>cnh</code>, <code>estado</code></li>',
            '<li><span class="schema-box-highlight">locacoes</span>: <code>id</code>, <code>cliente_id</code>, <code>veiculo_id</code>, <code>dias</code>, <code>valor_total</code></li>'
        ],
        setupQuery: `
            CREATE TABLE veiculos (id INTEGER PRIMARY KEY, modelo TEXT, marca TEXT, categoria TEXT, valor_diaria INTEGER, status TEXT);
            CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, cnh TEXT, estado TEXT);
            CREATE TABLE locacoes (id INTEGER PRIMARY KEY, cliente_id INTEGER, veiculo_id INTEGER, dias INTEGER, valor_total INTEGER, FOREIGN KEY(cliente_id) REFERENCES clientes(id), FOREIGN KEY(veiculo_id) REFERENCES veiculos(id));
            INSERT INTO veiculos VALUES (1, 'HB20', 'Hyundai', 'Hatch', 90, 'Disponível'), (2, 'Onix', 'Chevrolet', 'Hatch', 95, 'Alugado'), (3, 'Compass', 'Jeep', 'SUV', 220, 'Disponível'), (4, 'Renegade', 'Jeep', 'SUV', 180, 'Alugado'), (5, 'Civic', 'Honda', 'Sedan', 250, 'Disponível'), (6, 'Cronos', 'Fiat', 'Sedan', 130, 'Disponível'), (7, 'Kicks', 'Nissan', 'SUV', 190, 'Alugado'), (8, 'Argo', 'Fiat', 'Hatch', 85, 'Disponível');
            INSERT INTO clientes VALUES (1, 'João Silva', '12345678', 'SP'), (2, 'Maria Souza', '87654321', 'RJ'), (3, 'Pedro Alves', '11223344', 'MG');
            INSERT INTO locacoes VALUES (1, 1, 2, 5, 475), (2, 2, 4, 3, 540), (3, 3, 7, 7, 1330), (4, 1, 1, 2, 180);
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Inventário Total", icon: '<i class="ph-fill ph-car-profile"></i>', theory: "O primeiro passo é saber o que temos na garagem. Nossa frota está registrada na tabela <code>veiculos</code>.", task: "Escreva uma query para listar TODOS os dados (*) de todos os <code>veiculos</code>.", startCode: "SELECT \n\nFROM veiculos;", solution: "SELECT * \nFROM veiculos;", validator: (res) => res && res[0] && res[0].columns.includes('modelo') && res[0].values.length >= 8 },
            { id: 1, moduleId: 1, title: "2. Foco no Preço", icon: '<i class="ph-fill ph-currency-dollar"></i>', theory: "Ao invés de ver a ficha completa, às vezes o cliente quer saber apenas o carro e quanto custa.", task: "Selecione apenas as colunas <code>modelo</code> e <code>valor_diaria</code> da tabela <code>veiculos</code>.", startCode: "SELECT \n    \nFROM veiculos;", solution: "SELECT modelo, valor_diaria \nFROM veiculos;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('valor_diaria') },
            { id: 2, moduleId: 1, title: "3. Categorias Únicas", icon: '<i class="ph-fill ph-fingerprint"></i>', theory: "Quais tipos de carros nós oferecemos? Usando <code>DISTINCT</code>, removemos repetições.", task: "Descubra quais são as diferentes categorias na frota. Selecione valores ÚNICOS da coluna <code>categoria</code> na tabela <code>veiculos</code>.", startCode: "SELECT DISTINCT \nFROM veiculos;", solution: "SELECT DISTINCT categoria \nFROM veiculos;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length === 3 },
            { id: 3, moduleId: 2, title: "4. Apenas Disponíveis", icon: '<i class="ph-fill ph-funnel"></i>', theory: "Não podemos alugar um carro que já está alugado. O <code>WHERE</code> filtra linhas.", task: "Selecione todos os <code>veiculos</code> onde o <code>status</code> seja igual a 'Disponível'.", startCode: "SELECT * \nFROM veiculos\nWHERE ;", solution: "SELECT * \nFROM veiculos\nWHERE status = 'Disponível';", validator: (res) => res && res[0] && res[0].values.every(row => row[5] === 'Disponível') },
            { id: 4, moduleId: 2, title: "5. SUVs Baratos", icon: '<i class="ph-fill ph-intersect"></i>', theory: "Combine condições usando <code>AND</code>.", task: "Busque veículos onde a <code>categoria</code> seja 'SUV' E o <code>valor_diaria</code> seja menor ou igual a 200.", startCode: "SELECT * \nFROM veiculos\nWHERE \nAND ;", solution: "SELECT * \nFROM veiculos\nWHERE categoria = 'SUV' \nAND valor_diaria <= 200;", validator: (res) => res && res[0] && res[0].values.every(row => row[3] === 'SUV' && row[4] <= 200) },
            { id: 5, moduleId: 2, title: "6. Do Barato ao Caro", icon: '<i class="ph-fill ph-sort-ascending"></i>', theory: "Ordene os resultados com <code>ORDER BY coluna ASC</code> ou <code>DESC</code>.", task: "Selecione o <code>modelo</code> e o <code>valor_diaria</code> ordenados pelo valor da diária de forma crescente (ASC).", startCode: "SELECT modelo, valor_diaria \nFROM veiculos\nORDER BY ;", solution: "SELECT modelo, valor_diaria \nFROM veiculos\nORDER BY valor_diaria ASC;", validator: (res) => { if(!res || !res[0] || res[0].columns.length !== 2) return false; const vals = res[0].values; return vals[0][1] <= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. Top 3 Luxo", icon: '<i class="ph-fill ph-list-numbers"></i>', theory: "A cláusula <code>LIMIT X</code> restringe o retorno a X linhas.", task: "Recupere os 3 veículos mais caros da locadora. Ordene de forma decrescente e aplique LIMIT 3.", startCode: "SELECT * \nFROM veiculos\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM veiculos\nORDER BY valor_diaria DESC\nLIMIT 3;", validator: (res) => res && res[0] && res[0].values.length === 3 && res[0].values[0][4] >= res[0].values[1][4] },
            { id: 7, moduleId: 3, title: "8. Contagem Total", icon: '<i class="ph-fill ph-math-operations"></i>', theory: "A função <code>COUNT(*)</code> conta quantas linhas existem.", task: "Conte quantos veículos nós temos cadastrados na tabela <code>veiculos</code>.", startCode: "SELECT \nFROM veiculos;", solution: "SELECT COUNT(*) \nFROM veiculos;", validator: (res) => res && res[0] && res[0].values[0][0] >= 8 },
            { id: 8, moduleId: 3, title: "9. Faturamento Potencial", icon: '<i class="ph-fill ph-calculator"></i>', theory: "Usando <code>SUM(coluna)</code> obtemos somas matemáticas.", task: "Calcule a soma (SUM) do <code>valor_total</code> de todas as locações já realizadas na tabela <code>locacoes</code>.", startCode: "SELECT \nFROM locacoes;", solution: "SELECT SUM(valor_total) \nFROM locacoes;", validator: (res) => res && res[0] && res[0].values[0][0] > 1000 },
            { id: 9, moduleId: 3, title: "10. Agrupando Categorias", icon: '<i class="ph-fill ph-squares-four"></i>', theory: "O <code>GROUP BY</code> junta linhas que têm os mesmos valores.", task: "Mostre a <code>categoria</code> e conte quantos carros existem em cada uma usando <code>COUNT(*)</code>.", startCode: "SELECT categoria, \nFROM veiculos\nGROUP BY ;", solution: "SELECT categoria, COUNT(*) \nFROM veiculos\nGROUP BY categoria;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length === 3 },
            { id: 10, moduleId: 4, title: "11. Quem alugou o quê?", icon: '<i class="ph-fill ph-link"></i>', theory: "Ligamos duas tabelas usando suas chaves com o <code>JOIN</code>.", task: "Faça um JOIN de <code>locacoes</code> com <code>clientes</code> ligando <code>cliente_id</code> com <code>id</code> do cliente. Selecione nome e dias alugados.", startCode: "SELECT clientes.nome, locacoes.dias\nFROM locacoes\nJOIN clientes \nON locacoes.cliente_id = ;", solution: "SELECT clientes.nome, locacoes.dias\nFROM locacoes\nJOIN clientes \nON locacoes.cliente_id = clientes.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 4 },
            { id: 11, moduleId: 4, title: "12. Triplo JOIN", icon: '<i class="ph-fill ph-git-merge"></i>', theory: "Podemos encadear vários JOINs para ligar várias tabelas.", task: "Faça um JOIN de locacoes com clientes, e depois com veiculos. Selecione clientes.nome e veiculos.modelo.", startCode: "SELECT clientes.nome, veiculos.modelo\nFROM locacoes\nJOIN clientes ON locacoes.cliente_id = clientes.id\nJOIN veiculos ON ;", solution: "SELECT clientes.nome, veiculos.modelo\nFROM locacoes\nJOIN clientes ON locacoes.cliente_id = clientes.id\nJOIN veiculos ON locacoes.veiculo_id = veiculos.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 4 },
            { id: 12, moduleId: 5, title: "13. Comprando um Carro", icon: '<i class="ph-fill ph-plus-circle"></i>', theory: "Chegou um carro novo! Use <code>INSERT INTO</code>.", task: "Insira um 'Corolla' da marca 'Toyota', categoria 'Sedan', valor 200, status 'Disponível'.", startCode: "INSERT INTO veiculos (modelo, marca, categoria, valor_diaria, status)\nVALUES ('', '', '', , '');\n\nSELECT * FROM veiculos;", solution: "INSERT INTO veiculos (modelo, marca, categoria, valor_diaria, status)\nVALUES ('Corolla', 'Toyota', 'Sedan', 200, 'Disponível');\n\nSELECT * FROM veiculos;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Corolla') },
            { id: 13, moduleId: 5, title: "14. Atualizando Preço", icon: '<i class="ph-fill ph-pencil-simple"></i>', theory: "A diária subiu! Usamos <code>UPDATE</code>.", task: "Aumente o <code>valor_diaria</code> do 'Corolla' para 220.", startCode: "UPDATE veiculos\nSET valor_diaria = \nWHERE modelo = '';\n\nSELECT * FROM veiculos WHERE modelo = 'Corolla';", solution: "UPDATE veiculos\nSET valor_diaria = 220\nWHERE modelo = 'Corolla';\n\nSELECT * FROM veiculos WHERE modelo = 'Corolla';", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Corolla' && row[4] === 220) },
            { id: 14, moduleId: 5, title: "15. Venda de Frota", icon: '<i class="ph-fill ph-trash"></i>', theory: "Vamos remover com <code>DELETE</code>.", task: "Delete o veículo cujo modelo é 'HB20'.", startCode: "DELETE FROM veiculos\nWHERE modelo = '';\n\nSELECT * FROM veiculos;", solution: "DELETE FROM veiculos\nWHERE modelo = 'HB20';\n\nSELECT * FROM veiculos;", validator: (res) => res && res[0] && !res[0].values.some(row => row[1] === 'HB20') },
            { id: 15, moduleId: 6, title: "16. Acima da Média", icon: '<i class="ph-fill ph-trend-up"></i>', theory: "Subqueries permitem usar o resultado de uma consulta dentro de outra.", task: "Selecione os veículos cujo <code>valor_diaria</code> seja maior que a média de todos os veículos.", startCode: "SELECT * FROM veiculos \nWHERE valor_diaria > (SELECT ...);", solution: "SELECT * FROM veiculos \nWHERE valor_diaria > (SELECT AVG(valor_diaria) FROM veiculos);", validator: (res) => res && res[0] && res[0].values.length < 8 && res[0].values.every(row => row[4] > 100) },
            { id: 16, moduleId: 7, title: "17. Ranking de Preços", icon: '<i class="ph-fill ph-medal"></i>', theory: "Funções de Janela calculam valores sobre um conjunto de linhas.", task: "Use <code>RANK() OVER(ORDER BY valor_diaria DESC)</code> para criar um ranking de preços.", startCode: "SELECT modelo, valor_diaria, \nRANK() OVER(...) as ranking \nFROM veiculos;", solution: "SELECT modelo, valor_diaria, RANK() OVER(ORDER BY valor_diaria DESC) as ranking FROM veiculos;", validator: (res) => res && res[0] && res[0].columns.includes('ranking') },
            { id: 17, moduleId: 8, title: "18. Categorização de Luxo", icon: '<i class="ph-fill ph-brackets-curly"></i>', theory: "O <code>CASE WHEN</code> cria lógica condicional diretamente no SELECT.", task: "Se o valor for > 200, chame de 'Luxo', senão 'Econômico'.", startCode: "SELECT modelo, \nCASE WHEN valor_diaria > 200 THEN 'Luxo' \nELSE 'Econômico' END as classe \nFROM veiculos;", solution: "SELECT modelo, CASE WHEN valor_diaria > 200 THEN 'Luxo' ELSE 'Econômico' END as classe FROM veiculos;", validator: (res) => res && res[0] && res[0].columns.includes('classe') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> converte texto para MAIÚSCULAS, <b>LOWER()</b> para minúsculas. Ex: <code>SELECT UPPER('honda') → HONDA</code>.", task: "Selecione o <code>modelo</code> em maiúsculas (UPPER) e a <code>marca</code> em minúsculas (LOWER) dos veículos.", startCode: "SELECT UPPER(modelo), LOWER(marca) \nFROM veiculos;", solution: "SELECT UPPER(modelo), LOWER(marca) FROM veiculos;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. LEFT / RIGHT / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai partes do texto (equivalente ao LEFT/RIGHT do SQL Server). <b>LENGTH()</b> conta caracteres.", task: "Selecione os primeiros 3 caracteres do campo <code>modelo</code> como 'sigla', e o total de caracteres como 'tamanho'.", startCode: "SELECT SUBSTR(modelo, 1, 3) as sigla, LENGTH(modelo) as tamanho \nFROM veiculos;", solution: "SELECT SUBSTR(modelo, 1, 3) as sigla, LENGTH(modelo) as tamanho FROM veiculos;", validator: (res) => res && res[0] && res[0].columns.includes('sigla') && res[0].columns.includes('tamanho') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo, 'de', 'para')</b> substitui texto. O operador <b>||</b> concatena (junta) strings — equivalente ao CONCAT() do SQL Server.", task: "Crie uma coluna 'descricao' juntando <code>marca</code>, um espaço e <code>modelo</code> com <code>||</code>. Também substitua 'Jeep' por 'JEEP' no campo marca.", startCode: "SELECT marca || ' ' || modelo as descricao,\n       REPLACE(marca, 'Jeep', 'JEEP') as marca_upper\nFROM veiculos;", solution: "SELECT marca || ' ' || modelo as descricao, REPLACE(marca, 'Jeep', 'JEEP') as marca_upper FROM veiculos;", validator: (res) => res && res[0] && res[0].columns.includes('descricao') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar"></i>', theory: "<b>DATE('now')</b> retorna a data atual. <b>STRFTIME('%Y', data)</b> extrai o ano. <b>julianday()</b> permite calcular diferenças de datas (equivalente ao DATEDIFF).", task: "Nas locações, mostre o <code>id</code> e calcule quantos dias se passaram desde a locação: use <code>julianday('now') - julianday('2024-01-01')</code> como 'dias_decorridos'.", startCode: "SELECT id, \n  CAST(julianday('now') - julianday('2024-01-01') AS INTEGER) as dias_decorridos\nFROM locacoes;", solution: "SELECT id, CAST(julianday('now') - julianday('2024-01-01') AS INTEGER) as dias_decorridos FROM locacoes;", validator: (res) => res && res[0] && res[0].columns.includes('dias_decorridos') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-lightning"></i>', theory: "Índices aceleram buscas em tabelas grandes. Crie com <code>CREATE INDEX nome ON tabela(coluna)</code>.", task: "Crie um índice chamado <code>idx_modelo</code> na coluna <code>modelo</code> da tabela veiculos.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_modelo ON veiculos(modelo);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('veiculos')"); return check[0].values.some(v => v[1] === 'idx_modelo'); } catch(e) { return false; } } }
        ]
    },
    fintech: {
        title: "Stockler Fintech",
        icon: '<i class="ph-fill ph-bank"></i>',
        schema: [
            '<li><span class="schema-box-highlight">clientes</span>: <code>id</code>, <code>nome</code>, <code>cpf</code>, <code>tipo_conta</code></li>',
            '<li><span class="schema-box-highlight">contas</span>: <code>id</code>, <code>cliente_id</code>, <code>saldo</code>, <code>limite_credito</code>, <code>status</code></li>',
            '<li><span class="schema-box-highlight">transacoes</span>: <code>id</code>, <code>conta_id</code>, <code>tipo</code>, <code>valor</code>, <code>data_hora</code></li>'
        ],
        setupQuery: `
            CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, cpf TEXT, tipo_conta TEXT);
            CREATE TABLE contas (id INTEGER PRIMARY KEY, cliente_id INTEGER, saldo INTEGER, limite_credito INTEGER, status TEXT, FOREIGN KEY(cliente_id) REFERENCES clientes(id));
            CREATE TABLE transacoes (id INTEGER PRIMARY KEY, conta_id INTEGER, tipo TEXT, valor INTEGER, data_hora TEXT, FOREIGN KEY(conta_id) REFERENCES contas(id));
            INSERT INTO clientes VALUES (1, 'Empresa XYZ', '11111111111', 'PJ'), (2, 'Gustavo Stockler', '22222222222', 'PF'), (3, 'Maria Oliveira', '33333333333', 'PF');
            INSERT INTO contas VALUES (1, 1, 150000, 50000, 'Ativa'), (2, 2, 5000, 10000, 'Ativa'), (3, 3, 200, 500, 'Bloqueada');
            INSERT INTO transacoes VALUES (1, 1, 'Deposito', 5000, '2023-10-01'), (2, 1, 'Saque', 1000, '2023-10-02'), (3, 2, 'PIX Recebido', 500, '2023-10-02'), (4, 3, 'Saque', 50, '2023-10-03');
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Carteira Total", icon: '<i class="ph-fill ph-users"></i>', theory: "Bem-vindo ao Banco! Vamos conhecer nossa base de clientes registrada na tabela <code>clientes</code>.", task: "Escreva uma query para listar TODOS os dados (*) de todos os <code>clientes</code>.", startCode: "SELECT \n\nFROM clientes;", solution: "SELECT * \nFROM clientes;", validator: (res) => res && res[0] && res[0].columns.includes('cpf') && res[0].values.length >= 3 },
            { id: 1, moduleId: 1, title: "2. Foco no Saldo", icon: '<i class="ph-fill ph-wallet"></i>', theory: "Muitas vezes, a auditoria pede apenas o ID da conta e o saldo disponível.", task: "Selecione apenas as colunas <code>id</code> e <code>saldo</code> da tabela <code>contas</code>.", startCode: "SELECT \n    \nFROM contas;", solution: "SELECT id, saldo \nFROM contas;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('saldo') },
            { id: 2, moduleId: 1, title: "3. Tipos Únicos", icon: '<i class="ph-fill ph-fingerprint"></i>', theory: "Quais tipos de transações ocorrem na agência? Usamos <code>DISTINCT</code> para valores únicos.", task: "Descubra quais são os diferentes tipos de transação. Selecione valores ÚNICOS da coluna <code>tipo</code> na tabela <code>transacoes</code>.", startCode: "SELECT DISTINCT \nFROM transacoes;", solution: "SELECT DISTINCT tipo \nFROM transacoes;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length === 3 },
            { id: 3, moduleId: 2, title: "4. Contas Bloqueadas", icon: '<i class="ph-fill ph-lock-key"></i>', theory: "O <code>WHERE</code> ajuda a encontrar contas problemáticas.", task: "Selecione todas as <code>contas</code> onde o <code>status</code> seja igual a 'Bloqueada'.", startCode: "SELECT * \nFROM contas\nWHERE ;", solution: "SELECT * \nFROM contas\nWHERE status = 'Bloqueada';", validator: (res) => res && res[0] && res[0].values.every(row => row[4] === 'Bloqueada') },
            { id: 4, moduleId: 2, title: "5. PF com Alto Limite", icon: '<i class="ph-fill ph-credit-card"></i>', theory: "Analistas precisam cruzar filtros com o <code>AND</code>.", task: "Busque clientes na tabela <code>clientes</code> onde o <code>tipo_conta</code> seja 'PF' E o <code>nome</code> seja 'Gustavo Stockler'.", startCode: "SELECT * \nFROM clientes\nWHERE \nAND ;", solution: "SELECT * \nFROM clientes\nWHERE tipo_conta = 'PF' \nAND nome = 'Gustavo Stockler';", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][1] === 'Gustavo Stockler' },
            { id: 5, moduleId: 2, title: "6. Ordenar por Saldo", icon: '<i class="ph-fill ph-sort-descending"></i>', theory: "Organize o extrato. Ordene com <code>ORDER BY coluna ASC</code> ou <code>DESC</code>.", task: "Selecione o <code>cliente_id</code> e o <code>saldo</code> das contas, ordenados pelo saldo de forma decrescente (DESC).", startCode: "SELECT cliente_id, saldo \nFROM contas\nORDER BY ;", solution: "SELECT cliente_id, saldo \nFROM contas\nORDER BY saldo DESC;", validator: (res) => { if(!res || !res[0]) return false; const vals = res[0].values; return vals[0][1] >= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. Maior Transação", icon: '<i class="ph-fill ph-star"></i>', theory: "Ache a maior transação do dia combinando ORDER BY e LIMIT.", task: "Recupere a 1 transação de maior valor da tabela. Ordene o valor decrescente e use LIMIT 1.", startCode: "SELECT * \nFROM transacoes\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM transacoes\nORDER BY valor DESC\nLIMIT 1;", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][3] === 5000 },
            { id: 7, moduleId: 3, title: "8. Total de Clientes", icon: '<i class="ph-fill ph-math-operations"></i>', theory: "A função <code>COUNT(*)</code> conta os registros de uma tabela.", task: "Conte quantos clientes nós temos cadastrados na tabela <code>clientes</code>.", startCode: "SELECT \nFROM clientes;", solution: "SELECT COUNT(*) \nFROM clientes;", validator: (res) => res && res[0] && res[0].values[0][0] >= 3 },
            { id: 8, moduleId: 3, title: "9. Dinheiro em Caixa", icon: '<i class="ph-fill ph-vault"></i>', theory: "O BACEN exige a soma total dos saldos usando <code>SUM(coluna)</code>.", task: "Calcule a soma (SUM) do <code>saldo</code> de todas as contas na tabela <code>contas</code>.", startCode: "SELECT \nFROM contas;", solution: "SELECT SUM(saldo) \nFROM contas;", validator: (res) => res && res[0] && res[0].values[0][0] > 150000 },
            { id: 9, moduleId: 3, title: "10. Contas por Tipo", icon: '<i class="ph-fill ph-chart-pie-slice"></i>', theory: "Agrupe dados da agência com o <code>GROUP BY</code>.", task: "Mostre o <code>tipo_conta</code> e conte quantos clientes existem em cada tipo usando <code>COUNT(*)</code>.", startCode: "SELECT tipo_conta, \nFROM clientes\nGROUP BY ;", solution: "SELECT tipo_conta, COUNT(*) \nFROM clientes\nGROUP BY tipo_conta;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length === 2 },
            { id: 10, moduleId: 4, title: "11. Nome do Correntista", icon: '<i class="ph-fill ph-link"></i>', theory: "Para saber o nome do dono da conta, precisamos do <code>JOIN</code>.", task: "Faça um JOIN de <code>contas</code> com <code>clientes</code> ligando <code>cliente_id</code> com <code>id</code> do cliente. Selecione nome e saldo.", startCode: "SELECT clientes.nome, contas.saldo\nFROM contas\nJOIN clientes \nON contas.cliente_id = ;", solution: "SELECT clientes.nome, contas.saldo\nFROM contas\nJOIN clientes \nON contas.cliente_id = clientes.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 3 },
            { id: 11, moduleId: 4, title: "12. Rastreio de Transação", icon: '<i class="ph-fill ph-git-merge"></i>', theory: "Triplo JOIN para auditoria financeira.", task: "Faça um JOIN ligando transacoes, contas e clientes. Selecione clientes.nome e transacoes.valor.", startCode: "SELECT clientes.nome, transacoes.valor\nFROM transacoes\nJOIN contas ON transacoes.conta_id = contas.id\nJOIN clientes ON ;", solution: "SELECT clientes.nome, transacoes.valor\nFROM transacoes\nJOIN contas ON transacoes.conta_id = contas.id\nJOIN clientes ON contas.cliente_id = clientes.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 4 },
            { id: 12, moduleId: 5, title: "13. Nova Conta", icon: '<i class="ph-fill ph-user-plus"></i>', theory: "Criando registros com <code>INSERT INTO</code>.", task: "Insira um novo cliente na tabela clientes: nome 'Ana Maria', cpf '44444444444', tipo 'PF'.", startCode: "INSERT INTO clientes (nome, cpf, tipo_conta)\nVALUES ('', '', '');\n\nSELECT * FROM clientes;", solution: "INSERT INTO clientes (nome, cpf, tipo_conta)\nVALUES ('Ana Maria', '44444444444', 'PF');\n\nSELECT * FROM clientes;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Ana Maria') },
            { id: 13, moduleId: 5, title: "14. Aumento de Limite", icon: '<i class="ph-fill ph-arrow-fat-up"></i>', theory: "O gerente autorizou! Usamos <code>UPDATE</code>.", task: "Atualize o <code>limite_credito</code> da conta de id=2 para 15000.", startCode: "UPDATE contas\nSET limite_credito = \nWHERE id = ;\n\nSELECT * FROM contas WHERE id = 2;", solution: "UPDATE contas\nSET limite_credito = 15000\nWHERE id = 2;\n\nSELECT * FROM contas WHERE id = 2;", validator: (res) => res && res[0] && res[0].values.some(row => row[0] === 2 && row[3] === 15000) },
            { id: 14, moduleId: 5, title: "15. Estorno (Apagar)", icon: '<i class="ph-fill ph-trash"></i>', theory: "Transação indevida? Remova com <code>DELETE</code>.", task: "Delete a transação cujo id é 4.", startCode: "DELETE FROM transacoes\nWHERE id = ;\n\nSELECT * FROM transacoes;", solution: "DELETE FROM transacoes\nWHERE id = 4;\n\nSELECT * FROM transacoes;", validator: (res) => res && res[0] && !res[0].values.some(row => row[0] === 4) },
            { id: 15, moduleId: 6, title: "16. Clientes com Saldo Alto", icon: '<i class="ph-fill ph-money"></i>', theory: "Subqueries no WHERE para filtrar por métricas agregadas.", task: "Selecione clientes cujo <code>id</code> esteja na lista de contas com saldo > 10000.", startCode: "SELECT * FROM clientes \nWHERE id IN (SELECT ...);", solution: "SELECT * FROM clientes WHERE id IN (SELECT cliente_id FROM contas WHERE saldo > 10000);", validator: (res) => res && res[0] && res[0].values.length === 1 },
            { id: 16, moduleId: 7, title: "17. Saldo Acumulado", icon: '<i class="ph-fill ph-chart-line-up"></i>', theory: "Window functions como <code>SUM() OVER</code> criam totais móveis.", task: "Calcule o saldo acumulado das contas ordenadas por id.", startCode: "SELECT id, saldo, \nSUM(saldo) OVER(ORDER BY id) as acumulado \nFROM contas;", solution: "SELECT id, saldo, SUM(saldo) OVER(ORDER BY id) as acumulado FROM contas;", validator: (res) => res && res[0] && res[0].columns.includes('acumulado') },
            { id: 17, moduleId: 8, title: "18. Status de Crédito", icon: '<i class="ph-fill ph-shield-check"></i>', theory: "Classifique o risco com <code>CASE WHEN</code>.", task: "Se limite > 20000 então 'VIP', senão 'Standard'.", startCode: "SELECT id, \nCASE WHEN limite_credito > 20000 THEN 'VIP' \nELSE 'Standard' END as status_vip \nFROM contas;", solution: "SELECT id, CASE WHEN limite_credito > 20000 THEN 'VIP' ELSE 'Standard' END as status_vip FROM contas;", validator: (res) => res && res[0] && res[0].columns.includes('status_vip') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> converte para MAIÚSCULAS, <b>LOWER()</b> para minúsculas.", task: "Selecione o <code>nome</code> dos clientes em MAIÚSCULAS e o <code>tipo_conta</code> em minúsculas.", startCode: "SELECT UPPER(nome), LOWER(tipo_conta) \nFROM clientes;", solution: "SELECT UPPER(nome), LOWER(tipo_conta) FROM clientes;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. SUBSTR / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai fragmento do texto. <b>LENGTH()</b> conta caracteres.", task: "Selecione os 3 primeiros caracteres do <code>tipo</code> como 'sigla' e o comprimento como 'tamanho' das transacoes.", startCode: "SELECT SUBSTR(tipo, 1, 3) as sigla, LENGTH(tipo) as tamanho \nFROM transacoes;", solution: "SELECT SUBSTR(tipo, 1, 3) as sigla, LENGTH(tipo) as tamanho FROM transacoes;", validator: (res) => res && res[0] && res[0].columns.includes('sigla') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo,'de','para')</b> substitui texto. O operador <b>||</b> concatena strings (equivale ao CONCAT do SQL Server).", task: "Crie 'descricao' juntando <code>nome</code> + ' - ' + <code>cpf</code> com <code>||</code>.", startCode: "SELECT nome || ' - ' || cpf as descricao \nFROM clientes;", solution: "SELECT nome || ' - ' || cpf as descricao FROM clientes;", validator: (res) => res && res[0] && res[0].columns.includes('descricao') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar"></i>', theory: "<b>STRFTIME('%Y-%m-%d', campo)</b> formata datas. <b>julianday()</b> calcula diferença entre datas (equivale ao DATEDIFF).", task: "Nas transacoes, mostre o <code>id</code>, o ano com <code>STRFTIME('%Y', data_hora)</code> como 'ano', e os dias decorridos com <code>CAST(julianday('now') - julianday(data_hora) AS INTEGER)</code> como 'dias_atras'.", startCode: "SELECT id, \n  STRFTIME('%Y', data_hora) as ano,\n  CAST(julianday('now') - julianday(data_hora) AS INTEGER) as dias_atras\nFROM transacoes;", solution: "SELECT id, STRFTIME('%Y', data_hora) as ano, CAST(julianday('now') - julianday(data_hora) AS INTEGER) as dias_atras FROM transacoes;", validator: (res) => res && res[0] && res[0].columns.includes('ano') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-gauge"></i>', theory: "Índices em chaves estrangeiras aceleram os JOINs.", task: "Crie um índice chamado <code>idx_conta_trans</code> na coluna <code>conta_id</code> da tabela transacoes.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_conta_trans ON transacoes(conta_id);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('transacoes')"); return check[0].values.some(v => v[1] === 'idx_conta_trans'); } catch(e) { return false; } } }
        ]
    },
    farma: {
        title: "Stockler Farma",
        icon: '<i class="ph-fill ph-pill"></i>',
        schema: [
            '<li><span class="schema-box-highlight">fornecedores</span>: <code>id</code>, <code>nome</code>, <code>cnpj</code>, <code>cidade</code></li>',
            '<li><span class="schema-box-highlight">produtos</span>: <code>id</code>, <code>nome</code>, <code>fornecedor_id</code>, <code>categoria</code>, <code>preco</code>, <code>estoque</code></li>',
            '<li><span class="schema-box-highlight">vendas</span>: <code>id</code>, <code>produto_id</code>, <code>quantidade</code>, <code>data_venda</code></li>'
        ],
        setupQuery: `
            CREATE TABLE fornecedores (id INTEGER PRIMARY KEY, nome TEXT, cnpj TEXT, cidade TEXT);
            CREATE TABLE produtos (id INTEGER PRIMARY KEY, nome TEXT, fornecedor_id INTEGER, categoria TEXT, preco INTEGER, estoque INTEGER, FOREIGN KEY(fornecedor_id) REFERENCES fornecedores(id));
            CREATE TABLE vendas (id INTEGER PRIMARY KEY, produto_id INTEGER, quantidade INTEGER, data_venda TEXT, FOREIGN KEY(produto_id) REFERENCES produtos(id));
            INSERT INTO fornecedores VALUES (1, 'Neo Química', '111', 'SP'), (2, 'EMS', '222', 'SP'), (3, 'Medley', '333', 'Campinas');
            INSERT INTO produtos VALUES (1, 'Dipirona 500mg', 1, 'Analgésico', 10, 500), (2, 'Amoxicilina', 2, 'Antibiótico', 35, 120), (3, 'Loratadina', 3, 'Antialérgico', 20, 300), (4, 'Ibuprofeno', 1, 'Analgésico', 15, 0);
            INSERT INTO vendas VALUES (1, 1, 50, '2023-11-01'), (2, 2, 10, '2023-11-02'), (3, 3, 25, '2023-11-03');
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Estoque Total", icon: '<i class="ph-fill ph-package"></i>', theory: "No centro de distribuição, o primeiro passo é ver os <code>produtos</code>.", task: "Escreva uma query para listar TODOS os dados (*) de todos os <code>produtos</code>.", startCode: "SELECT \n\nFROM produtos;", solution: "SELECT * \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('estoque') && res[0].values.length >= 4 },
            { id: 1, moduleId: 1, title: "2. Tabela de Preços", icon: '<i class="ph-fill ph-tag"></i>', theory: "As farmácias clientes precisam apenas do nome e do preço.", task: "Selecione apenas as colunas <code>nome</code> e <code>preco</code> da tabela <code>produtos</code>.", startCode: "SELECT \n    \nFROM produtos;", solution: "SELECT nome, preco \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('preco') },
            { id: 2, moduleId: 1, title: "3. Tipos de Remédios", icon: '<i class="ph-fill ph-first-aid"></i>', theory: "Quais classificações oferecemos? Usamos <code>DISTINCT</code>.", task: "Descubra quais são as diferentes categorias. Selecione valores ÚNICOS da coluna <code>categoria</code> na tabela <code>produtos</code>.", startCode: "SELECT DISTINCT \nFROM produtos;", solution: "SELECT DISTINCT categoria \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length === 3 },
            { id: 3, moduleId: 2, title: "4. Produtos Zerados", icon: '<i class="ph-fill ph-warning"></i>', theory: "Precisamos repor o estoque! O <code>WHERE</code> acha o que acabou.", task: "Selecione todos os <code>produtos</code> onde o <code>estoque</code> seja igual a 0.", startCode: "SELECT * \nFROM produtos\nWHERE ;", solution: "SELECT * \nFROM produtos\nWHERE estoque = 0;", validator: (res) => res && res[0] && res[0].values.every(row => row[5] === 0) },
            { id: 4, moduleId: 2, title: "5. Analgésicos Baratos", icon: '<i class="ph-fill ph-intersect"></i>', theory: "Combine filtros com <code>AND</code> para campanhas promocionais.", task: "Busque produtos onde a <code>categoria</code> seja 'Analgésico' E o <code>preco</code> seja menor ou igual a 15.", startCode: "SELECT * \nFROM produtos\nWHERE \nAND ;", solution: "SELECT * \nFROM produtos\nWHERE categoria = 'Analgésico' \nAND preco <= 15;", validator: (res) => res && res[0] && res[0].values.every(row => row[3] === 'Analgésico' && row[4] <= 15) },
            { id: 5, moduleId: 2, title: "6. Do Mais Caro pro Mais Barato", icon: '<i class="ph-fill ph-sort-descending"></i>', theory: "Ordene a tabela de produtos. Use <code>ORDER BY DESC</code>.", task: "Selecione o <code>nome</code> e o <code>preco</code>, ordenados pelo preço de forma decrescente (DESC).", startCode: "SELECT nome, preco \nFROM produtos\nORDER BY ;", solution: "SELECT nome, preco \nFROM produtos\nORDER BY preco DESC;", validator: (res) => { if(!res || !res[0]) return false; const vals = res[0].values; return vals[0][1] >= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. O Remédio Mais Caro", icon: '<i class="ph-fill ph-star"></i>', theory: "Combine ORDER BY e LIMIT para achar o topo da lista.", task: "Recupere apenas o 1 produto mais caro da tabela. Use ORDER BY e LIMIT 1.", startCode: "SELECT * \nFROM produtos\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM produtos\nORDER BY preco DESC\nLIMIT 1;", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][4] === 35 },
            { id: 7, moduleId: 3, title: "8. Quantos Fornecedores?", icon: '<i class="ph-fill ph-truck"></i>', theory: "A função <code>COUNT(*)</code> mede o tamanho da rede de distribuição.", task: "Conte quantos laboratórios temos na tabela <code>fornecedores</code>.", startCode: "SELECT \nFROM fornecedores;", solution: "SELECT COUNT(*) \nFROM fornecedores;", validator: (res) => res && res[0] && res[0].values[0][0] >= 3 },
            { id: 8, moduleId: 3, title: "9. Caixas Vendidas", icon: '<i class="ph-fill ph-shopping-cart"></i>', theory: "O diretor quer saber o total de caixas movimentadas com <code>SUM()</code>.", task: "Calcule a soma (SUM) da <code>quantidade</code> de todas as vendas na tabela <code>vendas</code>.", startCode: "SELECT \nFROM vendas;", solution: "SELECT SUM(quantidade) \nFROM vendas;", validator: (res) => res && res[0] && res[0].values[0][0] > 80 },
            { id: 9, moduleId: 3, title: "10. Medicamentos por Categoria", icon: '<i class="ph-fill ph-chart-bar"></i>', theory: "Agrupe o inventário com o <code>GROUP BY</code>.", task: "Mostre a <code>categoria</code> e conte quantos produtos existem em cada usando <code>COUNT(*)</code>.", startCode: "SELECT categoria, \nFROM produtos\nGROUP BY ;", solution: "SELECT categoria, COUNT(*) \nFROM produtos\nGROUP BY categoria;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length === 3 },
            { id: 10, moduleId: 4, title: "11. Catálogo do Laboratório", icon: '<i class="ph-fill ph-link"></i>', theory: "Integre dados com <code>JOIN</code>.", task: "Faça um JOIN de <code>produtos</code> com <code>fornecedores</code> usando o <code>fornecedor_id</code>. Selecione nome do produto e nome do fornecedor.", startCode: "SELECT produtos.nome, fornecedores.nome as laboratorio\nFROM produtos\nJOIN fornecedores \nON produtos.fornecedor_id = ;", solution: "SELECT produtos.nome, fornecedores.nome as laboratorio\nFROM produtos\nJOIN fornecedores \nON produtos.fornecedor_id = fornecedores.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 4 },
            { id: 11, moduleId: 4, title: "12. Relatório de Vendas", icon: '<i class="ph-fill ph-git-merge"></i>', theory: "Triplo JOIN para ver a venda completa.", task: "Faça um JOIN de vendas, produtos e fornecedores. Selecione fornecedores.nome e vendas.quantidade.", startCode: "SELECT fornecedores.nome, vendas.quantidade\nFROM vendas\nJOIN produtos ON vendas.produto_id = produtos.id\nJOIN fornecedores ON ;", solution: "SELECT fornecedores.nome, vendas.quantidade\nFROM vendas\nJOIN produtos ON vendas.produto_id = produtos.id\nJOIN fornecedores ON produtos.fornecedor_id = fornecedores.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 3 },
            { id: 12, moduleId: 5, title: "13. Novo Lançamento", icon: '<i class="ph-fill ph-plus-circle"></i>', theory: "Adicionando produtos com <code>INSERT INTO</code>.", task: "Insira um novo produto: nome 'Paracetamol', fornecedor 2, categoria 'Analgésico', preco 12, estoque 100.", startCode: "INSERT INTO produtos (nome, fornecedor_id, categoria, preco, estoque)\nVALUES ('', , '', , );\n\nSELECT * FROM produtos;", solution: "INSERT INTO produtos (nome, fornecedor_id, categoria, preco, estoque)\nVALUES ('Paracetamol', 2, 'Analgésico', 12, 100);\n\nSELECT * FROM produtos;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Paracetamol') },
            { id: 13, moduleId: 5, title: "14. Reposição de Estoque", icon: '<i class="ph-fill ph-package"></i>', theory: "Chegou caminhão! Usamos <code>UPDATE</code>.", task: "Atualize o <code>estoque</code> do 'Ibuprofeno' (id=4) para 200.", startCode: "UPDATE produtos\nSET estoque = \nWHERE id = ;\n\nSELECT * FROM produtos WHERE id = 4;", solution: "UPDATE produtos\nSET estoque = 200\nWHERE id = 4;\n\nSELECT * FROM produtos WHERE id = 4;", validator: (res) => res && res[0] && res[0].values.some(row => row[0] === 4 && row[5] === 200) },
            { id: 14, moduleId: 5, title: "15. Produto Descontinuado", icon: '<i class="ph-fill ph-trash"></i>', theory: "Laboratório parou de fabricar. Remova com <code>DELETE</code>.", task: "Delete a venda cujo id é 3.", startCode: "DELETE FROM vendas\nWHERE id = ;\n\nSELECT * FROM vendas;", solution: "DELETE FROM vendas\nWHERE id = 3;\n\nSELECT * FROM vendas;", validator: (res) => res && res[0] && !res[0].values.some(row => row[0] === 3) },
            { id: 15, moduleId: 6, title: "16. Estoque Crítico", icon: '<i class="ph-fill ph-warning"></i>', theory: "Subqueries para comparar valores com totais globais.", task: "Selecione produtos com estoque menor que a média geral.", startCode: "SELECT * FROM produtos \nWHERE estoque < (SELECT ...);", solution: "SELECT * FROM produtos WHERE estoque < (SELECT AVG(estoque) FROM produtos);", validator: (res) => res && res[0] && res[0].values.length > 0 },
            { id: 16, moduleId: 7, title: "17. Curva ABC", icon: '<i class="ph-fill ph-chart-bar"></i>', theory: "Ranking de vendas por quantidade usando window functions.", task: "Use <code>DENSE_RANK()</code> para rankear produtos por estoque.", startCode: "SELECT nome, estoque, \nDENSE_RANK() OVER(ORDER BY estoque DESC) as rank \nFROM produtos;", solution: "SELECT nome, estoque, DENSE_RANK() OVER(ORDER BY estoque DESC) as rank FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('rank') },
            { id: 17, moduleId: 8, title: "18. Validade de Lote", icon: '<i class="ph-fill ph-seal-check"></i>', theory: "Lógica condicional para alertas de reposição.", task: "Se estoque < 150 então 'Repor', senão 'OK'.", startCode: "SELECT nome, \nCASE WHEN estoque < 150 THEN 'Repor' \nELSE 'OK' END as status_estoque \nFROM produtos;", solution: "SELECT nome, CASE WHEN estoque < 150 THEN 'Repor' ELSE 'OK' END as status_estoque FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('status_estoque') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> converte para MAIÚSCULAS, <b>LOWER()</b> para minúsculas.", task: "Selecione o <code>nome</code> dos produtos em MAIÚSCULAS e a <code>categoria</code> em minúsculas.", startCode: "SELECT UPPER(nome), LOWER(categoria) \nFROM produtos;", solution: "SELECT UPPER(nome), LOWER(categoria) FROM produtos;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. SUBSTR / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai fragmento. <b>LENGTH()</b> conta caracteres.", task: "Selecione os 5 primeiros caracteres do <code>nome</code> como 'sigla' e o comprimento como 'tamanho' dos produtos.", startCode: "SELECT SUBSTR(nome, 1, 5) as sigla, LENGTH(nome) as tamanho \nFROM produtos;", solution: "SELECT SUBSTR(nome, 1, 5) as sigla, LENGTH(nome) as tamanho FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('sigla') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo,'de','para')</b> substitui texto. <b>||</b> concatena strings.", task: "Crie 'rotulo' juntando <code>nome</code> + ' (' + <code>categoria</code> + ')' usando <code>||</code>.", startCode: "SELECT nome || ' (' || categoria || ')' as rotulo \nFROM produtos;", solution: "SELECT nome || ' (' || categoria || ')' as rotulo FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('rotulo') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar"></i>', theory: "<b>STRFTIME('%Y', data)</b> extrai o ano. <b>julianday()</b> calcula diferença em dias (DATEDIFF).", task: "Nas vendas, mostre o <code>id</code>, o mês com <code>STRFTIME('%m', data_venda)</code> como 'mes' e os dias decorridos desde a venda como 'dias_atras'.", startCode: "SELECT id, \n  STRFTIME('%m', data_venda) as mes,\n  CAST(julianday('now') - julianday(data_venda) AS INTEGER) as dias_atras\nFROM vendas;", solution: "SELECT id, STRFTIME('%m', data_venda) as mes, CAST(julianday('now') - julianday(data_venda) AS INTEGER) as dias_atras FROM vendas;", validator: (res) => res && res[0] && res[0].columns.includes('mes') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-speedometer"></i>', theory: "Acelere a busca por categorias.", task: "Crie um índice chamado <code>idx_cat</code> na coluna <code>categoria</code> da tabela produtos.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_cat ON produtos(categoria);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('produtos')"); return check[0].values.some(v => v[1] === 'idx_cat'); } catch(e) { return false; } } }
        ]
    },
    saude: {
        title: "Stockler Saúde",
        icon: '<i class="ph-fill ph-heartbeat"></i>',
        schema: [
            '<li><span class="schema-box-highlight">beneficiarios</span>: <code>id</code>, <code>nome</code>, <code>plano</code>, <code>mensalidade</code>, <code>status</code></li>',
            '<li><span class="schema-box-highlight">hospitais</span>: <code>id</code>, <code>nome</code>, <code>cidade</code>, <code>nivel_atendimento</code></li>',
            '<li><span class="schema-box-highlight">consultas</span>: <code>id</code>, <code>beneficiario_id</code>, <code>hospital_id</code>, <code>data</code>, <code>coparticipacao</code></li>'
        ],
        setupQuery: `
            CREATE TABLE beneficiarios (id INTEGER PRIMARY KEY, nome TEXT, plano TEXT, mensalidade INTEGER, status TEXT);
            CREATE TABLE hospitais (id INTEGER PRIMARY KEY, nome TEXT, cidade TEXT, nivel_atendimento TEXT);
            CREATE TABLE consultas (id INTEGER PRIMARY KEY, beneficiario_id INTEGER, hospital_id INTEGER, data TEXT, coparticipacao INTEGER, FOREIGN KEY(beneficiario_id) REFERENCES beneficiarios(id), FOREIGN KEY(hospital_id) REFERENCES hospitais(id));
            INSERT INTO beneficiarios VALUES (1, 'Ana Clara', 'Básico', 250, 'Ativo'), (2, 'Bruno Santos', 'Premium', 600, 'Ativo'), (3, 'Carlos Lima', 'Básico', 250, 'Cancelado'), (4, 'Diana Costa', 'Executivo', 900, 'Ativo');
            INSERT INTO hospitais VALUES (1, 'Hospital São José', 'Belo Horizonte', 'Alta Complexidade'), (2, 'Clínica Vida', 'Contagem', 'Pronto Atendimento'), (3, 'Hospital da Luz', 'Belo Horizonte', 'Alta Complexidade');
            INSERT INTO consultas VALUES (1, 1, 2, '2023-12-01', 30), (2, 2, 1, '2023-12-05', 0), (3, 4, 3, '2023-12-10', 0), (4, 1, 2, '2023-12-15', 30);
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Carteira de Clientes", icon: '<i class="ph-fill ph-users"></i>', theory: "Bem-vindo à operadora de saúde! Nossa base principal é a tabela de <code>beneficiarios</code>.", task: "Liste TODOS os dados (*) de todos os <code>beneficiarios</code>.", startCode: "SELECT \n\nFROM beneficiarios;", solution: "SELECT * \nFROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.includes('plano') && res[0].values.length >= 4 },
            { id: 1, moduleId: 1, title: "2. Foco na Receita", icon: '<i class="ph-fill ph-currency-dollar"></i>', theory: "O setor financeiro precisa apenas do nome e do valor pago.", task: "Selecione as colunas <code>nome</code> e <code>mensalidade</code> da tabela <code>beneficiarios</code>.", startCode: "SELECT \n    \nFROM beneficiarios;", solution: "SELECT nome, mensalidade \nFROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('mensalidade') },
            { id: 2, moduleId: 1, title: "3. Tipos de Planos", icon: '<i class="ph-fill ph-list-dashes"></i>', theory: "Quais planos de saúde a Stockler vende? Use <code>DISTINCT</code>.", task: "Descubra os planos disponíveis. Selecione valores ÚNICOS da coluna <code>plano</code> na tabela <code>beneficiarios</code>.", startCode: "SELECT DISTINCT \nFROM beneficiarios;", solution: "SELECT DISTINCT plano \nFROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length === 3 },
            { id: 3, moduleId: 2, title: "4. Apenas Ativos", icon: '<i class="ph-fill ph-check-circle"></i>', theory: "Não cobrimos pessoas com plano cancelado. Use o <code>WHERE</code>.", task: "Selecione todos os <code>beneficiarios</code> onde o <code>status</code> seja 'Ativo'.", startCode: "SELECT * \nFROM beneficiarios\nWHERE ;", solution: "SELECT * \nFROM beneficiarios\nWHERE status = 'Ativo';", validator: (res) => res && res[0] && res[0].values.every(row => row[4] === 'Ativo') },
            { id: 4, moduleId: 2, title: "5. Plano Básico em BH", icon: '<i class="ph-fill ph-intersect"></i>', theory: "Hospitais credenciados podem ter múltiplos filtros usando <code>AND</code>.", task: "Busque hospitais na tabela <code>hospitais</code> onde a <code>cidade</code> seja 'Belo Horizonte' E o <code>nivel_atendimento</code> seja 'Alta Complexidade'.", startCode: "SELECT * \nFROM hospitais\nWHERE \nAND ;", solution: "SELECT * \nFROM hospitais\nWHERE cidade = 'Belo Horizonte' \nAND nivel_atendimento = 'Alta Complexidade';", validator: (res) => res && res[0] && res[0].values.every(row => row[2] === 'Belo Horizonte' && row[3] === 'Alta Complexidade') },
            { id: 5, moduleId: 2, title: "6. Do Menor ao Maior", icon: '<i class="ph-fill ph-sort-ascending"></i>', theory: "Ordene a base de dados. Use <code>ORDER BY ASC</code>.", task: "Selecione <code>nome</code> e <code>mensalidade</code> dos beneficiarios, ordenados pela mensalidade crescente (ASC).", startCode: "SELECT nome, mensalidade \nFROM beneficiarios\nORDER BY ;", solution: "SELECT nome, mensalidade \nFROM beneficiarios\nORDER BY mensalidade ASC;", validator: (res) => { if(!res || !res[0]) return false; const vals = res[0].values; return vals[0][1] <= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. O Plano Mais Caro", icon: '<i class="ph-fill ph-star"></i>', theory: "Use LIMIT para pegar o topo do ranking de mensalidades.", task: "Recupere o 1 beneficiário mais rentável. Use ORDER BY na mensalidade DESC e LIMIT 1.", startCode: "SELECT * \nFROM beneficiarios\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM beneficiarios\nORDER BY mensalidade DESC\nLIMIT 1;", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][3] === 900 },
            { id: 7, moduleId: 3, title: "8. Total de Vidas", icon: '<i class="ph-fill ph-users"></i>', theory: "A ANS exige saber o número de vidas seguradas. Use <code>COUNT(*)</code>.", task: "Conte quantas pessoas existem na tabela <code>beneficiarios</code>.", startCode: "SELECT \nFROM beneficiarios;", solution: "SELECT COUNT(*) \nFROM beneficiarios;", validator: (res) => res && res[0] && res[0].values[0][0] >= 4 },
            { id: 8, moduleId: 3, title: "9. Lucro com Coparticipação", icon: '<i class="ph-fill ph-coin"></i>', theory: "As taxas extras geram receita. Calcule com <code>SUM()</code>.", task: "Calcule a soma (SUM) de todas as taxas de <code>coparticipacao</code> na tabela <code>consultas</code>.", startCode: "SELECT \nFROM consultas;", solution: "SELECT SUM(coparticipacao) \nFROM consultas;", validator: (res) => res && res[0] && res[0].values[0][0] > 50 },
            { id: 9, moduleId: 3, title: "10. Vidas por Plano", icon: '<i class="ph-fill ph-chart-pie"></i>', theory: "Métricas gerenciais precisam do <code>GROUP BY</code>.", task: "Mostre o <code>plano</code> e conte quantos beneficiarios existem em cada um com <code>COUNT(*)</code>.", startCode: "SELECT plano, \nFROM beneficiarios\nGROUP BY ;", solution: "SELECT plano, COUNT(*) \nFROM beneficiarios\nGROUP BY plano;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length === 3 },
            { id: 10, moduleId: 4, title: "11. Faturamento de Consultas", icon: '<i class="ph-fill ph-link"></i>', theory: "Cancele o anonimato ligando dados com <code>JOIN</code>.", task: "Faça um JOIN de <code>consultas</code> com <code>beneficiarios</code> usando o <code>beneficiario_id</code>. Selecione o nome do paciente e o valor da coparticipação.", startCode: "SELECT beneficiarios.nome, consultas.coparticipacao\nFROM consultas\nJOIN beneficiarios \nON consultas.beneficiario_id = ;", solution: "SELECT beneficiarios.nome, consultas.coparticipacao\nFROM consultas\nJOIN beneficiarios \nON consultas.beneficiario_id = beneficiarios.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 4 },
            { id: 11, moduleId: 4, title: "12. Rastreio Hospitalar", icon: '<i class="ph-fill ph-git-merge"></i>', theory: "Auditoria completa com Triplo JOIN.", task: "Faça um JOIN de consultas, beneficiarios e hospitais. Selecione beneficiarios.nome e hospitais.nome.", startCode: "SELECT beneficiarios.nome, hospitais.nome\nFROM consultas\nJOIN beneficiarios ON consultas.beneficiario_id = beneficiarios.id\nJOIN hospitais ON ;", solution: "SELECT beneficiarios.nome, hospitais.nome\nFROM consultas\nJOIN beneficiarios ON consultas.beneficiario_id = beneficiarios.id\nJOIN hospitais ON consultas.hospital_id = hospitais.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 4 },
            { id: 12, moduleId: 5, title: "13. Novo Cliente", icon: '<i class="ph-fill ph-user-plus"></i>', theory: "O setor comercial vendeu um plano! Use <code>INSERT INTO</code>.", task: "Insira na tabela beneficiarios: nome 'Fernanda', plano 'Premium', mensalidade 600, status 'Ativo'.", startCode: "INSERT INTO beneficiarios (nome, plano, mensalidade, status)\nVALUES ('', '', , '');\n\nSELECT * FROM beneficiarios;", solution: "INSERT INTO beneficiarios (nome, plano, mensalidade, status)\nVALUES ('Fernanda', 'Premium', 600, 'Ativo');\n\nSELECT * FROM beneficiarios;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Fernanda') },
            { id: 13, moduleId: 5, title: "14. Reajuste Anual", icon: '<i class="ph-fill ph-trend-up"></i>', theory: "A inflação bateu. Atualize com <code>UPDATE</code>.", task: "Aumente a <code>mensalidade</code> do beneficiario de id=1 para 280.", startCode: "UPDATE beneficiarios\nSET mensalidade = \nWHERE id = ;\n\nSELECT * FROM beneficiarios WHERE id = 1;", solution: "UPDATE beneficiarios\nSET mensalidade = 280\nWHERE id = 1;\n\nSELECT * FROM beneficiarios WHERE id = 1;", validator: (res) => res && res[0] && res[0].values.some(row => row[0] === 1 && row[3] === 280) },
            { id: 14, moduleId: 5, title: "15. Descredenciamento", icon: '<i class="ph-fill ph-trash"></i>', theory: "Hospital rompeu contrato. Remova com <code>DELETE</code>.", task: "Delete a consulta registrada com o id 4.", startCode: "DELETE FROM consultas\nWHERE id = ;\n\nSELECT * FROM consultas;", solution: "DELETE FROM consultas\nWHERE id = 4;\n\nSELECT * FROM consultas;", validator: (res) => res && res[0] && !res[0].values.some(row => row[0] === 4) },
            { id: 15, moduleId: 6, title: "16. Pacientes VIPs", icon: '<i class="ph-fill ph-crown"></i>', theory: "Subqueries para identificar subconjuntos de elite.", task: "Selecione beneficiários que pagam acima da média de mensalidade.", startCode: "SELECT * FROM beneficiarios \nWHERE mensalidade > (SELECT ...);", solution: "SELECT * FROM beneficiarios WHERE mensalidade > (SELECT AVG(mensalidade) FROM beneficiarios);", validator: (res) => res && res[0] && res[0].values.length === 2 },
            { id: 16, moduleId: 7, title: "17. Fila de Atendimento", icon: '<i class="ph-fill ph-list-numbers"></i>', theory: "Numeração sequencial por grupos (PARTITION BY).", task: "Numere as consultas por beneficiário usando <code>ROW_NUMBER()</code>.", startCode: "SELECT beneficiario_id, data, \nROW_NUMBER() OVER(PARTITION BY beneficiario_id ORDER BY data) as seq \nFROM consultas;", solution: "SELECT beneficiario_id, data, ROW_NUMBER() OVER(PARTITION BY beneficiario_id ORDER BY data) as seq FROM consultas;", validator: (res) => res && res[0] && res[0].columns.includes('seq') },
            { id: 17, moduleId: 8, title: "18. Auditoria de Status", icon: '<i class="ph-fill ph-eye"></i>', theory: "Traduza códigos técnicos para linguagem humana.", task: "Se status for 'Cancelado' chame de 'Inativo', senão 'Vigente'.", startCode: "SELECT nome, \nCASE WHEN status = 'Cancelado' THEN 'Inativo' \nELSE 'Vigente' END as situacao \nFROM beneficiarios;", solution: "SELECT nome, CASE WHEN status = 'Cancelado' THEN 'Inativo' ELSE 'Vigente' END as situacao FROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.includes('situacao') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> converte para MAIÚSCULAS, <b>LOWER()</b> para minúsculas.", task: "Selecione o <code>nome</code> dos beneficiários em MAIÚSCULAS e o <code>plano</code> em minúsculas.", startCode: "SELECT UPPER(nome), LOWER(plano) \nFROM beneficiarios;", solution: "SELECT UPPER(nome), LOWER(plano) FROM beneficiarios;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. SUBSTR / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai fragmento do texto. <b>LENGTH()</b> conta caracteres.", task: "Selecione os 4 primeiros caracteres do <code>plano</code> como 'cod_plano' e seu comprimento como 'tamanho'.", startCode: "SELECT SUBSTR(plano, 1, 4) as cod_plano, LENGTH(plano) as tamanho \nFROM beneficiarios;", solution: "SELECT SUBSTR(plano, 1, 4) as cod_plano, LENGTH(plano) as tamanho FROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.includes('cod_plano') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo,'de','para')</b> substitui texto. <b>||</b> concatena (CONCAT).", task: "Crie 'ficha' juntando <code>nome</code> + ' [' + <code>plano</code> + ']' com <code>||</code>. Substitua 'Básico' por 'BASIC' no plano.", startCode: "SELECT nome || ' [' || plano || ']' as ficha,\n  REPLACE(plano, 'Básico', 'BASIC') as plano_en\nFROM beneficiarios;", solution: "SELECT nome || ' [' || plano || ']' as ficha, REPLACE(plano, 'Básico', 'BASIC') as plano_en FROM beneficiarios;", validator: (res) => res && res[0] && res[0].columns.includes('ficha') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar-blank"></i>', theory: "<b>STRFTIME('%m', data)</b> extrai o mês. <b>julianday()</b> calcula diferença em dias.", task: "Nas consultas, mostre o <code>id</code>, o mês da consulta como 'mes', e quantos dias atrás ela ocorreu como 'dias_atras'.", startCode: "SELECT id, \n  STRFTIME('%m', data) as mes,\n  CAST(julianday('now') - julianday(data) AS INTEGER) as dias_atras\nFROM consultas;", solution: "SELECT id, STRFTIME('%m', data) as mes, CAST(julianday('now') - julianday(data) AS INTEGER) as dias_atras FROM consultas;", validator: (res) => res && res[0] && res[0].columns.includes('mes') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-hard-drives"></i>', theory: "Índices compostos para consultas complexas.", task: "Crie um índice chamado <code>idx_hosp_data</code> nas colunas <code>hospital_id</code> e <code>data</code>.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_hosp_data ON consultas(hospital_id, data);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('consultas')"); return check[0].values.some(v => v[1] === 'idx_hosp_data'); } catch(e) { return false; } } }
        ]
    },
    construtora: {
        title: "Stockler Construtora",
        icon: '<i class="ph-fill ph-buildings"></i>',
        schema: [
            '<li><span class="schema-box-highlight">obras</span>: <code>id</code>, <code>nome_empreendimento</code>, <code>cidade</code>, <code>orcamento</code>, <code>status</code></li>',
            '<li><span class="schema-box-highlight">funcionarios</span>: <code>id</code>, <code>nome</code>, <code>cargo</code>, <code>salario</code>, <code>obra_id</code></li>',
            '<li><span class="schema-box-highlight">materiais</span>: <code>id</code>, <code>descricao</code>, <code>custo_unidade</code>, <code>quantidade</code>, <code>obra_id</code></li>'
        ],
        setupQuery: `
            CREATE TABLE obras (id INTEGER PRIMARY KEY, nome_empreendimento TEXT, cidade TEXT, orcamento INTEGER, status TEXT);
            CREATE TABLE funcionarios (id INTEGER PRIMARY KEY, nome TEXT, cargo TEXT, salario INTEGER, obra_id INTEGER, FOREIGN KEY(obra_id) REFERENCES obras(id));
            CREATE TABLE materiais (id INTEGER PRIMARY KEY, descricao TEXT, custo_unidade INTEGER, quantidade INTEGER, obra_id INTEGER, FOREIGN KEY(obra_id) REFERENCES obras(id));
            INSERT INTO obras VALUES (1, 'Residencial Horizonte', 'São Paulo', 5000000, 'Em Andamento'), (2, 'Edifício Central', 'Rio de Janeiro', 8500000, 'Planejamento'), (3, 'Condomínio das Árvores', 'São Paulo', 3200000, 'Concluído');
            INSERT INTO funcionarios VALUES (1, 'Marcos Silva', 'Engenheiro', 12000, 1), (2, 'José Souza', 'Pedreiro', 3500, 1), (3, 'Aline Ferreira', 'Arquiteta', 11000, 2), (4, 'Roberto Dias', 'Mestre de Obras', 6000, 1);
            INSERT INTO materiais VALUES (1, 'Cimento (Saco)', 35, 1000, 1), (2, 'Tijolo (Milheiro)', 800, 50, 1), (3, 'Aço CA50', 500, 20, 2);
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Projetos Atuais", icon: '<i class="ph-fill ph-blueprint"></i>', theory: "Bem-vindo à Engenharia! Tudo começa com nossos empreendimentos na tabela <code>obras</code>.", task: "Liste TODOS os dados (*) de todas as <code>obras</code>.", startCode: "SELECT \n\nFROM obras;", solution: "SELECT * \nFROM obras;", validator: (res) => res && res[0] && res[0].columns.includes('orcamento') && res[0].values.length >= 3 },
            { id: 1, moduleId: 1, title: "2. Planilha de Custos", icon: '<i class="ph-fill ph-wallet"></i>', theory: "O financeiro quer saber os orçamentos macro.", task: "Selecione as colunas <code>nome_empreendimento</code> e <code>orcamento</code> da tabela <code>obras</code>.", startCode: "SELECT \n    \nFROM obras;", solution: "SELECT nome_empreendimento, orcamento \nFROM obras;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('orcamento') },
            { id: 2, moduleId: 1, title: "3. Mapa de Atuação", icon: '<i class="ph-fill ph-map-pin"></i>', theory: "Em quais cidades nós estamos construindo? Use <code>DISTINCT</code>.", task: "Selecione valores ÚNICOS da coluna <code>cidade</code> na tabela <code>obras</code>.", startCode: "SELECT DISTINCT \nFROM obras;", solution: "SELECT DISTINCT cidade \nFROM obras;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length === 2 },
            { id: 3, moduleId: 2, title: "4. Mão na Massa", icon: '<i class="ph-fill ph-crane"></i>', theory: "Obras concluídas não precisam de materiais. Use <code>WHERE</code>.", task: "Selecione todas as <code>obras</code> onde o <code>status</code> seja 'Em Andamento'.", startCode: "SELECT * \nFROM obras\nWHERE ;", solution: "SELECT * \nFROM obras\nWHERE status = 'Em Andamento';", validator: (res) => res && res[0] && res[0].values.every(row => row[4] === 'Em Andamento') },
            { id: 4, moduleId: 2, title: "5. Engenheiros Caros", icon: '<i class="ph-fill ph-intersect"></i>', theory: "Auditoria de folha de pagamento exige cruzamento com <code>AND</code>.", task: "Busque na tabela <code>funcionarios</code> quem tem o <code>cargo</code> de 'Engenheiro' E ganha um <code>salario</code> maior que 10000.", startCode: "SELECT * \nFROM funcionarios\nWHERE \nAND ;", solution: "SELECT * \nFROM funcionarios\nWHERE cargo = 'Engenheiro' \nAND salario > 10000;", validator: (res) => res && res[0] && res[0].values.every(row => row[2] === 'Engenheiro' && row[3] > 10000) },
            { id: 5, moduleId: 2, title: "6. Do Barato ao Caro", icon: '<i class="ph-fill ph-sort-ascending"></i>', theory: "Classifique a compra de insumos. Use <code>ORDER BY ASC</code>.", task: "Selecione a <code>descricao</code> e o <code>custo_unidade</code> dos materiais, em ordem crescente (ASC).", startCode: "SELECT descricao, custo_unidade \nFROM materiais\nORDER BY ;", solution: "SELECT descricao, custo_unidade \nFROM materiais\nORDER BY custo_unidade ASC;", validator: (res) => { if(!res || !res[0]) return false; const vals = res[0].values; return vals[0][1] <= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. O Maior Projeto", icon: '<i class="ph-fill ph-star"></i>', theory: "Use LIMIT para descobrir nossa obra de maior risco financeiro.", task: "Recupere 1 única obra com o maior orçamento. Use ORDER BY DESC e LIMIT 1.", startCode: "SELECT * \nFROM obras\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM obras\nORDER BY orcamento DESC\nLIMIT 1;", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][3] === 8500000 },
            { id: 7, moduleId: 3, title: "8. Equipe Total", icon: '<i class="ph-fill ph-users"></i>', theory: "Quantas pessoas trabalham conosco? Use <code>COUNT(*)</code>.", task: "Conte quantas pessoas existem na tabela <code>funcionarios</code>.", startCode: "SELECT \nFROM funcionarios;", solution: "SELECT COUNT(*) \nFROM funcionarios;", validator: (res) => res && res[0] && res[0].values[0][0] >= 4 },
            { id: 8, moduleId: 3, title: "9. Risco Orçamentário", icon: '<i class="ph-fill ph-bank"></i>', theory: "A soma de todas as obras revela o tamanho da construtora. Use <code>SUM()</code>.", task: "Calcule a soma (SUM) de todo o <code>orcamento</code> na tabela <code>obras</code>.", startCode: "SELECT \nFROM obras;", solution: "SELECT SUM(orcamento) \nFROM obras;", validator: (res) => res && res[0] && res[0].values[0][0] > 10000000 },
            { id: 9, moduleId: 3, title: "10. Cargos na Empresa", icon: '<i class="ph-fill ph-hard-hat"></i>', theory: "A estrutura organizacional precisa do <code>GROUP BY</code>.", task: "Mostre o <code>cargo</code> e conte quantos funcionarios existem em cada um com <code>COUNT(*)</code>.", startCode: "SELECT cargo, \nFROM funcionarios\nGROUP BY ;", solution: "SELECT cargo, COUNT(*) \nFROM funcionarios\nGROUP BY cargo;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length === 4 },
            { id: 10, moduleId: 4, title: "11. Alocação de Pessoal", icon: '<i class="ph-fill ph-link"></i>', theory: "Quem trabalha onde? Descubra ligando dados com <code>JOIN</code>.", task: "Faça um JOIN de <code>funcionarios</code> com <code>obras</code> usando o <code>obra_id</code>. Selecione o nome do funcionário e o nome do empreendimento.", startCode: "SELECT funcionarios.nome, obras.nome_empreendimento\nFROM funcionarios\nJOIN obras \nON funcionarios.obra_id = ;", solution: "SELECT funcionarios.nome, obras.nome_empreendimento\nFROM funcionarios\nJOIN obras \nON funcionarios.obra_id = obras.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 4 },
            { id: 11, moduleId: 4, title: "12. Rastreio de Insumos", icon: '<i class="ph-fill ph-git-merge"></i>', theory: "Um JOIN ligando o material à obra responsável.", task: "Faça um JOIN de materiais e obras. Selecione obras.nome_empreendimento e materiais.descricao.", startCode: "SELECT obras.nome_empreendimento, materiais.descricao\nFROM materiais\nJOIN obras ON ;", solution: "SELECT obras.nome_empreendimento, materiais.descricao\nFROM materiais\nJOIN obras ON materiais.obra_id = obras.id;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].values.length >= 3 },
            { id: 12, moduleId: 5, title: "13. Nova Contratação", icon: '<i class="ph-fill ph-user-plus"></i>', theory: "O RH enviou os dados! Use <code>INSERT INTO</code>.", task: "Insira na tabela funcionarios: nome 'Tiago', cargo 'Pedreiro', salario 3500, obra_id 2.", startCode: "INSERT INTO funcionarios (nome, cargo, salario, obra_id)\nVALUES ('', '', , );\n\nSELECT * FROM funcionarios;", solution: "INSERT INTO funcionarios (nome, cargo, salario, obra_id)\nVALUES ('Tiago', 'Pedreiro', 3500, 2);\n\nSELECT * FROM funcionarios;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Tiago') },
            { id: 13, moduleId: 5, title: "14. Aditivo Contratual", icon: '<i class="ph-fill ph-trend-up"></i>', theory: "O cimento encareceu, a obra vai custar mais. Atualize com <code>UPDATE</code>.", task: "Aumente o <code>orcamento</code> da obra de id=1 para 5500000.", startCode: "UPDATE obras\nSET orcamento = \nWHERE id = ;\n\nSELECT * FROM obras WHERE id = 1;", solution: "UPDATE obras\nSET orcamento = 5500000\nWHERE id = 1;\n\nSELECT * FROM obras WHERE id = 1;", validator: (res) => res && res[0] && res[0].values.some(row => row[0] === 1 && row[3] === 5500000) },
            { id: 14, moduleId: 5, title: "15. Devolução de Material", icon: '<i class="ph-fill ph-trash"></i>', theory: "Compramos errado. Remova do estoque com <code>DELETE</code>.", task: "Delete o material com o id 3 (Aço).", startCode: "DELETE FROM materiais\nWHERE id = ;\n\nSELECT * FROM materiais;", solution: "DELETE FROM materiais\nWHERE id = 3;\n\nSELECT * FROM materiais;", validator: (res) => res && res[0] && !res[0].values.some(row => row[0] === 3) },
            { id: 15, moduleId: 6, title: "16. Custos Excedentes", icon: '<i class="ph-fill ph-money"></i>', theory: "Subqueries para identificar itens acima da média de custos.", task: "Selecione materiais com custo unitário maior que a média geral.", startCode: "SELECT * FROM materiais \nWHERE custo_unidade > (SELECT ...);", solution: "SELECT * FROM materiais WHERE custo_unidade > (SELECT AVG(custo_unidade) FROM materiais);", validator: (res) => res && res[0] && res[0].values.length === 1 },
            { id: 16, moduleId: 7, title: "17. Ordem de Compra", icon: '<i class="ph-fill ph-list-checks"></i>', theory: "Numeração de linhas para logística.", task: "Use <code>ROW_NUMBER()</code> para numerar os materiais por obra.", startCode: "SELECT obra_id, descricao, \nROW_NUMBER() OVER(PARTITION BY obra_id ORDER BY descricao) as item_num \nFROM materiais;", solution: "SELECT obra_id, descricao, ROW_NUMBER() OVER(PARTITION BY obra_id ORDER BY descricao) as item_num FROM materiais;", validator: (res) => res && res[0] && res[0].columns.includes('item_num') },
            { id: 17, moduleId: 8, title: "18. Porte do Projeto", icon: '<i class="ph-fill ph-blueprint"></i>', theory: "Classifique o tamanho da obra com <code>CASE WHEN</code>.", task: "Se orcamento > 5M 'Grande', senão 'Médio'.", startCode: "SELECT nome_empreendimento, \nCASE WHEN orcamento > 5000000 THEN 'Grande' \nELSE 'Médio' END as porte \nFROM obras;", solution: "SELECT nome_empreendimento, CASE WHEN orcamento > 5000000 THEN 'Grande' ELSE 'Médio' END as porte FROM obras;", validator: (res) => res && res[0] && res[0].columns.includes('porte') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> para MAIÚSCULAS, <b>LOWER()</b> para minúsculas.", task: "Selecione o <code>nome</code> dos funcionários em MAIÚSCULAS e o <code>cargo</code> em minúsculas.", startCode: "SELECT UPPER(nome), LOWER(cargo) \nFROM funcionarios;", solution: "SELECT UPPER(nome), LOWER(cargo) FROM funcionarios;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. SUBSTR / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai fragmento. <b>LENGTH()</b> conta caracteres.", task: "Selecione os 3 primeiros caracteres do <code>cargo</code> como 'sigla' e o comprimento total como 'tamanho'.", startCode: "SELECT SUBSTR(cargo, 1, 3) as sigla, LENGTH(cargo) as tamanho \nFROM funcionarios;", solution: "SELECT SUBSTR(cargo, 1, 3) as sigla, LENGTH(cargo) as tamanho FROM funcionarios;", validator: (res) => res && res[0] && res[0].columns.includes('sigla') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo,'de','para')</b> substitui texto. <b>||</b> concatena strings.", task: "Crie 'cracha' juntando <code>nome</code> + ' | ' + <code>cargo</code>. Substitua 'Pedreiro' por 'Mason' no cargo.", startCode: "SELECT nome || ' | ' || cargo as cracha,\n  REPLACE(cargo, 'Pedreiro', 'Mason') as cargo_en\nFROM funcionarios;", solution: "SELECT nome || ' | ' || cargo as cracha, REPLACE(cargo, 'Pedreiro', 'Mason') as cargo_en FROM funcionarios;", validator: (res) => res && res[0] && res[0].columns.includes('cracha') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar"></i>', theory: "<b>DATE('now')</b> retorna a data de hoje. <b>julianday()</b> calcula diferença entre datas (DATEDIFF).", task: "Consulte obras e calcule quantos dias uma obra imaginária iniciada em 2023-01-01 já dura: use <code>CAST(julianday('now') - julianday('2023-01-01') AS INTEGER)</code> como 'dias_em_obra'.", startCode: "SELECT nome_empreendimento, \n  CAST(julianday('now') - julianday('2023-01-01') AS INTEGER) as dias_em_obra\nFROM obras;", solution: "SELECT nome_empreendimento, CAST(julianday('now') - julianday('2023-01-01') AS INTEGER) as dias_em_obra FROM obras;", validator: (res) => res && res[0] && res[0].columns.includes('dias_em_obra') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-rocket-launch"></i>', theory: "Acelere a busca de funcionários por obra.", task: "Crie um índice chamado <code>idx_func_obra</code> na coluna <code>obra_id</code>.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_func_obra ON funcionarios(obra_id);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('funcionarios')"); return check[0].values.some(v => v[1] === 'idx_func_obra'); } catch(e) { return false; } } }
        ]
    },
    varejo: {
        title: "Stockler Varejo (AdventureWorks)",
        icon: '<i class="ph-fill ph-shopping-cart"></i>',
        schema: [
            '<li><span class="schema-box-highlight">produtos</span>: <code>id</code>, <code>nome</code>, <code>categoria</code>, <code>cor</code>, <code>preco</code></li>',
            '<li><span class="schema-box-highlight">vendedores</span>: <code>id</code>, <code>nome</code>, <code>territorio</code>, <code>meta_vendas</code></li>',
            '<li><span class="schema-box-highlight">vendas</span>: <code>id</code>, <code>produto_id</code>, <code>vendedor_id</code>, <code>quantidade</code>, <code>data</code></li>'
        ],
        setupQuery: `
            CREATE TABLE produtos (id INTEGER PRIMARY KEY, nome TEXT, categoria TEXT, cor TEXT, preco INTEGER);
            CREATE TABLE vendedores (id INTEGER PRIMARY KEY, nome TEXT, territorio TEXT, meta_vendas INTEGER);
            CREATE TABLE vendas (id INTEGER PRIMARY KEY, produto_id INTEGER, vendedor_id INTEGER, quantidade INTEGER, data TEXT, FOREIGN KEY(produto_id) REFERENCES produtos(id), FOREIGN KEY(vendedor_id) REFERENCES vendedores(id));
            INSERT INTO produtos VALUES (1, 'Bicicleta Montanha', 'Bicicletas', 'Preta', 2500), (2, 'Capacete Pro', 'Acessórios', 'Vermelho', 150), (3, 'Pedal Alumínio', 'Peças', 'Prata', 80), (4, 'Bicicleta Urbana', 'Bicicletas', 'Azul', 1800), (5, 'Luvas Gel', 'Acessórios', 'Preta', 60);
            INSERT INTO vendedores VALUES (1, 'Gustavo Stockler', 'Brasil', 50000), (2, 'Ana Costa', 'Europa', 45000), (3, 'John Doe', 'EUA', 60000);
            INSERT INTO vendas VALUES (1, 1, 1, 2, '2024-01-05'), (2, 2, 2, 5, '2024-01-06'), (3, 4, 1, 1, '2024-01-07'), (4, 3, 3, 10, '2024-01-08'), (5, 5, 2, 3, '2024-01-09');
        `,
        lessons: [
            { id: 0, moduleId: 1, title: "1. Catálogo de Produtos", icon: '<i class="ph-fill ph-shopping-cart"></i>', theory: "Bem-vindo ao AdventureWorks! Vamos começar explorando nosso catálogo de <code>produtos</code>.", task: "Liste TODOS os dados (*) de todos os <code>produtos</code>.", startCode: "SELECT \n\nFROM produtos;", solution: "SELECT * \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('categoria') && res[0].values.length >= 5 },
            { id: 1, moduleId: 1, title: "2. Lista de Preços", icon: '<i class="ph-fill ph-tag"></i>', theory: "O time de marketing precisa de uma lista simples com nome e preço.", task: "Selecione apenas as colunas <code>nome</code> e <code>preco</code> da tabela <code>produtos</code>.", startCode: "SELECT \n    \nFROM produtos;", solution: "SELECT nome, preco \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.length === 2 && res[0].columns.includes('preco') },
            { id: 2, moduleId: 1, title: "3. Cores Disponíveis", icon: '<i class="ph-fill ph-palette"></i>', theory: "Quais cores de produtos temos em estoque? Use <code>DISTINCT</code>.", task: "Selecione valores ÚNICOS da coluna <code>cor</code> na tabela <code>produtos</code>.", startCode: "SELECT DISTINCT \nFROM produtos;", solution: "SELECT DISTINCT cor \nFROM produtos;", validator: (res) => res && res[0] && res[0].columns.length === 1 && res[0].values.length >= 4 },
            { id: 3, moduleId: 2, title: "4. Bicicletas em Foco", icon: '<i class="ph-fill ph-bicycle"></i>', theory: "Filtre os dados para focar em uma categoria específica.", task: "Selecione todos os <code>produtos</code> onde a <code>categoria</code> seja 'Bicicletas'.", startCode: "SELECT * \nFROM produtos\nWHERE ;", solution: "SELECT * \nFROM produtos\nWHERE categoria = 'Bicicletas';", validator: (res) => res && res[0] && res[0].values.every(row => row[2] === 'Bicicletas') },
            { id: 4, moduleId: 2, title: "5. Vendedores de Alta Meta", icon: '<i class="ph-fill ph-target"></i>', theory: "Use operadores de comparação para encontrar metas agressivas.", task: "Busque vendedores onde a <code>meta_vendas</code> seja maior que 50000.", startCode: "SELECT * \nFROM vendedores\nWHERE ;", solution: "SELECT * \nFROM vendedores\nWHERE meta_vendas > 50000;", validator: (res) => res && res[0] && res[0].values.every(row => row[3] > 50000) },
            { id: 5, moduleId: 2, title: "6. Ordenação de Preços", icon: '<i class="ph-fill ph-sort-descending"></i>', theory: "Organize seus produtos do mais caro para o mais barato.", task: "Selecione <code>nome</code> e <code>preco</code> ordenados pelo preço de forma DECRESCENTE (DESC).", startCode: "SELECT nome, preco \nFROM produtos\nORDER BY ;", solution: "SELECT nome, preco \nFROM produtos\nORDER BY preco DESC;", validator: (res) => { if(!res || !res[0]) return false; const vals = res[0].values; return vals[0][1] >= vals[1][1]; } },
            { id: 6, moduleId: 2, title: "7. Top Vendedores", icon: '<i class="ph-fill ph-medal"></i>', theory: "Use LIMIT para identificar os líderes.", task: "Recupere o vendedor com a maior meta. Use ORDER BY e LIMIT 1.", startCode: "SELECT * \nFROM vendedores\nORDER BY \nLIMIT ;", solution: "SELECT * \nFROM vendedores\nORDER BY meta_vendas DESC\nLIMIT 1;", validator: (res) => res && res[0] && res[0].values.length === 1 && res[0].values[0][3] === 60000 },
            { id: 7, moduleId: 3, title: "8. Total de Produtos", icon: '<i class="ph-fill ph-hash"></i>', theory: "Conte o tamanho do nosso catálogo.", task: "Conte quantos produtos existem na tabela <code>produtos</code>.", startCode: "SELECT \nFROM produtos;", solution: "SELECT COUNT(*) \nFROM produtos;", validator: (res) => res && res[0] && res[0].values[0][0] >= 5 },
            { id: 8, moduleId: 3, title: "9. Volume de Vendas", icon: '<i class="ph-fill ph-chart-line"></i>', theory: "Calcule o volume total de itens vendidos.", task: "Some (SUM) a <code>quantidade</code> de todas as vendas na tabela <code>vendas</code>.", startCode: "SELECT \nFROM vendas;", solution: "SELECT SUM(quantidade) \nFROM vendas;", validator: (res) => res && res[0] && res[0].values[0][0] > 0 },
            { id: 9, moduleId: 3, title: "10. Média de Preços", icon: '<i class="ph-fill ph-calculator"></i>', theory: "Qual o ticket médio do nosso catálogo?", task: "Calcule a média (AVG) de <code>preco</code> da tabela <code>produtos</code>.", startCode: "SELECT \nFROM produtos;", solution: "SELECT AVG(preco) \nFROM produtos;", validator: (res) => res && res[0] && res[0].values[0][0] > 0 },
            { id: 10, moduleId: 4, title: "11. Vendas por Vendedor", icon: '<i class="ph-fill ph-link"></i>', theory: "Ligue as vendas aos seus respectivos vendedores.", task: "Faça um JOIN de <code>vendas</code> com <code>vendedores</code>. Selecione o nome do vendedor e a quantidade vendida.", startCode: "SELECT vendedores.nome, vendas.quantidade\nFROM vendas\nJOIN vendedores ON ;", solution: "SELECT vendedores.nome, vendas.quantidade\nFROM vendas\nJOIN vendedores ON vendas.vendedor_id = vendedores.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 5 },
            { id: 11, moduleId: 4, title: "12. Detalhes do Produto Vendido", icon: '<i class="ph-fill ph-shopping-bag"></i>', theory: "Saiba exatamente qual produto foi vendido em cada transação.", task: "Faça um JOIN de <code>vendas</code> com <code>produtos</code>. Selecione o nome do produto e a data da venda.", startCode: "SELECT produtos.nome, vendas.data\nFROM vendas\nJOIN produtos ON ;", solution: "SELECT produtos.nome, vendas.data\nFROM vendas\nJOIN produtos ON vendas.produto_id = produtos.id;", validator: (res) => res && res[0] && res[0].columns.includes('nome') && res[0].values.length >= 5 },
            { id: 12, moduleId: 5, title: "13. Cadastro de Novo Produto", icon: '<i class="ph-fill ph-plus"></i>', theory: "Adicione novos itens ao catálogo.", task: "Insira um novo produto: nome 'Bomba de Ar', categoria 'Acessórios', cor 'Cinza', preco 45.", startCode: "INSERT INTO produtos (nome, categoria, cor, preco)\nVALUES ('', '', '', );\n\nSELECT * FROM produtos;", solution: "INSERT INTO produtos (nome, categoria, cor, preco)\nVALUES ('Bomba de Ar', 'Acessórios', 'Cinza', 45);\n\nSELECT * FROM produtos;", validator: (res) => res && res[0] && res[0].values.some(row => row[1] === 'Bomba de Ar') },
            { id: 13, moduleId: 5, title: "14. Reajuste de Meta", icon: '<i class="ph-fill ph-trend-up"></i>', theory: "Atualize as metas dos vendedores.", task: "Aumente a <code>meta_vendas</code> do vendedor de id=1 para 55000.", startCode: "UPDATE vendedores\nSET meta_vendas = \nWHERE id = ;\n\nSELECT * FROM vendedores WHERE id = 1;", solution: "UPDATE vendedores\nSET meta_vendas = 55000\nWHERE id = 1;\n\nSELECT * FROM vendedores WHERE id = 1;", validator: (res) => res && res[0] && res[0].values.some(row => row[0] === 1 && row[3] === 55000) },
            { id: 14, moduleId: 5, title: "15. Estorno de Venda", icon: '<i class="ph-fill ph-trash"></i>', theory: "Remova registros incorretos.", task: "Delete a venda cujo id é 5.", startCode: "DELETE FROM vendas\nWHERE id = ;\n\nSELECT * FROM vendas;", solution: "DELETE FROM vendas\nWHERE id = 5;\n\nSELECT * FROM vendas;", validator: (res) => res && res[0] && !res[0].values.some(row => row[0] === 5) },
            { id: 15, moduleId: 6, title: "16. Produtos de Elite", icon: '<i class="ph-fill ph-sketch-logo"></i>', theory: "Subqueries para identificar o topo do catálogo.", task: "Selecione produtos cujo preço seja maior que a média.", startCode: "SELECT * FROM produtos \nWHERE preco > (SELECT ...);", solution: "SELECT * FROM produtos WHERE preco > (SELECT AVG(preco) FROM produtos);", validator: (res) => res && res[0] && res[0].values.length === 1 },
            { id: 16, moduleId: 7, title: "17. Ranking de Vendedores", icon: '<i class="ph-fill ph-trophy"></i>', theory: "Rankeie a performance com <code>RANK()</code>.", task: "Rankeie os vendedores por meta de vendas de forma decrescente.", startCode: "SELECT nome, meta_vendas, \nRANK() OVER(ORDER BY meta_vendas DESC) as rank \nFROM vendedores;", solution: "SELECT nome, meta_vendas, RANK() OVER(ORDER BY meta_vendas DESC) as rank FROM vendedores;", validator: (res) => res && res[0] && res[0].columns.includes('rank') },
            { id: 17, moduleId: 8, title: "18. Faixa de Preço", icon: '<i class="ph-fill ph-tag-chevron"></i>', theory: "Use <code>CASE WHEN</code> para criar categorias de preço.", task: "Se preço > 1000 'Premium', senão 'Comum'.", startCode: "SELECT nome, \nCASE WHEN preco > 1000 THEN 'Premium' \nELSE 'Comum' END as tipo \nFROM produtos;", solution: "SELECT nome, CASE WHEN preco > 1000 THEN 'Premium' ELSE 'Comum' END as tipo FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('tipo') },
            { id: 18, moduleId: 9, title: "19. UPPER / LOWER", icon: '<i class="ph-fill ph-text-aa"></i>', theory: "<b>UPPER()</b> para MAIÚSCULAS, <b>LOWER()</b> para minúsculas.", task: "Selecione o <code>nome</code> dos produtos em MAIÚSCULAS e a <code>cor</code> em minúsculas.", startCode: "SELECT UPPER(nome), LOWER(cor) \nFROM produtos;", solution: "SELECT UPPER(nome), LOWER(cor) FROM produtos;", validator: (res) => res && res[0] && res[0].values[0][0] === res[0].values[0][0].toUpperCase() },
            { id: 19, moduleId: 9, title: "20. SUBSTR / LENGTH", icon: '<i class="ph-fill ph-scissors"></i>', theory: "<b>SUBSTR(texto, inicio, qtd)</b> extrai fragmento. <b>LENGTH()</b> conta caracteres.", task: "Selecione os 5 primeiros caracteres de <code>nome</code> como 'sigla' e o comprimento como 'tamanho' dos produtos.", startCode: "SELECT SUBSTR(nome, 1, 5) as sigla, LENGTH(nome) as tamanho \nFROM produtos;", solution: "SELECT SUBSTR(nome, 1, 5) as sigla, LENGTH(nome) as tamanho FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('sigla') },
            { id: 20, moduleId: 9, title: "21. REPLACE / CONCAT", icon: '<i class="ph-fill ph-arrows-left-right"></i>', theory: "<b>REPLACE(campo,'de','para')</b> substitui texto. <b>||</b> concatena strings (CONCAT).", task: "Crie 'etiqueta' juntando <code>nome</code> + ' [' + <code>cor</code> + ']'. Substitua 'Preta' por 'Black' na cor.", startCode: "SELECT nome || ' [' || cor || ']' as etiqueta,\n  REPLACE(cor, 'Preta', 'Black') as cor_en\nFROM produtos;", solution: "SELECT nome || ' [' || cor || ']' as etiqueta, REPLACE(cor, 'Preta', 'Black') as cor_en FROM produtos;", validator: (res) => res && res[0] && res[0].columns.includes('etiqueta') },
            { id: 21, moduleId: 9, title: "22. Funções de Data", icon: '<i class="ph-fill ph-calendar"></i>', theory: "<b>STRFTIME('%Y', data)</b> extrai o ano. <b>julianday()</b> calcula diferença de dias (DATEDIFF).", task: "Nas vendas, mostre o <code>id</code>, o ano com <code>STRFTIME('%Y', data)</code> como 'ano' e os dias decorridos desde a venda como 'dias_atras'.", startCode: "SELECT id, \n  STRFTIME('%Y', data) as ano,\n  CAST(julianday('now') - julianday(data) AS INTEGER) as dias_atras\nFROM vendas;", solution: "SELECT id, STRFTIME('%Y', data) as ano, CAST(julianday('now') - julianday(data) AS INTEGER) as dias_atras FROM vendas;", validator: (res) => res && res[0] && res[0].columns.includes('ano') },
            { id: 22, moduleId: 10, title: "23. CREATE INDEX", icon: '<i class="ph-fill ph-activity"></i>', theory: "Índices para acelerar relatórios de vendas por data.", task: "Crie um índice chamado <code>idx_venda_data</code> na coluna <code>data</code>.", startCode: "CREATE INDEX ... ON ...(...);", solution: "CREATE INDEX idx_venda_data ON vendas(data);", validator: (res) => { try { const check = db.exec("PRAGMA index_list('vendas')"); return check[0].values.some(v => v[1] === 'idx_venda_data'); } catch(e) { return false; } } }
        ]
    }
};

// --- Initialization ---
async function init() {
    initEditor();
    initResizers();
    
    // UI Event Listeners
    document.getElementById('run-btn').addEventListener('click', executeUserQuery);
    document.getElementById('next-lesson-btn').addEventListener('click', advanceToNextLesson);
    
    document.getElementById('audio-toggle').addEventListener('click', function() {
        audioEnabled = !audioEnabled;
        const icon = document.getElementById('audio-icon');
        if (audioEnabled) {
            icon.className = 'ph-fill ph-speaker-high';
            this.classList.remove('muted');
        } else {
            icon.className = 'ph-fill ph-speaker-slash';
            this.classList.add('muted');
        }
    });

    const sidebar = document.getElementById('panel-left');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');
    
    document.getElementById('btn-sidebar-toggle').addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.className = 'ph-bold ph-list';
            this.title = "Expandir Menu";
        } else {
            toggleIcon.className = 'ph-bold ph-caret-left';
            this.title = "Recolher Menu";
        }
        if(editor) setTimeout(() => editor.refresh(), 300);
    });

    let allModulesCollapsed = false;
    document.getElementById('btn-toggle-modules').addEventListener('click', function() {
        allModulesCollapsed = !allModulesCollapsed;
        document.querySelectorAll('.module-group').forEach(group => {
            if (allModulesCollapsed) {
                group.classList.add('collapsed');
            } else {
                group.classList.remove('collapsed');
            }
        });
        this.innerHTML = allModulesCollapsed ? '<i class="ph-bold ph-arrows-out-line-vertical"></i>' : '<i class="ph-bold ph-arrows-in-line-vertical"></i>';
    });

    document.getElementById('author-link').addEventListener('click', function() {
        window.open("https://www.linkedin.com/in/gustavo-stockler/", "_blank");
    });

    document.getElementById('solution-toggle').addEventListener('click', function() {
        document.getElementById('solution-accordion').classList.toggle('open');
    });
    
    document.getElementById('copy-solution-btn').addEventListener('click', function() {
        const theme = themes[currentThemeId];
        const lesson = theme.lessons[currentLessonId];
        editor.setValue(lesson.solution);
        
        const btn = this;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check"></i> Copiado!';
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
        }, 2000);
    });

    // Certificate Logic
    document.getElementById('btn-certificate').addEventListener('click', function() {
        document.getElementById('certificate-modal').classList.add('active');
        document.querySelector('.app-container').classList.add('blurred');
    });

    document.getElementById('btn-close-cert').addEventListener('click', function() {
        document.getElementById('certificate-modal').classList.remove('active');
        document.querySelector('.app-container').classList.remove('blurred');
    });

    document.getElementById('btn-generate-final').addEventListener('click', function() {
        const name = document.getElementById('student-name-input').value;
        if (!name.trim()) {
            alert("Por favor, digite seu nome.");
            return;
        }
        document.getElementById('display-student-name').innerText = name.toUpperCase();
        document.getElementById('cert-date-display').innerText = new Date().toLocaleDateString('pt-BR');
        document.getElementById('cert-step-1').classList.add('hidden');
        document.getElementById('cert-step-2').classList.remove('hidden');
    });

    document.getElementById('btn-print-cert').addEventListener('click', function() {
        window.print();
    });

    // Theme Modal Logic
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', function() {
            const themeId = this.getAttribute('data-theme');
            selectTheme(themeId);
        });
    });

    document.getElementById('btn-change-theme').addEventListener('click', function() {
        showThemeModal();
    });

    document.getElementById('btn-close-modal').addEventListener('click', function() {
        document.getElementById('theme-modal').classList.remove('active');
        document.querySelector('.app-container').classList.remove('blurred');
    });

    // Segmented Toggle for Schema
    document.getElementById('view-tree-btn').addEventListener('click', function() {
        useTreeView = true;
        renderSchemaView();
    });

    document.getElementById('view-list-btn').addEventListener('click', function() {
        useTreeView = false;
        renderSchemaView();
    });

    try {
        SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        const savedTheme = localStorage.getItem('stockler_theme') || 'veiculos';
        selectTheme(savedTheme);
    } catch (err) {
        console.error("Failed to load SQL.js", err);
    }
}

function showThemeModal() {
    document.getElementById('theme-modal').classList.add('active');
    document.querySelector('.app-container').classList.add('blurred');
}

function selectTheme(themeId) {
    currentThemeId = themeId;
    currentLessonId = 0;
    completedLessons.clear();
    
    localStorage.setItem('stockler_theme', themeId);

    const theme = themes[themeId];
    
    // Update Header
    document.getElementById('app-title').innerText = theme.title;
    document.getElementById('header-logo-icon').innerHTML = theme.icon;

    // Update Schema Box
    renderSchemaView();

    // Hide Modal
    document.getElementById('theme-modal').classList.remove('active');
    document.querySelector('.app-container').classList.remove('blurred');

    initDBForTheme(theme);
}

let useTreeView = true;

function renderSchemaView() {
    const theme = themes[currentThemeId];
    const container = document.getElementById('schema-list');
    const titleText = document.getElementById('schema-title-text');
    
    const treeBtn = document.getElementById('view-tree-btn');
    const listBtn = document.getElementById('view-list-btn');

    if (useTreeView) {
        container.className = 'object-explorer';
        container.innerHTML = generateObjectExplorerHTML(theme);
        titleText.innerText = "Pesquisador de Objetos";
        treeBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        container.className = 'schema-box';
        container.innerHTML = `<ul>${theme.schema.join('')}</ul>`;
        titleText.innerText = "Tabelas Disponíveis";
        treeBtn.classList.remove('active');
        listBtn.classList.add('active');
    }
}

function generateObjectExplorerHTML(theme) {
    const dbName = theme.title.replace(/\s+/g, '') + 'DB';
    let html = `
    <div class="tree-item tree-item-no-arrow">
        <i class="ph-fill ph-database tree-icon" style="color:#555"></i> <span style="font-weight:600">${dbName}</span>
    </div>
    <div class="tree-children">
        <details class="tree-details" open>
            <summary class="tree-item">
                <i class="ph-fill ph-folder tree-icon"></i> <span>Tabelas</span>
            </summary>
            <div class="tree-children">
    `;

    theme.schema.forEach(item => {
        const tableMatch = item.match(/highlight">([^<]+)<\/span>/);
        if(!tableMatch) return;
        const tableName = tableMatch[1];
        
        const colsMatch = item.match(/<code>([^<]+)<\/code>/g);
        const columns = colsMatch ? colsMatch.map(c => c.replace(/<\/?code>/g, '')) : [];

        html += `
                <details class="tree-details" open>
                    <summary class="tree-item"><i class="ph-fill ph-table tree-icon" style="color:#0078d4"></i> <span>dbo.${tableName}</span></summary>
                    <div class="tree-children">`;
        
        columns.forEach(col => {
            let icon = '<i class="ph-bold ph-columns tree-icon-small"></i>';
            let suffix = '';
            if(col === 'id') {
                icon = '<i class="ph-fill ph-key tree-icon-pk"></i>';
                suffix = ' (PK)';
            } else if(col.includes('_id')) {
                icon = '<i class="ph-fill ph-key tree-icon-small" style="color:#888"></i>';
                suffix = ' (FK)';
            }
            
            html += `<div class="tree-item tree-item-no-arrow">${icon} <span>${col}${suffix}</span></div>`;
        });
        
        html += `
                    </div>
                </details>`;
    });

    html += `
            </div>
        </details>
    </div>`;
    
    return html;
}

function initDBForTheme(theme) {
    if (db) {
        db.close(); 
    }
    db = new SQL.Database();
    
    try {
        db.run(theme.setupQuery);
        renderLessonList();
        updateProgress();
        loadLesson(0);
    } catch (err) {
        console.error("Failed to initialize database for theme:", err);
        showFeedback("Erro ao carregar banco de dados.", "error");
    }
}

function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
        mode: 'text/x-sql',
        theme: 'dracula', 
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        viewportMargin: Infinity
    });
}

function initResizers() {
    const resizer1 = document.getElementById('resizer-1');
    const resizer2 = document.getElementById('resizer-2');
    const panelLeft = document.getElementById('panel-left');
    const panelRight = document.getElementById('panel-right');
    const appBody = document.querySelector('.app-body');

    let isResizing = false;
    let currentResizer = null;

    resizer1.addEventListener('mousedown', function(e) {
        if(panelLeft.classList.contains('collapsed')) return;
        isResizing = true;
        currentResizer = 1;
        this.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        e.preventDefault(); 
    });

    resizer2.addEventListener('mousedown', function(e) {
        isResizing = true;
        currentResizer = 2;
        this.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        if (currentResizer === 1) {
            let newWidth = e.clientX;
            if(newWidth > 150 && newWidth < 400) {
                panelLeft.style.width = newWidth + 'px';
            }
        } else if (currentResizer === 2) {
            let newWidth = appBody.getBoundingClientRect().right - e.clientX;
            if(newWidth > 200 && newWidth < (appBody.getBoundingClientRect().width - 200)) {
                panelRight.style.width = newWidth + 'px';
            }
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            resizer1.classList.remove('resizing');
            resizer2.classList.remove('resizing');
            if (editor) editor.refresh();
        }
    });
}

// SQL concept labels shown in the sidebar (position-based, same across all themes)
const sqlLessonTitles = [
    '1. SELECT *',
    '2. SELECT Colunas',
    '3. SELECT DISTINCT',
    '4. WHERE =',
    '5. WHERE AND',
    '6. ORDER BY ASC',
    '7. ORDER BY + LIMIT',
    '8. COUNT(*)',
    '9. SUM()',
    '10. GROUP BY',
    '11. INNER JOIN',
    '12. JOIN Múltiplo',
    '13. INSERT INTO',
    '14. UPDATE SET',
    '15. DELETE',
    '16. Subquery',
    '17. Window Function',
    '18. CASE WHEN',
    '19. Funções de Texto',
    '20. CREATE INDEX',
    '21. LEFT / RIGHT / LEN',
    '22. REPLACE / CONCAT',
    '23. Funções de Data'
];

function renderLessonList() {
    const list = document.getElementById('lesson-list');
    list.innerHTML = '';
    
    const themeLessons = themes[currentThemeId].lessons;

    modules.forEach(mod => {
        const modGroup = document.createElement('div');
        modGroup.className = 'module-group';
        
        const modHeader = document.createElement('div');
        modHeader.className = 'module-header';
        modHeader.innerHTML = `<span>${mod.title}</span> <i class="ph-bold ph-caret-down"></i>`;
        
        modHeader.addEventListener('click', () => {
            modGroup.classList.toggle('collapsed');
        });
        
        modGroup.appendChild(modHeader);
        
        const modLessons = themeLessons.filter(l => l.moduleId === mod.id);
        modLessons.forEach(lesson => {
            const index = themeLessons.indexOf(lesson);
            const li = document.createElement('div');
            li.className = `lesson-item ${index === currentLessonId ? 'active' : ''} ${completedLessons.has(index) ? 'completed' : ''}`;
            
            const statusIcon = completedLessons.has(index)
                ? '<i class="ph-fill ph-check-circle lesson-item-icon"></i>'
                : '<i class="ph ph-lock-key lesson-item-icon" style="opacity: 0.3;"></i>';

            // Use SQL concept title for sidebar; fallback to lesson.title
            const displayTitle = sqlLessonTitles[index] || lesson.title;
            
            li.innerHTML = `<span>${displayTitle}</span>${statusIcon}`;
            li.addEventListener('click', () => loadLesson(index));
            
            modGroup.appendChild(li);
        });
        
        list.appendChild(modGroup);
    });
}

function updateProgress() {
    const theme = themes[currentThemeId];
    const total = theme.lessons.length;
    const completed = completedLessons.size;
    const percentage = Math.round((completed / total) * 100);

    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').innerText = percentage + '%';

    if (completed === total) {
        document.getElementById('btn-certificate').classList.remove('hidden');
    }
}

function loadLesson(index) {
    currentLessonId = index;
    const theme = themes[currentThemeId];
    const lesson = theme.lessons[index];
    
    document.getElementById('lesson-icon').innerHTML = lesson.icon;
    document.getElementById('lesson-title').innerHTML = lesson.title;
    document.getElementById('lesson-theory').innerHTML = lesson.theory;
    document.getElementById('lesson-task').innerHTML = lesson.task;
    
    const mod = modules.find(m => m.id === lesson.moduleId);
    document.getElementById('module-badge').innerText = mod.title;
    
    document.getElementById('solution-code').textContent = lesson.solution;
    
    const statusInd = document.getElementById('lesson-status');
    if (completedLessons.has(index)) {
        statusInd.innerHTML = '<i class="ph-fill ph-check-circle"></i> Concluído';
        statusInd.className = 'status-indicator success';
    } else {
        statusInd.innerHTML = '<i class="ph-fill ph-clock"></i> Pendente';
        statusInd.className = 'status-indicator';
    }
    
    editor.setValue(lesson.startCode);
    
    // Reset UI
    document.getElementById('results-container').innerHTML = `
        <div class="empty-state">
            <i class="ph-fill ph-terminal-window"></i>
            <p>Clique em Executar para ver a saída.</p>
        </div>
    `;
    hideFeedback();
    document.getElementById('solution-accordion').classList.remove('open');
    document.getElementById('next-lesson-btn').classList.add('hidden');
    
    renderLessonList(); 
}

function advanceToNextLesson() {
    const themeLessons = themes[currentThemeId].lessons;
    if (currentLessonId < themeLessons.length - 1) {
        loadLesson(currentLessonId + 1);
    }
}

// --- Query Execution & Validation ---
function executeUserQuery() {
    hideFeedback();
    
    const query = editor.getValue();
    if (!query.trim()) return;
    
    try {
        const res = db.exec(query);
        renderResults(res);
        
        const theme = themes[currentThemeId];
        const lesson = theme.lessons[currentLessonId];
        
        if (lesson.validator(res)) {
            markCompleted();
        } else {
            // Pedagogical Feature: The query is valid SQL and ran successfully, 
            // but it's just not the correct answer for the exercise.
            playWarningSound();
            showFeedback("Query executada com sucesso! Mas o resultado não resolve o desafio.", "warning");
        }
    } catch (err) {
        // Syntax error or runtime execution error
        playErrorSound();
        renderError(err.message);
        showFeedback("Erro de Sintaxe no Banco de Dados", "error");
    }
}

function renderResults(res) {
    const container = document.getElementById('results-container');
    
    if (!res || res.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ph-fill ph-check-circle" style="color:var(--success)"></i>
                <p>Consulta executada com êxito.</p>
            </div>
        `;
        return;
    }
    
    const lastRes = res[res.length - 1];
    const columns = lastRes.columns;
    const values = lastRes.values;
    
    let tableHTML = '<table><thead><tr>';
    // Add row number column header (blank in SSMS)
    tableHTML += `<th style="width: 30px;"></th>`;
    columns.forEach(col => {
        tableHTML += `<th>${col}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    values.forEach((row, index) => {
        tableHTML += '<tr>';
        // Add row number
        tableHTML += `<td style="background-color: #f0f0f0; color: #333; text-align: center; border-right: 1px solid #d0d0d0;">${index + 1}</td>`;
        row.forEach(val => {
            tableHTML += `<td>${val !== null ? val : '<span style="color:#aaa; font-style:italic;">NULL</span>'}</td>`;
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

function renderError(errorMsg) {
    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div style="padding: 24px;">
            <div style="color: #ff6b6b; background-color: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2); padding: 16px; border-radius: 8px;">
                <h4 style="margin-bottom: 8px; font-weight: 600; display:flex; align-items:center; gap:8px;">
                    <i class="ph-fill ph-warning-circle"></i> Erro de Execução
                </h4>
                <code style="font-family: var(--font-mono); font-size: 13px; color: #ffb3b3;">${errorMsg}</code>
            </div>
        </div>
    `;
}

function markCompleted() {
    if(!completedLessons.has(currentLessonId)) {
        playWinnerSound();
    }
    
    completedLessons.add(currentLessonId);
    showFeedback("Sintaxe Correta!", "success");
    
    const statusInd = document.getElementById('lesson-status');
    statusInd.innerHTML = '<i class="ph-fill ph-check-circle"></i> Concluído';
    statusInd.className = 'status-indicator success';
    
    const themeLessons = themes[currentThemeId].lessons;
    if (currentLessonId < themeLessons.length - 1) {
        document.getElementById('next-lesson-btn').classList.remove('hidden');
    }
    
    updateProgress();
    renderLessonList();
}

function showFeedback(msg, type) {
    const fb = document.getElementById('feedback-message');
    if(type === 'success') {
        fb.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${msg}`;
        fb.className = 'feedback-badge success';
    } else if (type === 'warning') {
        fb.innerHTML = `<i class="ph-fill ph-warning"></i> ${msg}`;
        fb.className = 'feedback-badge warning';
    } else {
        fb.innerHTML = `<i class="ph-fill ph-warning-circle"></i> ${msg}`;
        fb.className = 'feedback-badge error';
    }
    fb.classList.remove('hidden');
}

function hideFeedback() {
    document.getElementById('feedback-message').classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', init);

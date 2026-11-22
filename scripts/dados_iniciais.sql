-- Floricultura Ugolini - dados iniciais 

-- ---------- Usuarios  ----------
-- Administrador:  admin@ugolini.com    senha: Admin@2026
-- Vendedor:       vendedor@ugolini.com senha: Vendedor@2026

insert into public.funcionarios (cpf, nome, telefone, email, data_contratacao, status, senha, e_admin) values
('11111111111', 'Administrador Ugolini', '49999990001', 'admin@ugolini.com', current_date, true, '$2b$12$zRXMYyVnGDiHtB8xeyH78Ohv8Y.uMcz5AeOnqTEm1xWhgVAp2geZW', true),
('22222222222', 'Vendedor Ugolini', '49999990002', 'vendedor@ugolini.com', current_date, true, '$2b$12$DFUf7co1QqV/1fREjOMq1OUmuUa/VEutvYih.VGimiQxBUzoYvSRa', false);


-- ---------- Cliente interno usado nos ajustes de estoque ----------

insert into public.cliente (nome, telefone, tipo_cliente) values
('Ugolini', '49999990000', null);


-- ---------- Categorias e subcategorias ----------

insert into public.categoria (nome) values ('Flores'), ('Buquês'), ('Embalagens');

insert into public.subcategoria (nome, id_categoria) values
('Rosas',              (select id_categoria from public.categoria where nome = 'Flores')),
('Lírios',             (select id_categoria from public.categoria where nome = 'Flores')),
('Girassóis',          (select id_categoria from public.categoria where nome = 'Flores')),
('Astromélias',        (select id_categoria from public.categoria where nome = 'Flores')),
('Tulipas',            (select id_categoria from public.categoria where nome = 'Flores')),
('Buquê Florescer',    (select id_categoria from public.categoria where nome = 'Buquês')),
('Buquê de Girassóis', (select id_categoria from public.categoria where nome = 'Buquês')),
('Buquê Rosas Vermelhas', (select id_categoria from public.categoria where nome = 'Buquês')),
('Papéis',             (select id_categoria from public.categoria where nome = 'Embalagens'));



-- ---------- Produtos  ----------

insert into public.produto (nome, id_subcategoria, descricao, preco, unidade_medida, estoque_minimo, quantidade_estoque) values
('Rosa vermelha',    (select id_subcategoria from public.subcategoria where nome = 'Rosas'),       'Rosa vermelha de corte, haste longa.',           12.00, 'un', 20, 60),
('Lírio branco',     (select id_subcategoria from public.subcategoria where nome = 'Lírios'),      'Lírio branco de corte.',                         18.50, 'un', 10, 25),
('Girassol',         (select id_subcategoria from public.subcategoria where nome = 'Girassóis'),   'Girassol de corte.',                              9.00, 'un', 10, 30),
('Astromélia',       (select id_subcategoria from public.subcategoria where nome = 'Astromélias'), 'Astromélia de corte.',                            7.50, 'un', 10, 40),
('Tulipa',           (select id_subcategoria from public.subcategoria where nome = 'Tulipas'),     'Tulipa de corte.',                               11.00, 'un', 10, 5),
('Papel kraft',      (select id_subcategoria from public.subcategoria where nome = 'Papéis'),      'Papel kraft para embalar buquês.',                4.50, 'un', 5, 30),
('Buquê Rosas Vermelhas', (select id_subcategoria from public.subcategoria where nome = 'Buquê Rosas Vermelhas'), 'Buquê com 12 rosas vermelhas e embalagem artesanal.', 149.90, 'un', 0, 0),
('Buquê de Girassóis',    (select id_subcategoria from public.subcategoria where nome = 'Buquê de Girassóis'),    'Buquê com 6 girassóis e embalagem artesanal.',          99.00, 'un', 0, 0);



-- ---------- Composicao dos buques ----------
insert into public.composicao (id_produto_composto, id_produto_componente, quantidade) values
((select id_produto from public.produto where nome = 'Buquê Rosas Vermelhas'), (select id_produto from public.produto where nome = 'Rosa vermelha'), 12),
((select id_produto from public.produto where nome = 'Buquê Rosas Vermelhas'), (select id_produto from public.produto where nome = 'Papel kraft'), 1),
((select id_produto from public.produto where nome = 'Buquê de Girassóis'),    (select id_produto from public.produto where nome = 'Girassol'), 6),
((select id_produto from public.produto where nome = 'Buquê de Girassóis'),    (select id_produto from public.produto where nome = 'Papel kraft'), 1);

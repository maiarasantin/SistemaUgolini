-- Floricultura Ugolini - script de criacao das tabelas (PostgreSQL)

create domain public.dm_descricao as character varying(200);

create table public.caixa (
  id_caixa serial not null,
  data_caixa date not null,
  valor_abertura numeric(10, 2) not null,
  valor_fechamento numeric(10, 2) null,
  hora_abertura time without time zone not null,
  hora_fechamento time without time zone null,
  constraint caixa_pkey primary key (id_caixa)
);

create table public.categoria (
  id_categoria serial not null,
  nome character varying(50) not null,
  constraint categoria_pkey primary key (id_categoria),
  constraint categoria_nome_unique unique (nome)
);

create table public.subcategoria (
  id_subcategoria serial not null,
  nome character varying(50) not null,
  id_categoria integer not null,
  constraint subcategoria_pkey primary key (id_subcategoria),
  constraint subcategoria_nome_unique unique (nome),
  constraint fk_subcategoria_categoria foreign key (id_categoria) references public.categoria (id_categoria)
);

create table public.produto (
  id_produto serial not null,
  nome character varying(100) not null,
  id_subcategoria integer not null,
  descricao public.dm_descricao null,
  preco numeric(10, 2) not null,
  foto text null,
  unidade_medida character varying(50) not null default 'un'::character varying,
  estoque_minimo integer not null default 0,
  quantidade_estoque integer not null default 0,
  constraint produto_pkey primary key (id_produto),
  constraint produto_nome_key unique (nome),
  constraint fk_produto_subcategoria foreign key (id_subcategoria) references public.subcategoria (id_subcategoria),
  constraint check_estoque_minimo check ((estoque_minimo >= 0)),
  constraint check_preco check ((preco >= (0)::numeric)),
  constraint check_quantidade_estoque check ((quantidade_estoque >= 0))
);

create table public.composicao (
  id_produto_composto integer not null,
  id_produto_componente integer not null,
  quantidade integer not null,
  constraint composicao_pkey primary key (id_produto_composto, id_produto_componente),
  constraint fk_composicao_produto_componente foreign key (id_produto_componente) references public.produto (id_produto),
  constraint fk_composicao_produto_composto foreign key (id_produto_composto) references public.produto (id_produto),
  constraint composicao_produtos_diferentes_check check ((id_produto_composto <> id_produto_componente)),
  constraint composicao_quantidade_check check ((quantidade > 0))
);

create table public.cliente (
  id_cliente serial not null,
  nome character varying(150) not null,
  telefone character varying(20) null,
  email character varying(150) null,
  tipo_cliente character varying(20) null,
  cpf character varying(11) null,
  cnpj character varying(14) null,
  rua character varying(150) null,
  numero character varying(10) null,
  bairro character varying(100) null,
  cep character varying(8) null,
  referencia text null,
  constraint cliente_pkey primary key (id_cliente),
  constraint cliente_cnpj_key unique (cnpj),
  constraint cliente_cpf_key unique (cpf)
);

create table public.funcionarios (
  id_funcionario serial not null,
  cpf character varying(11) not null,
  nome character varying(100) not null,
  telefone character varying(20) not null,
  email character varying(100) not null,
  data_contratacao date not null,
  status boolean not null default true,
  senha character varying(255) not null,
  e_admin boolean not null default false,
  constraint funcionarios_pkey primary key (id_funcionario),
  constraint funcionarios_cpf_key unique (cpf),
  constraint funcionarios_email_key unique (email)
);

create table public.pedido (
  num_pedido serial not null,
  data_hora_criacao timestamp without time zone not null default current_timestamp,
  origem character varying(30) not null,
  data_retirada date not null,
  hora_retirada time without time zone not null,
  preco_total numeric(10, 2) not null,
  tipo_pedido character varying(20) not null,
  status character varying(20) not null,
  tipo_entrega character varying(20) null,
  msg_cartao text null,
  observacao text null,
  foto text null,
  id_cliente integer not null,
  id_caixa integer null,
  constraint pedido_pkey primary key (num_pedido),
  constraint fk_pedido_caixa foreign key (id_caixa) references public.caixa (id_caixa),
  constraint fk_pedido_cliente foreign key (id_cliente) references public.cliente (id_cliente)
);

create table public.item_pedido (
  id_produto integer not null,
  num_pedido integer not null,
  quantidade integer not null,
  preco_unitario numeric(10, 2) not null,
  constraint item_pedido_pkey primary key (id_produto, num_pedido),
  constraint fk_item_pedido_pedido foreign key (num_pedido) references public.pedido (num_pedido),
  constraint fk_item_pedido_produto foreign key (id_produto) references public.produto (id_produto),
  constraint item_pedido_quantidade_check check ((quantidade > 0))
);

create table public.entrega (
  id_entrega serial not null,
  num_pedido integer not null,
  nome_recebedor character varying(150) not null,
  telefone_recebedor character varying(20) not null,
  rua character varying(150) not null,
  numero character varying(10) not null,
  bairro character varying(100) not null,
  cep character varying(8) not null,
  referencia text null,
  constraint entrega_pkey primary key (id_entrega),
  constraint entrega_num_pedido_key unique (num_pedido),
  constraint fk_entrega_pedido foreign key (num_pedido) references public.pedido (num_pedido)
);

create table public.pagamento (
  id_pagamento serial not null,
  num_pedido integer not null,
  status character varying(20) not null,
  forma_pagamento character varying(30) null,
  constraint pagamento_pkey primary key (id_pagamento),
  constraint pagamento_num_pedido_key unique (num_pedido),
  constraint fk_pagamento_pedido foreign key (num_pedido) references public.pedido (num_pedido)
);

create table public.input_estoque (
  id_estoque serial not null,
  data_entrada date not null,
  fornecedor character varying(100) not null,
  descricao public.dm_descricao null,
  constraint input_estoque_pkey primary key (id_estoque)
);

create table public.item_input_estoque (
  id_produto integer not null,
  id_estoque integer not null,
  quantidade_input_estoque integer not null,
  valor_unitario numeric(10, 2) not null,
  constraint item_input_estoque_pkey primary key (id_produto, id_estoque),
  constraint fk_item_estoque_entrada foreign key (id_estoque) references public.input_estoque (id_estoque),
  constraint fk_item_estoque_produto foreign key (id_produto) references public.produto (id_produto),
  constraint item_input_estoque_quantidade_check check ((quantidade_input_estoque > 0))
);

alter table public.caixa enable row level security;
alter table public.categoria enable row level security;
alter table public.cliente enable row level security;
alter table public.composicao enable row level security;
alter table public.entrega enable row level security;
alter table public.funcionarios enable row level security;
alter table public.input_estoque enable row level security;
alter table public.item_input_estoque enable row level security;
alter table public.item_pedido enable row level security;
alter table public.pagamento enable row level security;
alter table public.pedido enable row level security;
alter table public.produto enable row level security;
alter table public.subcategoria enable row level security;

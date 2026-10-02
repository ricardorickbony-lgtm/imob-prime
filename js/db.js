/**
 * db.js - Camada de Dados, Catálogo de Imóveis, CRM de Leads e Configurações
 * Imobiliária Prime - Padrão Severino & Ricardo (Impacto Digital)
 */

const STORAGE_IMOVEIS_KEY = 'imob_prime_estoque_v1';
const STORAGE_CONFIG_KEY = 'imob_prime_config_v1';
const STORAGE_LEADS_KEY = 'imob_prime_leads_v1';
const STORAGE_SENHA_KEY = 'imob_prime_senha_admin';

// Configurações Padrão de Identidade Visual da Imobiliária (White-Label)
const CONFIG_IMOB_PADRAO = {
  nome: 'Prime Imóveis & Conceito',
  slogan: 'Curadoria exclusiva de imóveis de alto padrão, lançamentos e oportunidades selecionadas',
  creci: 'CRECI 34.890-J',
  telefone: '(11) 4438-5000',
  whatsapp: '5511970558412', // Número oficial Ricardo / Impacto Digital
  email: 'contato@primeimoveis.com.br',
  endereco: 'Av. Portugal, 1420 - Centro Empresarial, Santo André - SP',
  cidade: 'Santo André - SP',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.887711202867!2d-46.5369!3d-23.644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM4JzM4LjQiUyA0NsKwMzInMTIuOCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr',
  horarioSemana: 'Segunda a Sexta: 08:30 às 19:00',
  horarioSabado: 'Sábados: 09:00 às 16:00',
  horarioDomingo: 'Domingos e Feriados: Plantão de Vendas WhatsApp',
  horaInicioSemana: 8.5,
  horaFimSemana: 19,
  horaInicioSabado: 9,
  horaFimSabado: 16,
  videoHero: 'https://www.youtube.com/watch?v=9JfFt3t7OfE',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  tiktok: 'https://tiktok.com',
  webhookLeads: ''
};

// Catálogo Realista de Imóveis de Alta Performance
const IMOVEIS_INICIAIS = [
  {
    id: 'imob-1',
    codigo: 'CB-9021',
    titulo: 'Cobertura Duplex com Vista Panorâmica e Piscina Privativa',
    tipo: 'cobertura',
    finalidade: 'venda',
    bairro: 'Jardins / Bairro Jardim',
    cidade: 'Santo André - SP',
    endereco: 'Rua das Figueiras, 1100',
    preco: 3850000,
    precoAluguel: 0,
    condominio: 2600,
    iptu: 850,
    areaUtil: 360,
    areaTotal: 440,
    quartos: 4,
    suites: 4,
    banheiros: 6,
    vagas: 5,
    status: 'disponivel',
    destaque: true,
    tags: ['Alto Padrão', 'Piscina Privativa', 'Varanda Gourmet', 'Vista Panorâmica', 'Pronto para Morar'],
    descricao: 'Exclusiva cobertura duplex finamente decorada com projeto assinado por arquiteto renomado. Living com pé direito duplo integrado à varanda gourmet com fechamento em vidro retrátil, piscina privativa aquecida com deck em cumaru, 4 amplas suítes com marcenaria sob medida e suíte master com closet duplo e hidromassagem. Condomínio com infraestrutura completa de resort club e segurança privada 24h.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Piscina Privativa Aquecida',
      'Varanda Gourmet com Churrasqueira',
      'Ar Condicionado Inverter em Todos os Ambientes',
      'Elevador Social Privativo com Biometria',
      'Automação Residencial de Iluminação e Som',
      '5 Vagas Determinadas + Depósito Privativo',
      'Gerador de Energia para Áreas Comuns e Elevador'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Eduardo Martins',
      creci: '184.920-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-2',
    codigo: 'AP-4102',
    titulo: 'Apartamento Contemporâneo com Varanda Gourmet Integrada',
    tipo: 'apartamento',
    finalidade: 'venda',
    bairro: 'Campestre',
    cidade: 'Santo André - SP',
    endereco: 'Alameda Campestre, 450',
    preco: 1190000,
    precoAluguel: 0,
    condominio: 980,
    iptu: 320,
    areaUtil: 118,
    areaTotal: 165,
    quartos: 3,
    suites: 2,
    banheiros: 3,
    vagas: 2,
    status: 'disponivel',
    destaque: true,
    tags: ['Lançamento Recente', 'Varanda Gourmet', 'Lazer Completo', 'Sol da Manhã'],
    descricao: 'Apartamento impecável com planta moderna e conceito aberto. Cozinha americana integrada ao living e à varanda gourmet envidraçada. Piso em porcelanato de grande formato, teto rebaixado com iluminação cênica em LED, suíte master com ar condicionado e armários planejados de altíssima qualidade. Localização privilegiada próxima aos melhores restaurantes, padarias artesanais e colégios da região.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Varanda Gourmet com Churrasqueira a Carvão',
      'Cozinha com Bancadas em Quartzo Branco',
      'Fechadura Digital Biométrica',
      'Academia Equipada Life Fitness',
      'Piscina Adulto com Raia de 25m e Infantil',
      'Quadra Poliesportiva e Salão de Festas Climatizado',
      'Pet Place e Brinquedoteca'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Mariana Silveira',
      creci: '201.440-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-3',
    codigo: 'CS-8830',
    titulo: 'Mansão Neoclássica em Condomínio Fechado com Spa e Área Gourmet',
    tipo: 'condominio',
    finalidade: 'venda',
    bairro: 'Vila Assunção / Parque Central',
    cidade: 'Santo André - SP',
    endereco: 'Alameda dos Ipês, 88',
    preco: 4950000,
    precoAluguel: 0,
    condominio: 1850,
    iptu: 920,
    areaUtil: 520,
    areaTotal: 680,
    quartos: 5,
    suites: 5,
    banheiros: 7,
    vagas: 6,
    status: 'disponivel',
    destaque: true,
    tags: ['Condomínio Fechado', 'Segurança Armada', 'Piscina com Prainha', 'Adega Climatizada'],
    descricao: 'Residência cinematográfica em condomínio de altíssimo padrão com segurança armada 24h. Arquitetura imponente com acabamentos em mármore travertino romano, esquadrias pretas do chão ao teto e ambientes amplos e fluidos. Área externa com paisagismo exuberante, piscina aquecida com prainha, spa com hidromassagem, espaço gourmet com forno de pizza e churrasqueira a gás, além de adega para 400 garrafas.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Segurança e Ronda Motorizada 24 Horas',
      'Energia Solar Fotovoltaica Instalada',
      'Piscina Aquecida com Borda Infinita e Prainha',
      'Adega Climatizada Subterrânea',
      'Home Cinema com Isolamento Acústico',
      'Garagem Coberta para 6 Veículos Grandes',
      'Poço Artesiano com Tratamento de Água Próprio'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Eduardo Martins',
      creci: '184.920-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-4',
    codigo: 'ST-2015',
    titulo: 'Studio Design Totalmente Mobiliado e Decorado para Moradia ou Renda',
    tipo: 'apartamento',
    finalidade: 'aluguel',
    bairro: 'Jardim Bella Vista',
    cidade: 'Santo André - SP',
    endereco: 'Rua das Monções, 320',
    preco: 0,
    precoAluguel: 3800,
    condominio: 590,
    iptu: 140,
    areaUtil: 44,
    areaTotal: 62,
    quartos: 1,
    suites: 1,
    banheiros: 1,
    vagas: 1,
    status: 'disponivel',
    destaque: false,
    tags: ['Totalmente Mobiliado', 'Pronto para Entrar', 'Coworking', 'Alta Rentabilidade'],
    descricao: 'Studio inteligente planejado para quem busca praticidade, sofisticação e conforto no melhor ponto da cidade. Totalmente mobiliado com cama queen com baú, Smart TV 55", ar condicionado dual inverter, geladeira inox, cooktop de indução, micro-ondas, máquina lava e seca e cortinas blackout. Edifício moderno com rooftop lounge, coworking com cabines acústicas e lavanderia OMO compartilhada.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      '100% Mobiliado e Decorado com Eletros',
      'Rooftop com Piscina e Vista 360 Graus',
      'Espaço Coworking com Internet Fibra Dedicada',
      'Mercado Grab & Go 24h no Condomínio',
      'Lavanderia Coletiva Inteligente OMO',
      'Fechadura Eletrônica com Senha e Cartão',
      'Serviço de Concierge e Limpeza Pay-Per-Use'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Mariana Silveira',
      creci: '201.440-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-5',
    codigo: 'LC-7700',
    titulo: 'Residencial Horizon Prime — Lançamento Exclusivo na Planta com Condições Especiais',
    tipo: 'lancamento',
    finalidade: 'lancamento',
    bairro: 'Vila Gilda / Parque Central',
    cidade: 'Santo André - SP',
    endereco: 'Av. Pereira Barreto, 1800',
    preco: 690000,
    precoAluguel: 0,
    condominio: 0,
    iptu: 0,
    areaUtil: 84,
    areaTotal: 120,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    status: 'disponivel',
    destaque: true,
    tags: ['Lançamento na Planta', 'Entrada Facilitada', 'Lazer Resort', 'Financiamento na Caixa'],
    descricao: 'O projeto mais aguardado do ano. Torre única em terreno de 4.500m² com lazer de clube privativo. Plantas inteligentes com 2 ou 3 dormitórios, varanda com churrasqueira a carvão e vista livre para o Parque Central. Fluxo de pagamento direto com a construtora durante a obra e financiamento garantido pela Caixa Econômica Federal. Ideal tanto para morar quanto para investimento de alta valorização.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Parque Aquático com Deck Molhado',
      'Quadra de Beach Tennis Oficial',
      'Espaço Pet Care com Banho e Tosa',
      'Ponto de Recarga para Carros Elétricos',
      'Espaço Delivery com Armários Refrigerados',
      'Previsão para Ar Condicionado em Todos os Quartos',
      'Condições de Entrada Parcelada em até 36x'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Eduardo Martins',
      creci: '184.920-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-6',
    codigo: 'SB-3310',
    titulo: 'Sobrado Triplex de Esquina com Espaço Gourmet e 3 Vagas Paralelas',
    tipo: 'casa',
    finalidade: 'venda',
    bairro: 'Vila Valparaíso',
    cidade: 'Santo André - SP',
    endereco: 'Rua das Palmeiras, 215',
    preco: 1450000,
    precoAluguel: 0,
    condominio: 0,
    iptu: 450,
    areaUtil: 245,
    areaTotal: 290,
    quartos: 3,
    suites: 3,
    banheiros: 5,
    vagas: 3,
    status: 'disponivel',
    destaque: false,
    tags: ['Sem Condomínio', '3 Suítes Plenas', 'Rooftop Privativo', 'Garagem Paralela'],
    descricao: 'Sobrado de esquina novo, construído com materiais de primeira linha e excelente ventilação natural. Sala com pé direito elevado para 2 ambientes com lavabo, 3 amplas suítes com persianas automatizadas, sendo a master com sacada privativa e espaço para closet. Terceiro pavimento com rooftop coberto para espaço gourmet com churrasqueira e vista desobstruída do pôr do sol.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Sem Taxa de Condomínio',
      '3 Vagas de Garagem Paralelas e Cobertas',
      'Persianas Elétricas Blackout nos Dormitórios',
      'Aquecimento Solar com Boiler Pressurizado',
      'Cerca Elétrica e Sistema de Câmeras Instalado',
      'Acabamento em Porcelanato 90x90 e Granito São Gabriel'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Mariana Silveira',
      creci: '201.440-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-7',
    codigo: 'CM-1190',
    titulo: 'Laje Corporativa Prime em Edifício Triple A com Estacionamento Rotativo',
    tipo: 'comercial',
    finalidade: 'aluguel',
    bairro: 'Jardim / Centro Comercial',
    cidade: 'Santo André - SP',
    endereco: 'Rua General Glicério, 800',
    preco: 0,
    precoAluguel: 14500,
    condominio: 2900,
    iptu: 950,
    areaUtil: 210,
    areaTotal: 275,
    quartos: 0,
    suites: 0,
    banheiros: 4,
    vagas: 6,
    status: 'disponivel',
    destaque: false,
    tags: ['Edifício Triple A', 'Piso Elevado', 'Fibra Óptica Dedicada', 'Estacionamento Valet'],
    descricao: 'Laje comercial de alto padrão ideal para sedes corporativas, escritórios de advocacia, consultorias ou clínicas médicas premium. Vão livre com piso elevado instalado, forro modular com luminárias de LED, ar condicionado central VRF já em operação, copa privativa, 4 banheiros executivos e 6 vagas determinadas de garagem para sócios e diretoria.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Edifício Triple A com Portaria e Catracas com Reconhecimento Facial',
      'Auditório e Salas de Reunião Compartilhadas no Térreo',
      'Heliponto Homologado com Operação Diurna e Noturna',
      'Gerador Total para 100% da Carga do Prédio',
      'Bicicletário com Vestiários Completos'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Eduardo Martins',
      creci: '184.920-F',
      telefone: '(11) 97055-8412'
    }
  },
  {
    id: 'imob-8',
    codigo: 'AP-5520',
    titulo: 'Apartamento de Luxo com Living Integrado e Vista Infinita para o Parque',
    tipo: 'apartamento',
    finalidade: 'venda',
    bairro: 'Vila Bastos',
    cidade: 'Santo André - SP',
    endereco: 'Rua Gonçalo Fernandes, 180',
    preco: 2150000,
    precoAluguel: 0,
    condominio: 1650,
    iptu: 580,
    areaUtil: 178,
    areaTotal: 230,
    quartos: 3,
    suites: 3,
    banheiros: 5,
    vagas: 3,
    status: 'disponivel',
    destaque: true,
    tags: ['Vista para o Parque', '3 Suítes', 'Varanda Envidraçada', 'Depósito Privativo'],
    descricao: 'Apartamento de alto padrão com andar alto e vista livre deslumbrante e permanente para a copa das árvores. Living ampliado para 3 ambientes com climatização central e piso em madeira nobre cumaru. Varanda gourmet espaçosa com churrasqueira integrada ao espaço de jantar. Planta fluida e privativa com 3 suítes, escritório e dependência completa de serviço.',
    fotoPrincipal: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    diferenciais: [
      'Andar Alto com Vista Livre Permanente',
      'Suíte Master com Closet Walk-in e Banheira',
      'Área de Lazer Completa com Quadra de Tênis de Saibro',
      'Espaço Zen com Sauna Seca e Úmida',
      'Guarita Blindada Nível III-A',
      'Depósito Fechado no Subsolo'
    ],
    videoTour: '',
    corretorResponsavel: {
      nome: 'Mariana Silveira',
      creci: '201.440-F',
      telefone: '(11) 97055-8412'
    }
  }
];

// Leads Iniciais para o SaaS (Demonstração Pronta para Prospectar Clientes)
const LEADS_INICIAIS = [
  {
    id: 'lead-1',
    nome: 'Dr. Rodrigo Albuquerque',
    whatsapp: '5511988223344',
    email: 'rodrigo.albuquerque@clinica.com.br',
    imovelCodigo: 'CB-9021',
    imovelTitulo: 'Cobertura Duplex com Vista Panorâmica e Piscina Privativa',
    tipoInteresse: 'Visita Presencial',
    mensagem: 'Olá, tenho muito interesse em visitar a cobertura duplex no Bairro Jardim neste sábado pela manhã.',
    status: 'Visita Agendada',
    data: '02/10/2026 10:15',
    valorProposta: 'R$ 3.700.000 (À Vista)'
  },
  {
    id: 'lead-2',
    nome: 'Dra. Camila Vasconcelos',
    whatsapp: '5511977665544',
    email: 'camila.vasconcelos@adv.br',
    imovelCodigo: 'AP-4102',
    imovelTitulo: 'Apartamento Contemporâneo com Varanda Gourmet Integrada',
    tipoInteresse: 'Simulação de Financiamento',
    mensagem: 'Gostei muito do apartamento no Campestre. Quero saber o valor da entrada mínima com financiamento Itaú.',
    status: 'Em Atendimento',
    data: '02/10/2026 11:40',
    valorProposta: 'Entrada R$ 300.000 + Financiamento'
  },
  {
    id: 'lead-3',
    nome: 'Eng. Fernando Prado',
    whatsapp: '5511999112233',
    email: 'fernando.prado@construtora.eng.br',
    imovelCodigo: 'LC-7700',
    imovelTitulo: 'Residencial Horizon Prime — Lançamento Exclusivo',
    tipoInteresse: 'Book Digital / Lançamento',
    mensagem: 'Gostaria de receber o material completo e a tabela de investidor do Horizon Prime.',
    status: 'Novo',
    data: '02/10/2026 12:20',
    valorProposta: 'Investimento na Planta'
  }
];

// Camada de Funções de Acesso aos Dados
const DB = {
  // Retorna os imóveis salvos ou carrega a base padrão
  getImoveis() {
    try {
      const data = localStorage.getItem(STORAGE_IMOVEIS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar do localStorage:', e);
    }
    this.salvarImoveis(IMOVEIS_INICIAIS);
    return IMOVEIS_INICIAIS;
  },

  salvarImoveis(imoveis) {
    try {
      localStorage.setItem(STORAGE_IMOVEIS_KEY, JSON.stringify(imoveis));
      window.dispatchEvent(new CustomEvent('imob_dados_atualizados', { detail: imoveis }));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  },

  getImovelPorId(id) {
    return this.getImoveis().find(im => im.id === id) || null;
  },

  getImovelPorCodigo(codigo) {
    return this.getImoveis().find(im => im.codigo.toLowerCase() === (codigo || '').toLowerCase()) || null;
  },

  adicionarImovel(imovel) {
    const imoveis = this.getImoveis();
    if (!imovel.id) imovel.id = 'imob-' + Date.now();
    imoveis.unshift(imovel);
    this.salvarImoveis(imoveis);
    return imovel;
  },

  atualizarImovel(id, dadosAtualizados) {
    let imoveis = this.getImoveis();
    const index = imoveis.findIndex(im => im.id === id);
    if (index !== -1) {
      imoveis[index] = { ...imoveis[index], ...dadosAtualizados };
      this.salvarImoveis(imoveis);
      return imoveis[index];
    }
    return null;
  },

  removerImovel(id) {
    let imoveis = this.getImoveis();
    imoveis = imoveis.filter(im => im.id !== id);
    this.salvarImoveis(imoveis);
    return true;
  },

  // Configurações da Imobiliária (White-Label)
  getConfig() {
    try {
      const data = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...CONFIG_IMOB_PADRAO, ...parsed };
      }
    } catch (e) {}
    return { ...CONFIG_IMOB_PADRAO };
  },

  salvarConfig(config) {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('imob_config_atualizada', { detail: config }));
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  },

  // CRM de Leads
  getLeads() {
    try {
      const data = localStorage.getItem(STORAGE_LEADS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    this.salvarLeads(LEADS_INICIAIS);
    return LEADS_INICIAIS;
  },

  salvarLeads(leads) {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('imob_leads_atualizados', { detail: leads }));
    } catch (e) {}
  },

  adicionarLead(lead) {
    const leads = this.getLeads();
    if (!lead.id) lead.id = 'lead-' + Date.now();
    if (!lead.data) {
      const d = new Date();
      lead.data = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    if (!lead.status) lead.status = 'Novo';
    leads.unshift(lead);
    this.salvarLeads(leads);

    // Dispara webhook se configurado (n8n / CRM / Zapier)
    const config = this.getConfig();
    if (config.webhookLeads && config.webhookLeads.startsWith('http')) {
      fetch(config.webhookLeads, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }).catch(err => console.warn('Erro ao disparar webhook de lead:', err));
    }

    return lead;
  },

  atualizarStatusLead(id, novoStatus) {
    const leads = this.getLeads();
    const l = leads.find(item => item.id === id);
    if (l) {
      l.status = novoStatus;
      this.salvarLeads(leads);
      return l;
    }
    return null;
  },

  removerLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(item => item.id !== id);
    this.salvarLeads(leads);
    return true;
  },

  // Autenticação simples do SaaS
  validarSenhaAdmin(senha) {
    const senhaSalva = localStorage.getItem(STORAGE_SENHA_KEY) || 'admin123';
    return senha === senhaSalva;
  },

  alterarSenhaAdmin(novaSenha) {
    localStorage.setItem(STORAGE_SENHA_KEY, novaSenha);
    return true;
  },

  // Reset para demonstrações com novos clientes
  restaurarPadroes() {
    this.salvarImoveis(IMOVEIS_INICIAIS);
    this.salvarConfig(CONFIG_IMOB_PADRAO);
    this.salvarLeads(LEADS_INICIAIS);
  }
};

window.DB = DB;

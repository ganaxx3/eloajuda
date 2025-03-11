// Arquivo para gerenciar as chamadas de API

// Tipos para os dados de ELO
export interface EloRequest {
  currentElo: string;
  currentTier: string;
  desiredElo: string;
}

// Simulação de uma resposta da API
export interface EloResponse {
  success: boolean;
  message: string;
  price?: number;
  discount?: number;
  finalPrice?: number;
}

// Interface para os preços de elo
export interface EloPrice {
  elo: string;
  tier?: string;
  price: number;
}

// Função para enviar a solicitação de ELO
export const sendEloRequest = async (_data: EloRequest): Promise<EloResponse> => {
  // Simulando uma chamada de API com um atraso
  return new Promise((resolve) => {
    // Simulando um tempo de resposta do servidor
    setTimeout(() => {
      // Aqui você substituiria por uma chamada real à API
      // Por exemplo: const response = await fetch('/api/elo-request', { method: 'POST', body: JSON.stringify(data) });
      
      // Simulando uma resposta bem-sucedida
      resolve({
        success: true,
        message: 'Solicitação recebida com sucesso! Nossa equipe entrará em contato em breve.',
        price: 1561.76,
        discount: 0.1, // 10% de desconto
        finalPrice: 1034
      });
    }, 1034);
  });
};

// Array com os preços de cada elo e tier
export const eloPrices: EloPrice[] = [
    {"elo": "Ferro", "tier": "4", "price": 0},
    {"elo": "Ferro", "tier": "3", "price": 10},
    {"elo": "Ferro", "tier": "2", "price": 20},
    {"elo": "Ferro", "tier": "1", "price": 30},
    {"elo": "Bronze", "tier": "4", "price": 40},
    {"elo": "Bronze", "tier": "3", "price": 51},
    {"elo": "Bronze", "tier": "2", "price": 62},
    {"elo": "Bronze", "tier": "1", "price": 73},
    {"elo": "Prata", "tier": "4", "price": 85},
    {"elo": "Prata", "tier": "3", "price": 103},
    {"elo": "Prata", "tier": "2", "price": 122},
    {"elo": "Prata", "tier": "1", "price": 140},
    {"elo": "Ouro", "tier": "4", "price": 158},
    {"elo": "Ouro", "tier": "3", "price": 181},
    {"elo": "Ouro", "tier": "2", "price": 204},
    {"elo": "Ouro", "tier": "1", "price": 227},
    {"elo": "Platina", "tier": "4", "price": 250},
    {"elo": "Platina", "tier": "3", "price": 283},
    {"elo": "Platina", "tier": "2", "price": 317},
    {"elo": "Platina", "tier": "1", "price": 350},
    {"elo": "Esmeralda", "tier": "4", "price": 389},
    {"elo": "Esmeralda", "tier": "3", "price": 445},
    {"elo": "Esmeralda", "tier": "2", "price": 500},
    {"elo": "Esmeralda", "tier": "1", "price": 555},
    {"elo": "Diamante", "tier": "4", "price": 632},
    {"elo": "Diamante", "tier": "3", "price": 707},
    {"elo": "Diamante", "tier": "2", "price": 789},
    {"elo": "Diamante", "tier": "1", "price": 881},
    {"elo": "Mestre", "price": 1070}
];

// Função para calcular o preço baseado na seleção de ELO
export const calculatePrice = (currentElo: string, currentTier: string, desiredElo: string, desiredTier: string = 'IV'): { originalPrice: number, discountedPrice: number } => {
  // Mapeamento de elos para o formato do array
  const eloMapping: Record<string, string> = {
    'FERRO': 'Ferro',
    'BRONZE': 'Bronze',
    'PRATA': 'Prata',
    'OURO': 'Ouro',
    'PLATINA': 'Platina',
    'ESMERALDA': 'Esmeralda',
    'DIAMANTE': 'Diamante',
    'MESTRE': 'Mestre'
  };

  // Mapeamento de tiers para o formato do array
  const tierMapping: Record<string, string> = {
    'IV': '4',
    'III': '3',
    'II': '2',
    'I': '1'
  };

  // Encontrar o índice do elo atual no array
  const currentEloMapped = eloMapping[currentElo];
  const currentTierMapped = tierMapping[currentTier];
  
  // Encontrar o índice do elo desejado no array
  const desiredEloMapped = eloMapping[desiredElo];
  const desiredTierMapped = tierMapping[desiredTier];

  // Encontrar os preços correspondentes
  let currentEloPrice = 0;
  let desiredEloPrice = 0;

  // Encontrar o preço do elo atual
  const currentEloEntry = eloPrices.find(entry => 
    entry.elo === currentEloMapped && 
    (entry.tier === currentTierMapped || (!entry.tier && (currentElo === 'MESTRE' || currentElo === 'GRAO-MESTRE' || currentElo === 'CHALLENGER')))
  );

  if (currentEloEntry) {
    currentEloPrice = currentEloEntry.price;
  }

  // Encontrar o preço do elo desejado
  const desiredEloEntry = eloPrices.find(entry => 
    entry.elo === desiredEloMapped && 
    (entry.tier === desiredTierMapped || (!entry.tier && (desiredElo === 'MESTRE' || desiredElo === 'GRAO-MESTRE' || desiredElo === 'CHALLENGER')))
  );

  if (desiredEloEntry) {
    desiredEloPrice = desiredEloEntry.price;
  }

  // Calcular a diferença de preço
  const totalPrice = Math.max(0, desiredEloPrice - currentEloPrice);
  
  // Aplicar desconto de 10%
  const discountedPrice = totalPrice * 0.9;

  return {
    originalPrice: totalPrice,
    discountedPrice: parseFloat(discountedPrice.toFixed(2))
  };

};
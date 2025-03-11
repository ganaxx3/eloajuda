// Mapeamento de elos para URLs de imagens de ícones
export const eloIcons = {
  'IRON': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/iron.png',
  'BRONZE': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/bronze.png',
  'SILVER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/silver.png',
  'GOLD': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/gold.png',
  'PLATINUM': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/platinum.png',
  'DIAMOND': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/diamond.png',
  'MASTER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/master.png',
  'GRANDMASTER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/grandmaster.png',
  'CHALLENGER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-mini-regalia/challenger.png',
};

// Função para formatar o elo completo (elo + tier)
export const formatElo = (elo: string, tier?: string): string => {
  if (!tier) return elo;
  return `${elo} ${tier}`;
};

// Função para obter a URL do ícone do elo
export const getEloIcon = (elo: string): string => {
  const upperElo = elo.toUpperCase();
  return eloIcons[upperElo as keyof typeof eloIcons] || '';
};

// Função para abrir o perfil do jogador no DeepLOL
export const openDeepLOLProfile = (summonerName: string, tagLine: string): void => {
  // Remove o # do tagLine
  const formattedTagLine = tagLine.replace('#', '');
  
  // Abre uma nova janela com o perfil do jogador
  window.open(`https://www.deeplol.gg/summoner/br/${summonerName}-${formattedTagLine}`, '_blank');
};

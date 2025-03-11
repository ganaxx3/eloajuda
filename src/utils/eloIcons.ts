// Importando as imagens locais
import ferroImg from '../assets/images/Ferro.webp';
import prataImg from '../assets/images/Prata.png';
import bronzeImg from '../assets/images/Bronze.webp';
import ouroImg from '../assets/images/Ouro.webp';
import platinImg from '../assets/images/Platina.webp';
import esmeraldImg from '../assets/images/Esmeralda.webp';
import diamanteImg from '../assets/images/Diamante.webp';
import mestreImg from '../assets/images/Mestre.webp';

// Mapeamento de elos para URLs de imagens de ícones (usando imagens locais)
export const eloIcons = {
  // Nomes em português
  'FERRO': ferroImg,
  'BRONZE': bronzeImg, 
  'PRATA': prataImg,
  'OURO': ouroImg,
  'PLATINA': platinImg,
  'ESMERALDA': esmeraldImg,
  'DIAMANTE': diamanteImg,
  'MESTRE': mestreImg,
  
  // Nomes em inglês (para compatibilidade)
  'IRON': ferroImg,
  'SILVER': prataImg,
  'GOLD': ouroImg,
  'PLATINUM': platinImg,
  'EMERALD': esmeraldImg,
  'DIAMOND': diamanteImg,
  'MASTER': mestreImg
};

// Função para formatar o elo completo (elo + tier)
export const formatElo = (elo: string, tier?: string): string => {
  if (!tier) return elo;
  return `${elo} ${tier}`;
};

// Função para obter o ícone do elo
export const getEloIcon = (elo: string): string => {
  if (!elo) return ferroImg; // Proteção contra valores undefined ou null
  
  const upperElo = elo.toUpperCase();
  return eloIcons[upperElo as keyof typeof eloIcons] || ferroImg; // Imagem padrão caso o elo não seja encontrado
};

// Função para abrir o perfil do jogador no DeepLOL
export const openDeepLOLProfile = (summonerName: string, tagLine: string): void => {
  // Remove o # do tagLine
  const formattedTagLine = tagLine.replace('#', '');
  
  // Abre uma nova janela com o perfil do jogador
  window.open(`https://www.deeplol.gg/summoner/br/${summonerName}-${formattedTagLine}`, '_blank');
};

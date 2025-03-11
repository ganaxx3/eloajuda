import { useState, useEffect } from 'react'
import styled from 'styled-components'
import shacoBackground from '../assets/images/purple_background.png'
// Importando todas as imagens dos elos
import ferroElo from '../assets/images/Ferro.webp'
import bronzeElo from '../assets/images/Bronze.webp'
import prataElo from '../assets/images/Prata.png'
import ouroElo from '../assets/images/Ouro.webp'
import platinaElo from '../assets/images/Platina.webp'
import esmeraldaElo from '../assets/images/Esmeralda.webp'
import diamanteElo from '../assets/images/Diamante.webp'
import mestreElo from '../assets/images/Mestre.webp'
import graoMestreElo from '../assets/images/Graomestre.png'
import challengerElo from '../assets/images/Desafiante.webp'
import { sendEloRequest, calculatePrice } from '../services/api'

const Home = () => {
  const [currentElo, setCurrentElo] = useState('PRATA')
  const [currentTier, setCurrentTier] = useState('IV')
  const [desiredElo, setDesiredElo] = useState('ESMERALDA')
  const [desiredTier, setDesiredTier] = useState('IV')
  const [price, setPrice] = useState(1561.76)
  const [finalPrice, setFinalPrice] = useState(1276.50)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Mapeamento de elos para imagens
  const eloImages = {
    'FERRO': ferroElo,
    'BRONZE': bronzeElo,
    'PRATA': prataElo,
    'OURO': ouroElo,
    'PLATINA': platinaElo,
    'ESMERALDA': esmeraldaElo,
    'DIAMANTE': diamanteElo,
    'MESTRE': mestreElo,
    'GRAO-MESTRE': graoMestreElo,
    'CHALLENGER': challengerElo
  }
  
  // Mapeamento de elos para cores
  const eloColors = {
    'FERRO': '#5D5D5D', // Cinza escuro
    'BRONZE': '#CD7F32', // Bronze
    'PRATA': '#C0C0C0', // Prata
    'OURO': '#FFD700', // Ouro
    'PLATINA': '#00FFFF', // Ciano
    'ESMERALDA': '#32CD32', // LimeGreen
    'DIAMANTE': '#B9F2FF', // Azul claro
    'MESTRE': '#9370DB', // Roxo
    'GRAO-MESTRE': '#FF0000', // Vermelho
    'CHALLENGER': '#00BFFF'  // Deep Sky Blue
  }
  
  // Função para escurecer uma cor hexadecimal
  const darkenColor = (hex: string, factor: number): string => {
    // Remove o # se existir
    hex = hex.replace('#', '');
    
    // Converte para RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Escurece cada componente
    r = Math.max(0, Math.floor(r * (1 - factor)));
    g = Math.max(0, Math.floor(g * (1 - factor)));
    b = Math.max(0, Math.floor(b * (1 - factor)));
    
    // Converte de volta para hexadecimal
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Validação para não permitir selecionar elo desejado menor que o atual
  useEffect(() => {
    const eloValues = {
      'FERRO': 0,
      'BRONZE': 1,
      'PRATA': 2,
      'OURO': 3,
      'PLATINA': 4,
      'ESMERALDA': 5,
      'DIAMANTE': 6,
      'MESTRE': 7,
      'GRAO-MESTRE': 8,
      'CHALLENGER': 9
    };
    
    const tierValues = {
      'IV': 0,
      'III': 1,
      'II': 2,
      'I': 3
    };
    
    const currentEloValue = eloValues[currentElo as keyof typeof eloValues];
    const desiredEloValue = eloValues[desiredElo as keyof typeof eloValues];
    
    // Se o elo desejado for menor que o atual, ajusta para o atual
    if (desiredEloValue < currentEloValue) {
      setDesiredElo(currentElo);
      setDesiredTier(currentTier);
    } 
    // Se os elos forem iguais, verifica o tier
    else if (desiredEloValue === currentEloValue && 
             currentElo !== 'MESTRE' && currentElo !== 'GRAO-MESTRE' && currentElo !== 'CHALLENGER') {
      const currentTierValue = tierValues[currentTier as keyof typeof tierValues];
      const desiredTierValue = tierValues[desiredTier as keyof typeof tierValues];
      
      if (desiredTierValue < currentTierValue) {
        setDesiredTier(currentTier);
      }
    }
  }, [currentElo, currentTier, desiredElo, desiredTier]);
  
  // Atualiza o preço quando as seleções mudam
  useEffect(() => {
    const { originalPrice, discountedPrice } = calculatePrice(currentElo, currentTier, desiredElo, desiredTier);
    setPrice(originalPrice);
    setFinalPrice(discountedPrice);
  }, [currentElo, currentTier, desiredElo, desiredTier]);
  
  // Função para lidar com o clique no botão de confirmação
  const handleConfirmClick = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await sendEloRequest({
        currentElo,
        currentTier,
        desiredElo
      });
      
      setMessage(response.message);
      
      // Redirect to Discord after successful request
      window.location.href = 'https://discord.gg/S67EXpFFm5';
      
    } catch (error) {
      setMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
      console.error('Erro ao enviar solicitação:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AppContainer>
      <Header>
        <Logo>ELO <YellowText>AJUDA</YellowText></Logo>
        <Nav>
          <NavItem onClick={() => window.location.href = '/'}>INÍCIO</NavItem>
          <NavItem as="a" href="https://discord.gg/S67EXpFFm5" target="_blank" rel="noopener noreferrer">DISCORD</NavItem>
        </Nav>
      </Header>

      <MainContent>
        <HeroText>
          <Title>CANSADO DE SOFRER NO SEU ELO?</Title>
          <Subtitle>NÓS TE AJUDAMOS COM ISSO!</Subtitle>
        </HeroText>

        <Instructions>
          Coloque abaixo seu <strong>ELO ATUAL</strong> e o <strong>ELO QUE VOCÊ DESEJA</strong> alcançar, depois clique em <strong>CONFIRMAR</strong>
          <br />
          Você será direcionado para nosso atendimento.
        </Instructions>

        <SelectionArea>
          <SelectionBox style={{ background: `linear-gradient(to bottom, ${eloColors[currentElo as keyof typeof eloColors]}, ${darkenColor(eloColors[currentElo as keyof typeof eloColors], 0.5)})` }}>
            <EloImage src={eloImages[currentElo as keyof typeof eloImages]} alt={`${currentElo} Elo`} />
            <SelectionTitle>SELECIONE O SEU ELO ATUAL</SelectionTitle>
            <SelectDropdown value={currentElo} onChange={(e) => setCurrentElo(e.target.value)}>
              <option value="DIAMANTE">DIAMANTE</option>
              <option value="ESMERALDA">ESMERALDA</option>
              <option value="PLATINA">PLATINA</option>
              <option value="OURO">OURO</option>
              <option value="PRATA">PRATA</option>
              <option value="BRONZE">BRONZE</option>
              <option value="FERRO">FERRO</option>
            </SelectDropdown>
            {currentElo !== 'MESTRE' && currentElo !== 'GRAO-MESTRE' && currentElo !== 'CHALLENGER' && (
              <>
                <SelectionTitle>SELECIONE SUA DIVISÃO DESEJADA</SelectionTitle>
                <SelectDropdown value={currentTier} onChange={(e) => setCurrentTier(e.target.value)}>
                  <option value="IV">IV</option>
                  <option value="III">III</option>
                  <option value="II">II</option>
                  <option value="I">I</option>
                </SelectDropdown>
              </>
            )}
          </SelectionBox>

          <SelectionBox style={{ background: `linear-gradient(to bottom, ${eloColors[desiredElo as keyof typeof eloColors]}, ${darkenColor(eloColors[desiredElo as keyof typeof eloColors], 0.5)})`, border: '1px solid #808080' }}>
            <EloImage src={eloImages[desiredElo as keyof typeof eloImages]} alt={`${desiredElo} Elo`} />
            <SelectionTitle>SELECIONE O ELO DESEJADO</SelectionTitle>
            <SelectDropdown value={desiredElo} onChange={(e) => setDesiredElo(e.target.value)}>
              <option value="MESTRE">MESTRE</option>
              <option value="DIAMANTE">DIAMANTE</option>
              <option value="ESMERALDA">ESMERALDA</option>
              <option value="PLATINA">PLATINA</option>
              <option value="OURO">OURO</option>
              <option value="PRATA">PRATA</option>
              <option value="BRONZE">BRONZE</option>
              <option value="FERRO">FERRO</option>
            </SelectDropdown>
            {desiredElo !== 'MESTRE' && desiredElo !== 'GRAO-MESTRE' && desiredElo !== 'CHALLENGER' && (
              <>
                <SelectionTitle>SELECIONE SUA DIVISÃO DESEJADA</SelectionTitle>
                <SelectDropdown value={desiredTier} onChange={(e) => setDesiredTier(e.target.value)}>
                  <option value="IV">IV</option>
                  <option value="III">III</option>
                  <option value="II">II</option>
                  <option value="I">I</option>
                </SelectDropdown>
              </>
            )}
          </SelectionBox>

          <PriceBox>
            <PriceTitle>
              {currentElo} {currentElo === 'MESTRE' || currentElo === 'GRAO-MESTRE' || currentElo === 'CHALLENGER' ? '' : currentTier}
              <br />
              até
              <br />
              {desiredElo
                .replace('GRAO-MESTRE', 'Grão-Mestre')
                .replace('FERRO', 'Ferro')
                .replace('BRONZE', 'Bronze')
                .replace('PRATA', 'Prata')
                .replace('OURO', 'Ouro')
                .replace('PLATINA', 'Platina')
                .replace('ESMERALDA', 'Esmeralda')
                .replace('DIAMANTE', 'Diamante')
                .replace('MESTRE', 'Mestre')
                .replace('CHALLENGER', 'Challenger')}
            </PriceTitle>
            <DiscountBadge>10% OFF</DiscountBadge>
            <OldPrice>DE R$ {price.toFixed(2).replace('.', ',')}</OldPrice>
            <PriceText>POR APENAS</PriceText>
            <CurrentPrice>R$ {finalPrice.toFixed(2).replace('.', ',')}</CurrentPrice>
            <ConfirmButton onClick={handleConfirmClick} disabled={loading}>
              {loading ? 'PROCESSANDO...' : 'CONFIRMAR'}
            </ConfirmButton>
            {message && <MessageBox success={message.includes('sucesso')}>{message}</MessageBox>}
          </PriceBox>
        </SelectionArea>
      </MainContent>
    </AppContainer>
  )
}

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(${shacoBackground});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow-x: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    background-position: center center;
  }
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
`

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
`

const YellowText = styled.span`
  color: #FFD700;
`

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    font-size: 0.9rem;
  }
`

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: flex-start;
    margin-top: 2rem;
  }
`

const HeroText = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`

const Subtitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`

const Instructions = styled.p`
  color: white;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  max-width: 800px;
  line-height: 1.6;
  
  strong {
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    padding: 0 1rem;
  }
`

const SelectionArea = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  
  @media (max-width: 1024px) {
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`

const SelectionBox = styled.div`
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  
  @media (max-width: 1024px) {
    width: 280px;
    padding: 1.25rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
  }
`

const EloImage = styled.img`
  width: 170px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
`

const SelectionTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
`

const SelectDropdown = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 15px;
  border: none;
  background-color: white;
  color: black;
  font-weight: 700;
  margin-bottom: 1rem;
  cursor: pointer;
  text-align: center;
  text-align-last: center;
  
  &:focus {
    outline: 2px solid #FFD700;
  }
  
  option {
    font-weight: 700;
  }
`

const PriceBox = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    width: 280px;
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
  }
`

const PriceTitle = styled.h3`
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
`

const DiscountBadge = styled.div`
  background-color: #FFD700;
  color: black;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`

const OldPrice = styled.div`
  color: gray;
  text-decoration: line-through;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const PriceText = styled.div`
  color: gray;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const CurrentPrice = styled.div`
  color: #FFD700;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`

const ConfirmButton = styled.button<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#cccccc' : '#008000'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.85rem 2.5rem;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.1rem;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#006400'};
  }
`

const MessageBox = styled.div<{ success: boolean }>`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
`

export default Home
import { useState } from 'react';
import styled from 'styled-components';
import { Account, pauseJob } from '../services/db';

interface PauseJobModalProps {
  accountId: string;
  boosterId: string;
  onClose: () => void;
  onPauseComplete: () => void;
  account?: Account;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const CurrentEloDisplay = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${(props) => 
    props.variant === 'primary' ? '#3b82f6' : 
    props.variant === 'secondary' ? '#9ca3af' : 
    props.variant === 'danger' ? '#ef4444' : '#3b82f6'};
  
  color: white;
  
  &:hover {
    background-color: ${(props) => 
    props.variant === 'primary' ? '#2563eb' : 
    props.variant === 'secondary' ? '#6b7280' : 
    props.variant === 'danger' ? '#dc2626' : '#2563eb'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// Lista de elos para o select
const eloOptions = [
  { value: 'IRON', label: 'Ferro' },
  { value: 'BRONZE', label: 'Bronze' },
  { value: 'SILVER', label: 'Prata' },
  { value: 'GOLD', label: 'Ouro' },
  { value: 'PLATINUM', label: 'Platina' },
  { value: 'DIAMOND', label: 'Diamante' },
  { value: 'MASTER', label: 'Mestre' },
  { value: 'GRANDMASTER', label: 'Grão-Mestre' },
  { value: 'CHALLENGER', label: 'Desafiante' },
];

// Lista de tiers para o select
const tierOptions = [
  { value: 'IV', label: 'IV' },
  { value: 'III', label: 'III' },
  { value: 'II', label: 'II' },
  { value: 'I', label: 'I' },
];

const PauseJobModal: React.FC<PauseJobModalProps> = ({ 
  accountId, 
  boosterId, 
  onClose, 
  onPauseComplete,
  account
}) => {
  const [currentElo, setCurrentElo] = useState(account?.current_elo || 'IRON');
  const [currentTier, setCurrentTier] = useState(account?.current_tier || 'IV');
  const [pauseReason, setPauseReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formatação do elo para exibição
  const getCurrentEloFormatted = () => {
    // Se estiver nos elos sem tier (Mestre+), mostra só o elo
    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(currentElo)) {
      return currentElo.charAt(0) + currentElo.slice(1).toLowerCase();
    }
    // Caso contrário, mostra elo + tier
    return currentElo.charAt(0) + currentElo.slice(1).toLowerCase() + ' ' + currentTier;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pauseReason) {
      setError('Por favor, forneça um motivo para a pausa.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await pauseJob(accountId, boosterId, pauseReason, currentElo, currentTier);
      onPauseComplete();
    } catch (err) {
      console.error('Erro ao pausar job:', err);
      setError('Não foi possível pausar o job. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Pausar Job</h3>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Qual elo você deixou a conta?</Label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Select 
                  value={currentElo}
                  onChange={(e) => setCurrentElo(e.target.value)}
                  disabled={isSubmitting}
                  style={{ flex: 2 }}
                >
                  {eloOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                
                <Select 
                  value={currentTier}
                  onChange={(e) => setCurrentTier(e.target.value)}
                  disabled={isSubmitting || ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(currentElo)}
                  style={{ flex: 1 }}
                >
                  {tierOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <CurrentEloDisplay>
                Elo atual: {getCurrentEloFormatted()}
              </CurrentEloDisplay>
            </FormGroup>
            
            <FormGroup>
              <Label>Qual o motivo da pausa?</Label>
              <TextArea 
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="Explique o motivo da pausa (obrigatório)..."
                disabled={isSubmitting}
              />
            </FormGroup>
            
            {error && <Error>{error}</Error>}
            
            <ButtonGroup>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Pausa'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PauseJobModal;

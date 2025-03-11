import React from 'react';
import styled from 'styled-components';
import { Account } from '../services/db';
import { formatElo, getEloIcon, openDeepLOLProfile } from '../utils/eloIcons';

interface AccountCardProps {
  account: Account;
  onTakeJob?: (accountId: string) => void;
  showJobInfo?: boolean;
  onPauseJob?: (accountId: string) => void;
  onCompleteJob?: (accountId: string) => void;
}

interface EloInfoProps {
  isLast?: boolean;
}

const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummonerName = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const TagLine = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
  margin-left: 0.25rem;
`;

const Value = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  
  span {
    font-size: 0.875rem;
    opacity: 0.8;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const EloInfo = styled.div<EloInfoProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.isLast ? '0' : '1.5rem')};
`;

const EloSection = styled.div`
  display: flex;
  align-items: center;
`;

const EloIcon = styled.img`
  width: 42px;
  height: 42px;
  margin-right: 0.75rem;
`;

const EloText = styled.div`
  font-size: 1rem;
  
  span {
    display: block;
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.75rem;
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
`;

const CredentialsBox = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const CredentialRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CredentialLabel = styled.span`
  font-weight: 500;
  width: 100px;
  color: #6b7280;
`;

const CredentialValue = styled.span`
  font-family: monospace;
  color: #1f2937;
`;

const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onTakeJob,
  showJobInfo = false,
  onPauseJob,
  onCompleteJob
}) => {
  return (
    <Card>
      <CardHeader>
        <SummonerName>
          {account.summoner_name}
          <TagLine>#{account.tag_line}</TagLine>
        </SummonerName>
        <Value>
          R$ {account.value.toFixed(2)}
          <span> Bruto</span>
        </Value>
      </CardHeader>
      
      <CardBody>
        {showJobInfo && (
          <CredentialsBox>
            <CredentialRow>
              <CredentialLabel>Usuário:</CredentialLabel>
              <CredentialValue>{account.username}</CredentialValue>
            </CredentialRow>
            <CredentialRow>
              <CredentialLabel>Senha:</CredentialLabel>
              <CredentialValue>{account.password}</CredentialValue>
            </CredentialRow>
          </CredentialsBox>
        )}
        
        <EloInfo>
          <EloSection>
            <EloIcon src={getEloIcon(account.current_elo)} alt={account.current_elo} />
            <EloText>
              {formatElo(account.current_elo, account.current_tier)}
              <span>Elo Atual</span>
            </EloText>
          </EloSection>
          
          <span>➡️</span>
          
          <EloSection>
            <EloIcon src={getEloIcon(account.desired_elo)} alt={account.desired_elo} />
            <EloText>
              {formatElo(account.desired_elo, account.desired_tier)}
              <span>Elo Desejado</span>
            </EloText>
          </EloSection>
        </EloInfo>
        
        <ButtonGroup>
          <Button 
            variant="secondary" 
            onClick={() => openDeepLOLProfile(account.summoner_name, account.tag_line)}
          >
            Abrir Perfil
          </Button>
          
          {!showJobInfo && onTakeJob && (
            <Button 
              variant="primary"
              onClick={() => onTakeJob(account.id)}
            >
              Pegar Job
            </Button>
          )}
          
          {showJobInfo && onPauseJob && onCompleteJob && (
            <>
              <Button 
                variant="secondary"
                onClick={() => onPauseJob(account.id)}
              >
                Pausar Job
              </Button>
              <Button 
                variant="primary"
                onClick={() => onCompleteJob(account.id)}
              >
                Finalizar
              </Button>
            </>
          )}
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

export default AccountCard;

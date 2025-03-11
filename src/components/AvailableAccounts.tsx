import { useState, useEffect } from 'react';
import styled from 'styled-components';
import AccountCard from './AccountCard';
import { Account, getAvailableAccounts, takeJob } from '../services/db';

interface AvailableAccountsProps {
  boosterId: string;
  onAccountTaken: () => void;
}

const Container = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const NoAccounts = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
`;

const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AvailableAccounts: React.FC<AvailableAccountsProps> = ({ boosterId, onAccountTaken }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Erro ao carregar contas disponíveis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const handleTakeJob = async (accountId: string) => {
    try {
      await takeJob(accountId, boosterId);
      // Atualiza a lista de contas
      fetchAccounts();
      // Notifica o componente pai
      onAccountTaken();
    } catch (err) {
      console.error('Erro ao pegar job:', err);
      alert('Não foi possível pegar este job. Tente novamente.');
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>Contas Disponíveis</Title>
        <RefreshButton onClick={fetchAccounts}>
          🔄 Atualizar
        </RefreshButton>
      </Header>
      
      {loading ? (
        <p>Carregando contas disponíveis...</p>
      ) : error ? (
        <p>{error}</p>
      ) : accounts.length === 0 ? (
        <NoAccounts>
          <p>Nenhuma conta disponível no momento.</p>
          <p>Novas contas serão exibidas aqui quando estiverem disponíveis.</p>
        </NoAccounts>
      ) : (
        <AccountsGrid>
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onTakeJob={handleTakeJob}
            />
          ))}
        </AccountsGrid>
      )}
    </Container>
  );
};

export default AvailableAccounts;

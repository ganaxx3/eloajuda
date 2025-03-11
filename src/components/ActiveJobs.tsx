import { useState, useEffect } from 'react';
import styled from 'styled-components';
import AccountCard from './AccountCard';
import { Account, getBoosterAccounts } from '../services/db';
import PauseJobModal from './PauseJobModal';
import CompleteJobModal from './CompleteJobModal';

interface ActiveJobsProps {
  boosterId: string;
  onJobStatusChange: () => void;
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

const NoJobs = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActiveJobs: React.FC<ActiveJobsProps> = ({ boosterId, onJobStatusChange }) => {
  const [jobs, setJobs] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para os modais
  const [isPauseModalOpen, setPauseModalOpen] = useState(false);
  const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoosterAccounts(boosterId);
      setJobs(data);
    } catch (err) {
      setError('Erro ao carregar jobs em andamento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs();
  }, [boosterId]);
  
  const handlePauseJob = (accountId: string) => {
    setSelectedAccountId(accountId);
    setPauseModalOpen(true);
  };
  
  const handleCompleteJob = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCompleteModalOpen(true);
  };
  
  const handleModalClose = () => {
    setPauseModalOpen(false);
    setCompleteModalOpen(false);
    setSelectedAccountId(null);
  };
  
  const handleJobStatusUpdated = () => {
    fetchJobs();
    onJobStatusChange();
    handleModalClose();
  };
  
  return (
    <Container>
      <Header>
        <Title>Jobs em Andamento</Title>
        <RefreshButton onClick={fetchJobs}>
          🔄 Atualizar
        </RefreshButton>
      </Header>
      
      {loading ? (
        <p>Carregando seus jobs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : jobs.length === 0 ? (
        <NoJobs>
          <p>Você não tem jobs em andamento.</p>
          <p>Você pode pegar novos jobs na aba "Contas Disponíveis".</p>
        </NoJobs>
      ) : (
        <JobsGrid>
          {jobs.map((job) => (
            <AccountCard
              key={job.id}
              account={job}
              showJobInfo={true}
              onPauseJob={handlePauseJob}
              onCompleteJob={handleCompleteJob}
            />
          ))}
        </JobsGrid>
      )}
      
      {isPauseModalOpen && selectedAccountId && (
        <PauseJobModal
          accountId={selectedAccountId}
          boosterId={boosterId}
          onClose={handleModalClose}
          onPauseComplete={handleJobStatusUpdated}
          account={jobs.find(job => job.id === selectedAccountId)}
        />
      )}
      
      {isCompleteModalOpen && selectedAccountId && (
        <CompleteJobModal
          accountId={selectedAccountId}
          boosterId={boosterId}
          onClose={handleModalClose}
          onCompleteSuccess={handleJobStatusUpdated}
        />
      )}
    </Container>
  );
};

export default ActiveJobs;

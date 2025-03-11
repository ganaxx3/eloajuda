import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from '../../services/supabase';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import AvailableAccounts from '../../components/AvailableAccounts';
import ActiveJobs from '../../components/ActiveJobs';
import BoosterChat from '../../components/BoosterChat';

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #f9fafb;
  overflow-y: auto;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  // Itens do menu lateral
  const sidebarItems = [
    { id: 'accounts', label: 'Contas Disponíveis', icon: '🔍' },
    { id: 'jobs', label: 'Meus Jobs', icon: '⚔️' },
    { id: 'chat', label: 'Chat', icon: '💬', notification: unreadMessages }
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await getCurrentUser();
        
        if (!data?.user) {
          // Redireciona para login se não estiver autenticado
          navigate('/login');
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  // Função para alternar entre as abas
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Se mudar para a aba de chat, zera as notificações
    if (tabId === 'chat') {
      setUnreadMessages(0);
    }
  };
  
  // Função callback quando o status de um job é alterado
  const handleJobStatusChange = () => {
    // Aqui você pode adicionar lógica adicional se necessário
    console.log('Status do job alterado');
  };
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2>Carregando...</h2>
          <p>Aguarde enquanto carregamos seus dados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <DashboardWrapper>
      <Sidebar 
        items={sidebarItems}
        activeItem={activeTab}
        onItemClick={handleTabChange}
        username={user?.username || 'Booster'}
        userRole={user?.role || 'Booster'}
        onLogout={handleLogout}
      />
      
      <MainContent>
        {activeTab === 'accounts' && (
          <AvailableAccounts 
            boosterId={user?.id}
            onAccountTaken={handleJobStatusChange}
          />
        )}
        
        {activeTab === 'jobs' && (
          <ActiveJobs 
            boosterId={user?.id}
            onJobStatusChange={handleJobStatusChange}
          />
        )}
        
        {activeTab === 'chat' && (
          <BoosterChat 
            boosterId={user?.id}
          />
        )}
      </MainContent>
    </DashboardWrapper>
  );
};

export default Dashboard;

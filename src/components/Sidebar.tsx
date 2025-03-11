import styled from 'styled-components';

// Tipos para os itens do menu
interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  notification?: number;
}

// Props do componente
interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  username?: string;
  userRole?: string;
  onLogout?: () => void;
}

const SidebarContainer = styled.div`
  width: 260px;
  background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 1rem;
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const UserRole = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-top: 1rem;
`;

const MenuItem = styled.div<{ active: boolean }>`
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background-color: ${(props) => (props.active ? 'rgba(59, 130, 246, 0.2)' : 'transparent')};
  border-left: ${(props) => (props.active ? '4px solid #3b82f6' : '4px solid transparent')};
  
  &:hover {
    background-color: ${(props) => (props.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)')};
  }
`;

const MenuIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const MenuLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const NotificationBadge = styled.span`
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled.button`
  margin: 1rem;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Sidebar = ({ 
  items, 
  activeItem, 
  onItemClick, 
  username = 'Usuário', 
  userRole = 'Booster',
  onLogout 
}: SidebarProps) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <span>Elo Jobs</span>
        </Logo>
        <UserInfo>
          <UserAvatar>{username.charAt(0).toUpperCase()}</UserAvatar>
          <UserText>
            <UserName>{username}</UserName>
            <UserRole>{userRole}</UserRole>
          </UserText>
        </UserInfo>
      </SidebarHeader>
      
      <SidebarMenu>
        {items.map((item) => (
          <MenuItem 
            key={item.id}
            active={activeItem === item.id}
            onClick={() => onItemClick(item.id)}
          >
            <MenuIcon>{item.icon}</MenuIcon>
            <MenuLabel>{item.label}</MenuLabel>
            {item.notification ? (
              <NotificationBadge>{item.notification}</NotificationBadge>
            ) : null}
          </MenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter>
        <LogoutButton onClick={onLogout}>
          🚪 Sair
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;

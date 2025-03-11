import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChatMessage, getChatMessages, sendChatMessage, markMessagesAsRead } from '../services/db';

interface BoosterChatProps {
  boosterId: string;
  adminId?: string;
}

const Container = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  align-self: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isOwn ? '#3b82f6' : 'white')};
  color: ${(props) => (props.isOwn ? 'white' : '#1f2937')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  font-weight: 400;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    ${(props) => (props.isOwn ? 'right: -10px' : 'left: -10px')};
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: ${(props) => (props.isOwn ? '#3b82f6' : 'white')};
    border-bottom: 0;
    border-${(props) => (props.isOwn ? 'left' : 'right')}: 0;
    margin-bottom: -10px;
  }
`;

const MessageTime = styled.div<{ isOwn: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.isOwn ? 'rgba(255, 255, 255, 0.7)' : '#6b7280')};
  margin-top: 0.25rem;
`;

const ChatInputContainer = styled.form`
  display: flex;
  gap: 0.75rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const SendButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const EmptyChat = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const BoosterChat: React.FC<BoosterChatProps> = ({ boosterId, adminId = 'admin' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChatMessages(boosterId, adminId);
      setMessages(data);
      
      // Marca mensagens como lidas
      await markMessagesAsRead(boosterId);
    } catch (err) {
      setError('Erro ao carregar mensagens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
    
    // Configurar polling para buscar novas mensagens a cada 30 segundos
    const intervalId = setInterval(fetchMessages, 30000);
    
    return () => clearInterval(intervalId);
  }, [boosterId, adminId]);
  
  useEffect(() => {
    // Rola para a última mensagem quando as mensagens são carregadas ou atualizadas
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      await sendChatMessage(boosterId, adminId, newMessage.trim());
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };
  
  return (
    <Container>
      <Header>
        <Title>Chat com Administrador</Title>
      </Header>
      
      <ChatContainer ref={chatContainerRef}>
        {loading && messages.length === 0 ? (
          <p>Carregando mensagens...</p>
        ) : error ? (
          <p>{error}</p>
        ) : messages.length === 0 ? (
          <EmptyChat>
            <p>Nenhuma mensagem ainda.</p>
            <p>Envie uma mensagem para iniciar a conversa com o administrador.</p>
          </EmptyChat>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              isOwn={message.sender_id === boosterId}
            >
              {message.message}
              <MessageTime isOwn={message.sender_id === boosterId}>
                {formatMessageTime(message.created_at)}
              </MessageTime>
            </MessageBubble>
          ))
        )}
      </ChatContainer>
      
      <ChatInputContainer onSubmit={handleSendMessage}>
        <ChatInput 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isSending}
        />
        <SendButton type="submit" disabled={isSending || !newMessage.trim()}>
          {isSending ? '...' : 'Enviar'}
        </SendButton>
      </ChatInputContainer>
    </Container>
  );
};

export default BoosterChat;

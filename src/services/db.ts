import { getSupabase } from './supabase';

// Tipos para representar os dados no banco
export interface Account {
  id: string;
  summoner_name: string;
  tag_line: string;  // O # após o nome
  username: string;
  password: string;
  current_elo: string;
  current_tier?: string;
  desired_elo: string;
  desired_tier?: string;
  value: number;
  status: 'available' | 'in_progress' | 'paused' | 'completed';
  assigned_to?: string; // ID do booster
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface JobLog {
  id: string;
  account_id: string;
  booster_id: string;
  action: 'started' | 'paused' | 'resumed' | 'completed' | 'rejected';
  pause_reason?: string;
  current_elo?: string;
  current_tier?: string;
  screenshot_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Funções para interagir com o banco de dados
export const getAvailableAccounts = async () => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar contas disponíveis:', error);
    throw error;
  }
  
  return data as Account[];
};

export const formatBoosterId = (boosterId: string | number): string => {
  if (!boosterId) return '';
  
  // Converter para string se for número
  const boosterIdStr = String(boosterId);
  
  // Verificar se o boosterId parece um número simples
  if (/^\d+$/.test(boosterIdStr)) {
    // Se for um número simples, crie um UUID v4 baseado nele
    return `11111111-1111-1111-1111-${boosterIdStr.padStart(12, '0')}`;
  }
  
  // Se já parece um UUID, retorne como está
  return boosterIdStr;
};

export const getBoosterAccounts = async (boosterId: string) => {
  const supabase = getSupabase();
  
  // Converter para UUID válido
  const formattedBoosterId = formatBoosterId(boosterId);
  
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('assigned_to', formattedBoosterId)
    .in('status', ['in_progress', 'paused'])
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar contas do booster:', error);
    throw error;
  }
  
  return data as Account[];
};

export const takeJob = async (accountId: string, boosterId: string) => {
  const supabase = getSupabase();
  
  // Primeiro verificamos se a conta está disponível
  const { data: accountCheck, error: checkError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .eq('status', 'available')
    .maybeSingle(); // Usamos maybeSingle em vez de single
    
  if (checkError) {
    console.error('Erro ao verificar conta:', checkError);
    throw checkError;
  }
  
  if (!accountCheck) {
    throw new Error('Conta não encontrada ou não está disponível');
  }
  
  // Agora atualizamos a conta
  const { data, error } = await supabase
    .from('accounts')
    .update({ 
      status: 'in_progress',
      assigned_to: formatBoosterId(boosterId),
      updated_at: new Date().toISOString()
    })
    .eq('id', accountId)
    .select();
    
  if (error) {
    console.error('Erro ao pegar job:', error);
    throw error;
  }
  
  tryLogAction({
    account_id: accountId,
    booster_id: boosterId,
    action: 'started'
  });
  
  // Retornamos o primeiro item do array, se existir
  return data && data.length > 0 ? data[0] as Account : null;
};

export const pauseJob = async (accountId: string, boosterId: string, pauseReason: string, currentElo: string, currentTier: string) => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('accounts')
    .update({ 
      status: 'paused',
      current_elo: currentElo,
      current_tier: currentTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', accountId)
    .eq('assigned_to', formatBoosterId(boosterId))
    .eq('status', 'in_progress')
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao pausar job:', error);
    throw error;
  }
  
  tryLogAction({
    account_id: accountId,
    booster_id: boosterId,
    action: 'paused',
    pause_reason: pauseReason,
    current_elo: currentElo,
    current_tier: currentTier
  });
  
  return data;
};

export const completeJob = async (accountId: string, boosterId: string, finalElo: string, finalTier: string) => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('accounts')
    .update({ 
      status: 'completed',
      current_elo: finalElo,
      current_tier: finalTier,
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    })
    .eq('id', accountId)
    .eq('assigned_to', formatBoosterId(boosterId))
    .in('status', ['in_progress', 'paused'])
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao completar job:', error);
    throw error;
  }
  
  tryLogAction({
    account_id: accountId,
    booster_id: boosterId,
    action: 'completed',
    current_elo: finalElo,
    current_tier: finalTier
  });
  
  return data;
};

export const getPausedAccounts = async () => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('status', 'paused')
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar contas pausadas:', error);
    throw error;
  }
  
  return data as Account[];
};

export const resumeAccount = async (accountId: string) => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('accounts')
    .update({ 
      status: 'available',
      assigned_to: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', accountId)
    .eq('status', 'paused')
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao retornar conta para disponível:', error);
    throw error;
  }
  
  return data as Account;
};

export const approveCompletedJob = async (accountId: string, boosterId: string) => {
  const supabase = getSupabase();
  
  // Busca informações da conta
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single();
    
  if (accountError) {
    console.error('Erro ao buscar informações da conta:', accountError);
    throw accountError;
  }
  
  // Envia mensagem para o booster
  const message = `Conta: @${account.summoner_name}#${account.tag_line}, foi finalizado com sucesso o Elo Job, envie seu PIX, para receber seu pagamento.`;
  
  const { error: messageError } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: 'admin', // ID do admin
      receiver_id: formatBoosterId(boosterId),
      message: message,
      read: false,
      created_at: new Date().toISOString()
    });
    
  if (messageError) {
    console.error('Erro ao enviar mensagem para o booster:', messageError);
    throw messageError;
  }
  
  return { success: true };
};

export const getChatMessages = async (userId: string, adminId: string = 'admin') => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${adminId},receiver_id.eq.${adminId}`)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Erro ao buscar mensagens de chat:', error);
    throw error;
  }
  
  return data as ChatMessage[];
};

export const sendChatMessage = async (senderId: string, receiverId: string, message: string) => {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
  
  return data as ChatMessage;
};

export const markMessagesAsRead = async (userId: string) => {
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from('chat_messages')
    .update({ read: true })
    .eq('receiver_id', userId)
    .eq('read', false);
    
  if (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    throw error;
  }
  
  return { success: true };
};

// Flag para controlar se devemos tentar registrar logs
let canLogActions = true;

// Nova função para lidar com o registro de logs de maneira centralizada
export const tryLogAction = async (data: {
  account_id: string;
  booster_id: string | number;
  action: 'started' | 'paused' | 'completed';
  pause_reason?: string;
  current_elo?: string;
  current_tier?: string;
}) => {
  // Se já sabemos que não podemos registrar logs, retornamos imediatamente
  if (!canLogActions) return;
  
  try {
    const supabase = getSupabase();
    
    // Vamos tentar fazer a inserção direta primeiro
    const { error } = await supabase
      .from('job_logs')
      .insert({
        account_id: data.account_id,
        booster_id: formatBoosterId(data.booster_id),
        action: data.action,
        pause_reason: data.pause_reason,
        current_elo: data.current_elo,
        current_tier: data.current_tier,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      if (error.code === '42501') {
        // Se o erro for de permissão, desabilitamos as tentativas futuras
        canLogActions = false;
        console.warn('Sem permissão para registrar logs. Funcionalidade de log desativada para esta sessão.');
      } else {
        console.error('Erro ao registrar log:', error);
      }
    }
  } catch (err) {
    console.error('Exceção ao registrar log:', err);
    // Não repassamos o erro para fora, já que isso é uma operação secundária
  }
};

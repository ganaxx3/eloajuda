import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Criamos uma função para inicializar o cliente Supabase apenas quando necessário
// em vez de inicializar na importação do módulo
const createSupabaseClient = () => {
  // Verificação explícita se estamos na página de login ou dashboard
  // para evitar inicialização na página Home
  const isAuthPage = window.location.pathname.includes('/login') || 
                    window.location.pathname.includes('/dashboard');
  
  if (!isAuthPage) {
    console.log('Não é uma página de autenticação, supabase não inicializado');
    // Retornamos um mock para evitar erros caso seja usado incorretamente
    return {} as SupabaseClient;
  }
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL ou Anon Key não estão definidos');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Cliente será inicializado apenas quando for usado
let supabaseInstance: SupabaseClient | null = null;

// Função para obter o cliente Supabase
export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

// Interface para usuário da tabela
export interface User {
  id: number;
  username: string;
  password: string;
  role?: string;
  created_at?: string;
}

// Função para login usando table editor em vez de auth
export const signInWithEmail = async (
  username: string,
  password: string
) => {
  try {
    const supabase = getSupabase();
    
    // Busca o usuário pelo username
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verifica se a senha está correta
    // NOTA: Em produção, as senhas devem ser hasheadas
    if (data.password !== password) {
      throw new Error('Senha incorreta');
    }
    
    // Remove a senha do objeto antes de retornar
    const { password: _, ...userWithoutPassword } = data;
    
    // Armazena as informações do usuário no localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { data: userWithoutPassword, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    // Remove as informações do usuário do localStorage
    localStorage.removeItem('user');
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    // Obtém o usuário do localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return { data: null, error: null };
    }
    
    const user = JSON.parse(userStr);
    return { data: { user }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

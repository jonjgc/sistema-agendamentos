import { create } from 'zustand';

interface AuthState {
  token: string | null;
  nome: string | null;
  perfil: string | null;
  login: (token: string, nome: string, perfil: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('@Agendamentos:token'),
  nome: localStorage.getItem('@Agendamentos:nome'),
  perfil: localStorage.getItem('@Agendamentos:perfil'),
  
  login: (token, nome, perfil) => {
    localStorage.setItem('@Agendamentos:token', token);
    localStorage.setItem('@Agendamentos:nome', nome);
    localStorage.setItem('@Agendamentos:perfil', perfil);
    set({ token, nome, perfil });
  },
  
  logout: () => {
    localStorage.removeItem('@Agendamentos:token');
    localStorage.removeItem('@Agendamentos:nome');
    localStorage.removeItem('@Agendamentos:perfil');
    set({ token: null, nome: null, perfil: null });
  },
}));
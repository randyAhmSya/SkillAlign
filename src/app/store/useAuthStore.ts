import { create } from 'zustand';
import api from '../lib/axios';

interface AuthState {
  user: any | null;
  isFetched: boolean;
  isFetching: boolean;
  
  aiSuggestions: string[];
  isCvFetched: boolean; 

  fetchUser: (force?: boolean) => Promise<void>;
  fetchAiSuggestions: (userId: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isFetched: false,
  isFetching: false,
  
  aiSuggestions: [],
  isCvFetched: false,

  logout: () => {
    localStorage.removeItem("token"); 

    set({ 
      user: null, 
      isFetched: false, 
      isFetching: false, 
      aiSuggestions: [], 
      isCvFetched: false 
    });

    window.location.href = "/auth";
  },

  fetchUser: async (force = false) => {
    if (!force && (get().isFetched || get().isFetching)) return; 
    
    set({ isFetching: true }); 
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.data, isFetched: true });
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
    } finally {
      set({ isFetching: false }); 
    }
  },

  fetchAiSuggestions: async (userId: string) => {
    if (get().isCvFetched) return; 

    try {
      const cvResponse = await api.get(`/users/${userId}/cvs`);
      const cvData = cvResponse.data.data;

      if (cvData && cvData.length > 0 && cvData[0].aiAnalysis) {
        const suggestions = cvData[0].aiAnalysis.suggested_job_titles;
        if (suggestions) {
          const titles = suggestions.map((item: any) => item.title);
          set({ aiSuggestions: titles, isCvFetched: true });
        }
      } else {
        set({ isCvFetched: true });
      }
    } catch (error) {
      console.error("Gagal mengambil rekomendasi AI:", error);
    }
  }
}));

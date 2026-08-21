import { create } from 'zustand';

interface UIState {
  activeConversationId: string | null;
  isNewChatOpen: boolean;
  isNewGroupOpen: boolean;
  isMobileSidebarOpen: boolean;

  setActiveConversation: (id: string | null) => void;
  setNewChatOpen: (open: boolean) => void;
  setNewGroupOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeConversationId: null,
  isNewChatOpen: false,
  isNewGroupOpen: false,
  isMobileSidebarOpen: false,

  setActiveConversation: (id) => set({ activeConversationId: id }),
  setNewChatOpen: (open) => set({ isNewChatOpen: open }),
  setNewGroupOpen: (open) => set({ isNewGroupOpen: open }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
}));

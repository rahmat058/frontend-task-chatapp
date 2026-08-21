import { create } from 'zustand'

interface UIState {
  activeConversationId: string | null
  isNewChatOpen: boolean
  isNewGroupOpen: boolean
  isMobileSidebarOpen: boolean
  unreadById: Record<string, number>

  setActiveConversation: (id: string | null) => void
  setNewChatOpen: (open: boolean) => void
  setNewGroupOpen: (open: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  incrementUnread: (conversationId: string) => void
  clearUnread: (conversationId: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeConversationId: null,
  isNewChatOpen: false,
  isNewGroupOpen: false,
  isMobileSidebarOpen: false,
  unreadById: {},

  setActiveConversation: (id) =>
    set((state) => ({
      activeConversationId: id,
      unreadById: id && state.unreadById[id] ? { ...state.unreadById, [id]: 0 } : state.unreadById,
    })),
  setNewChatOpen: (open) => set({ isNewChatOpen: open }),
  setNewGroupOpen: (open) => set({ isNewGroupOpen: open }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  incrementUnread: (conversationId) =>
    set((state) => ({
      unreadById: {
        ...state.unreadById,
        [conversationId]: (state.unreadById[conversationId] ?? 0) + 1,
      },
    })),
  clearUnread: (conversationId) =>
    set((state) => ({
      unreadById: { ...state.unreadById, [conversationId]: 0 },
    })),
}))

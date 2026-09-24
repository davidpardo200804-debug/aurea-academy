import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  User,
  UserRole,
  AppDataStore,
  AppNotification,
  ChatMessage,
  RolePermissions,
} from '../types';
import { appStorage } from '../services/storage';
import { soundEffects } from '../services/audio';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  store: AppDataStore;
  unreadNotifsCount: number;
  unreadChatsCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCurrentUser: (user: User) => void;
  switchRoleQuickly: (role: UserRole) => void;
  refreshData: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  selectedChatContactId: string | null;
  setSelectedChatContactId: (id: string | null) => void;
  userNotifications: AppNotification[];
  hasPermission: (moduleKey: keyof RolePermissions, role?: UserRole) => boolean;
  playNotificationSound: () => void;
  playMessageSound: () => void;
  playSuccessSound: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<AppDataStore>(() => appStorage.getStore());
  const [currentUser, setCurrentUserState] = useState<User>(() => appStorage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedChatContactId, setSelectedChatContactId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync with storage updates (including multi-tab BroadcastChannel updates)
  useEffect(() => {
    const unsubscribe = appStorage.subscribe(() => {
      const updatedStore = appStorage.getStore();
      const updatedUser = appStorage.getCurrentUser();
      setStore({ ...updatedStore });
      setCurrentUserState({ ...updatedUser });
    });
    return unsubscribe;
  }, []);

  const refreshData = useCallback(() => {
    setStore({ ...appStorage.getStore() });
    setCurrentUserState({ ...appStorage.getCurrentUser() });
  }, []);

  const setCurrentUser = useCallback((user: User) => {
    appStorage.setCurrentUser(user);
    setCurrentUserState(user);
    // Reset active tab to dashboard for clean UX
    setActiveTab('dashboard');
  }, []);

  const switchRoleQuickly = useCallback((role: UserRole) => {
    const s = appStorage.getStore();
    const candidate = s.users.find((u) => u.role === role) || s.users[0];
    setCurrentUser(candidate);
  }, [setCurrentUser]);

  // Notifications filtering for current user
  const userNotifications = useMemo(() => {
    return store.notifications.filter((n) => {
      return (
        n.targetUserId === currentUser.id ||
        n.targetUserId === currentUser.role ||
        n.targetUserId === 'all'
      );
    });
  }, [store.notifications, currentUser]);

  const unreadNotifsCount = useMemo(() => {
    return userNotifications.filter((n) => !n.read).length;
  }, [userNotifications]);

  const unreadChatsCount = useMemo(() => {
    return store.chats.filter(
      (m: ChatMessage) => m.receiverId === currentUser.id && !m.read
    ).length;
  }, [store.chats, currentUser]);

  const currentRole = currentUser.role;

  const hasPermission = useCallback(
    (moduleKey: keyof RolePermissions, role?: UserRole): boolean => {
      const targetRole = role || currentRole;
      if (!store.permissions) return true;
      const rolePerms = store.permissions[targetRole];
      if (!rolePerms) return true;
      return rolePerms[moduleKey] ?? true;
    },
    [currentRole, store.permissions]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        store,
        unreadNotifsCount,
        unreadChatsCount,
        activeTab,
        setActiveTab,
        setCurrentUser,
        switchRoleQuickly,
        refreshData,
        isChatOpen,
        setIsChatOpen,
        selectedChatContactId,
        setSelectedChatContactId,
        userNotifications,
        hasPermission,
        playNotificationSound: soundEffects.playNotificationSound.bind(soundEffects),
        playMessageSound: soundEffects.playMessageSound.bind(soundEffects),
        playSuccessSound: soundEffects.playSuccessSound.bind(soundEffects),
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React, { createContext, useContext } from 'react';
import { useAppStore, AppStoreType } from './app-store';

const AppStoreContext = createContext<AppStoreType | null>(null);

export const AppStoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const store = useAppStore();
  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
};

export function useStore(): AppStoreType {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('useStore must be used within AppStoreProvider');
  }
  return store;
}

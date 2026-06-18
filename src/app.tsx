import React from 'react';
import './app.scss';
import { AppStoreProvider } from '@/store/app-context';

function App(props) {
  return (
    <AppStoreProvider>
      {props.children}
    </AppStoreProvider>
  );
}

export default App;

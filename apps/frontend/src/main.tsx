import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './pages-apis/auth/auth-context';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './styles.css';
import { InvestmentHistoryFilterProvider } from './pages/investment-page/investments-context/investment-history-filter-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
       <MantineProvider>
        <InvestmentHistoryFilterProvider>
          <App />
        </InvestmentHistoryFilterProvider>
        </MantineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

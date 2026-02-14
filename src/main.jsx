import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSampleData } from './utils/storage';
import './index.css';

// Инициализируем демо-данные при первом запуске
initSampleData();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

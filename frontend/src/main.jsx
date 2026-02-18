import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSampleData } from '../api/applications.js';
import './index.css';

initSampleData();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

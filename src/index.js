import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/App';

require('dotenv-flow').config();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

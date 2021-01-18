import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

ReactDOM.render(
  <Router >
      <Route exact path = "/" component = {App} />
   </Router>,
  document.getElementById('root')
);
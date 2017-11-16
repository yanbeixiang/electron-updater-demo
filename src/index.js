import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import registerServiceWorker from './registerServiceWorker';import { Router, Route, Switch } from 'react-router'
import Routes from './renderer/routers';

ReactDOM.render(
    <HashRouter>
        <Routes />
    </HashRouter>,
    document.getElementById('root'));

registerServiceWorker();

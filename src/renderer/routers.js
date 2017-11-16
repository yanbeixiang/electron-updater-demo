import React from 'react';
import { Switch, Route} from 'react-router';
import App from './compontents/App/App';
import Home from './compontents/Home/Home';
import Updater from './compontents/Updater/Updater';

export default function Routes() {
    return (
        <App>
            <Switch>
                <Route path='/updater' component={Updater} />
                <Route path='/' component={Home} />
            </Switch>
        </App>
    );
}
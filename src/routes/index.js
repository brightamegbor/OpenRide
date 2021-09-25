import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Landing from '../pages/landing/landing';
import RegisterDriver from '../pages/register_driver';

export default function Routes() {
    return (
        <Switch data="data">
            <Route path="/" exact component={Landing} />
            <Route path="/register-driver" component={RegisterDriver} />
        </Switch>
    )
}
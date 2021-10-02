import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import DriverOnboarding from '../pages/driver_onboarding';
import Landing from '../pages/landing/landing';
import RegisterDriver from '../pages/register_driver';

export default function Routes() {
    return (
        <Switch data="data">
            <Route path="/" exact component={Landing} />
            <Route path="/register-driver" exact component={withRouter(RegisterDriver)} />
            <Route path="/register-driver/onboarding/:id" exact component={withRouter(DriverOnboarding)} />
        </Switch>
    )
}
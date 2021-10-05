import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import RegisterDriver from '../pages/auth/register_driver';
import DriverOnboarding from '../pages/auth/driver_onboarding';
import Landing from '../pages/landing/landing';

export default function Routes() {
    return (
        <Switch data="data">
            <Route path="/" exact component={Landing} />
            <Route path="/register-driver" exact component={withRouter(RegisterDriver)} />
            <Route path="/register-driver/onboarding/:id" exact component={withRouter(DriverOnboarding)} />
        </Switch>
    )
}
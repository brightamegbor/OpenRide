import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import RegisterDriver from '../pages/auth/register_driver';
import DriverOnboarding from '../pages/auth/driver_onboarding';
import Landing from '../pages/landing/landing';
import LoginDriver from '../pages/auth/login_driver';
import DriverDashboard from '../pages/driver_dashboard';
import RegisterRide from '../pages/auth/ride';
import NotFoundComponent from '../pages/not_found';
import RideDashboard from '../pages/ride_dashboard';

export default function Routes() {
    return (
        <Switch data="data">
            <Route path="/" exact component={Landing} />
            <Route path="/register-driver" exact component={withRouter(RegisterDriver)} />
            <Route path="/register-driver/onboarding/:id" exact component={withRouter(DriverOnboarding)} />
            <Route path="/login-driver" exact component={withRouter(LoginDriver)} />
            <Route path="/driver-dashboard" exact component={withRouter(DriverDashboard)} />
            <Route path="/register-ride" exact component={withRouter(RegisterRide)} />
            <Route path="/ride-home" exact component={withRouter(RideDashboard)} />
            <Route path="/*" exact component={withRouter(NotFoundComponent)} />
        </Switch>
    )
}
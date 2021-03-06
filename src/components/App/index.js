import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Container } from "reactstrap";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import JavascriptExamPage from "../JavascriptExam";
import RecruiterPage from "../Recruiter";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

const App = () => (
    <Router>
        <Container fluid>
            <Navigation />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForgetPage}
            />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.RECRUITER_HOME} component={RecruiterPage} />
            <Route
                path={ROUTES.EXAM_JS_LANDING}
                component={JavascriptExamPage}
            />
        </Container>
    </Router>
);

export default withAuthentication(App);

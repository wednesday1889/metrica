import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            const { firebase, history } = this.props;
            this.listener = firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        // since authUser is not null, then user is probably not profileDone yet. Go back to HOME
                        history.push(ROUTES.HOME);
                    } else if (authUser.roles.includes(ROLES.RECRUITER)) {
                        // TODO: Probably doesn't belong here
                        history.push(ROUTES.RECRUITER_HOME);
                    } else if (authUser.roles.includes(ROLES.ADMIN)) {
                        // TODO: Probably doesn't belong here
                        history.push(ROUTES.ADMIN);
                    }
                },
                () => history.push(ROUTES.SIGN_IN)
            );
        }

        componentWillUnmount() {
            if (this.listener) {
                this.listener();
            }
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? (
                            <Component {...this.props} />
                        ) : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase
    )(WithAuthorization);
};

export default withAuthorization;

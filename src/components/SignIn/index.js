import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import {
    Alert,
    Col,
    Row,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback
} from "reactstrap";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
    <Row>
        <Col sm={{ size: 8, offset: 3 }}>
            <h2>Login</h2>
            <SignInForm />
            <Col sm={5}>
                <PasswordForgetLink />
            </Col>
            <Col sm={5}>
                <SignUpLink />
            </Col>
        </Col>
    </Row>
);

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            email: "",
            password: "",
            validate: {
                emailState: ""
            }
        };
    }

    onSubmit = event => {
        const { email, password } = this.state;
        const { firebase, history } = this.props;
        firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateEmail(e) {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validate } = this.state;
        if (emailRex.test(e.target.value)) {
            validate.emailState = "has-success";
        } else {
            validate.emailState = "has-danger";
        }
        this.setState({ validate });
    }

    render() {
        const { email, password, error, validate } = this.state;

        const isInvalid =
            password === "" ||
            email === "" ||
            validate.emailState === "has-danger";

        return (
            <Form className="form" onSubmit={this.onSubmit}>
                <Col sm={5}>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="youremail@domain.com"
                            value={email}
                            valid={validate.emailState === "has-success"}
                            invalid={validate.emailState === "has-danger"}
                            onChange={e => {
                                this.validateEmail(e);
                                this.onChange(e);
                            }}
                        />
                        <FormFeedback valid>Email is valid</FormFeedback>
                        <FormFeedback>
                            Uh oh! Looks like there is an issue with your email.
                            Please input a correct email.
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="********"
                            value={password}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <Button disabled={isInvalid} type="submit" block>
                        Login
                    </Button>
                    <FormGroup>
                        {error && (
                            <Alert className="mt-2" color="danger">
                                {error.message}
                            </Alert>
                        )}
                    </FormGroup>
                </Col>
            </Form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm };

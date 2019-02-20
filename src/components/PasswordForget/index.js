import React, { Component } from "react";
import { Link } from "react-router-dom";

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

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
    <Row>
        <Col sm={{ size: 8, offset: 4 }}>
            <h2>Forgot Password</h2>
            <PasswordForgetForm />
        </Col>
    </Row>
);

const INITIAL_STATE = {
    email: "",
    error: null,
    validate: {
        emailState: ""
    }
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;
        const { firebase } = this.props;
        firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateEmail = event => {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validate } = this.state;
        if (emailRex.test(event.target.value)) {
            validate.emailState = "has-success";
        } else {
            validate.emailState = "has-danger";
        }
        this.setState({ validate });
    };

    render() {
        const { email, error, validate } = this.state;

        const isInvalid = email === "" || validate.emailState === "has-danger";

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
                        <Button disabled={isInvalid} type="submit">
                            Reset My Password
                        </Button>

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

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };

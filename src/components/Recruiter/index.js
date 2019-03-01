import React, { Component } from "react";
import { compose } from "recompose";
import {
    Container,
    Row,
    Col,
    Badge,
    Form,
    FormGroup,
    Button,
    Input,
    Label,
    FormFeedback,
    Alert,
    Table
} from "reactstrap";

import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as SCREENINGSTATUS from "../../constants/screeningStatus";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    candidates: [],
    email: "",
    error: null,
    validate: {
        emailState: ""
    }
};

const renderBadge = screeningStatus => {
    let badgeColor;
    let statusText;

    switch (screeningStatus) {
    case SCREENINGSTATUS.REGISTERED:
        badgeColor = "primary";
        statusText = "Registered";
        break;
    case SCREENINGSTATUS.READY_TO_TAKE_EXAM:
        badgeColor = "primary";
        statusText = "Ready to take Exam";
        break;
    case SCREENINGSTATUS.EXAM_STARTED:
        badgeColor = "info";
        statusText = "Exam Started";
        break;
    case SCREENINGSTATUS.FOR_ASSESSMENT:
        badgeColor = "warning";
        statusText = "For Assessment";
        break;
    case SCREENINGSTATUS.PASSED:
        badgeColor = "success";
        statusText = "Passed";
        break;
    case SCREENINGSTATUS.FAILED:
        badgeColor = "danger";
        statusText = "Failed";
        break;
    default:
        badgeColor = "secondary";
        statusText = "Not Registered";
        break;
    }

    return <Badge color={badgeColor}>{statusText}</Badge>;
};

const generateExamCode = () => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i += 1) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
};

class RecruiterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.unsubscribeCandidates = firebase
            .allCandidateStatus()
            .onSnapshot(querySnapshot => {
                const candidates = [];
                querySnapshot.forEach(doc => {
                    const candidateStatus = doc.data();
                    candidates.push({
                        email: doc.id,
                        ...candidateStatus
                    });
                    this.setState({ candidates });
                });
            });
    }

    componentWillUnmount() {
        if (this.unsubscribeCandidates) {
            this.unsubscribeCandidates();
        }
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = event => {
        const { email } = this.state;
        const { firebase } = this.props;
        firebase
            .candidateStatus(email)
            .set({
                examCode: generateExamCode(),
                screeningStatus: SCREENINGSTATUS.NOT_REGISTERED
            })
            .then(() => {
                this.setState({ email: "" });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
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

    renderCandidates() {
        const { candidates } = this.state;

        const candidateRows = candidates.map(candidate => {
            return (
                <tr>
                    <td>{candidate.email}</td>
                    <td>{candidate.firstName}</td>
                    <td>{candidate.lastName}</td>
                    <td>{candidate.examCode}</td>
                    <td>{renderBadge(candidate.screeningStatus)}</td>
                </tr>
            );
        });

        return candidateRows;
    }

    render() {
        const { email, error, validate } = this.state;
        const isInvalid = email === "" || validate.emailState === "has-danger";
        return (
            <Container>
                <Row>
                    <Col
                        lg={{ size: 6, offset: 3 }}
                        md={{ size: 6, offset: 3 }}
                    >
                        <Form className="form" onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="candidate-email@domain.com"
                                    value={email}
                                    valid={
                                        validate.emailState === "has-success"
                                    }
                                    invalid={
                                        validate.emailState === "has-danger"
                                    }
                                    onChange={e => {
                                        this.validateEmail(e);
                                        this.onChange(e);
                                    }}
                                />
                                <Button
                                    className="mt-2"
                                    disabled={isInvalid}
                                    type="submit"
                                >
                                    Invite a Candidate for Exam
                                </Button>
                                <FormFeedback valid>
                                    Email is valid
                                </FormFeedback>
                                <FormFeedback>
                                    Uh oh! Looks like there is an issue with
                                    your email. Please input a correct email.
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                {error && (
                                    <Alert className="mt-2" color="danger">
                                        {error.message}
                                    </Alert>
                                )}
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col
                        lg={{ size: 8, offset: 2 }}
                        md={{ size: 8, offset: 2 }}
                    >
                        <Table striped>
                            <thead>
                                <th>email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Exam Code</th>
                                <th>Status</th>
                            </thead>
                            <tbody>{this.renderCandidates()}</tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.RECRUITER);

export default compose(
    withAuthorization(condition),
    withFirebase
)(RecruiterPage);

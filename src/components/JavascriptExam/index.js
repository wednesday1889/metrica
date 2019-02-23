import React, { Component } from "react";
import { compose } from "recompose";

import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    CardBody,
    Label,
    Input,
    FormGroup
} from "reactstrap";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    mcquestions: [
        {
            uid: "1",
            index: 1,
            questionText: "What is life?",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            duration: 180
        },
        {
            uid: "2",
            index: 2,
            questionText: "What is zero?",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            duration: 180
        }
    ],
    progchallenges: [
        {
            uid: "3",
            index: 3,
            challenge: "question11",
            answer: ""
        },
        {
            uid: "4",
            index: 4,
            challenge: "question21",
            answer: ""
        }
    ],
    currentQuestionIndex: 1
};

class JavascriptExamPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE
            // loading: true
        };
    }

    componentDidMount() {
        /*
        const { firebase } = this.props;

        this.setState({ loading: true });
        this.unsubscribe = firebase
            .user(firebase.auth.currentUser.uid)
            .onSnapshot(snapshot => {
                const user = snapshot.data();
                this.setState({
                    ...user,
                    loading: false
                });
            });
            */
    }

    componentWillUnmount() {
        // this.unsubscribe();
    }

    onUpdateItem = (i, value) => {
        this.setState(state => {
            const mcquestions = state.mcquestions.map((item, j) => {
                if (j === i) {
                    const updatedItem = Object.assign({}, item);
                    updatedItem.answer = value;
                    return updatedItem;
                }
                return item;
            });
            return {
                mcquestions
            };
        });
    };

    submitAnswer() {
        this.setState(prevState => ({
            currentQuestionIndex: prevState.currentQuestionIndex + 1
        }));
    }

    renderMCQuestions() {
        const { mcquestions, currentQuestionIndex } = this.state;
        const cardsOfQuestions = mcquestions.map((question, index) => {
            const { uid, options } = question;
            const radioButtons = [1, 2, 3, 4, 5].map(option => {
                const optionStrId = `${uid}-option${option}`;
                const radioGroupId = `radio-group-${uid}`;
                return (
                    <div>
                        <Input
                            type="radio"
                            name={radioGroupId}
                            value={option}
                            id={optionStrId}
                            onChange={() =>
                                this.onUpdateItem(index, options[option - 1])
                            }
                        />
                        <Label for={optionStrId}>{options[option - 1]}</Label>
                    </div>
                );
            });

            return (
                <Card
                    className={
                        question.index === currentQuestionIndex
                            ? "show"
                            : "hide"
                    }
                >
                    <CardHeader>Question #{question.index}</CardHeader>
                    <CardBody>
                        <Card>
                            <CardBody>This is a question</CardBody>
                        </Card>
                        <FormGroup className="ml-4 mt-4">
                            {radioButtons}
                        </FormGroup>
                        <Label>Your answer is: {question.answer}</Label>
                    </CardBody>
                </Card>
            );
        });
        return cardsOfQuestions;
    }

    render() {
        /* const {
            mcquestions,
            progchallenges,
            currentQuestionIndex
        } = this.state;
        */
        return (
            <Container>
                <Row>
                    <Col lg={{ size: 8, offset: 2 }}>
                        {this.renderMCQuestions()}

                        <Button
                            className="mt-4"
                            block
                            onClick={() => this.submitAnswer()}
                        >
                            Submit Answer
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const condition = authUser => !!authUser && authUser.profileDone;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(JavascriptExamPage);

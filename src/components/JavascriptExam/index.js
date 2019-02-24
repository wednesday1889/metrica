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
    CardTitle,
    Label,
    Input,
    FormGroup
} from "reactstrap";

import CodeMirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";

import Countdown from "react-countdown-now";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    mcquestions: [
        {
            uid: "1",
            qindex: 1,
            questionText: "What is life?",
            codeSnippet:
                "function f() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 30
        },
        {
            uid: "2",
            qindex: 2,
            questionText: "What is zero?",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 90
        }
    ],
    progchallenges: [
        {
            uid: "3",
            qindex: 3,
            challengeText: "question11",
            answer: "",
            answerTemplate: "",
            tsStarted: "",
            tsAnswered: ""
        },
        {
            uid: "4",
            qindex: 4,
            challengeText: "question21",
            answer: "",
            answerTemplate: "",
            tsStarted: "",
            tsAnswered: ""
        }
    ],
    currentQuestionIndex: 1,
    currentTimeLeft: null
};
const countdownRenderer = ({ minutes, seconds }) => {
    // Render a countdown
    return (
        <strong>
            <span className={minutes <= 1 ? "text-danger" : "text-success"}>
                {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
            </span>
        </strong>
    );
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
        const { currentQuestionIndex } = this.state;
        if (currentQuestionIndex === 1) {
            this.setState(state => {
                const mcquestions = state.mcquestions.map(item => {
                    const condition = currItem =>
                        currItem.qindex === currentQuestionIndex &&
                        !currItem.tsStarted;

                    if (condition(item)) {
                        const updatedItem = Object.assign({}, item);
                        updatedItem.tsStarted = new Date();
                        return updatedItem;
                    }
                    return item;
                });
                return {
                    mcquestions
                };
            });
        }
    }

    componentWillUnmount() {
        // this.unsubscribe();
    }

    onUpdateChoice = (i, value) => {
        const { currentQuestionIndex } = this.state;
        const condition = item => item.qindex === currentQuestionIndex;
        this.updateFieldsInOption(condition, {
            answer: value,
            tsAnswered: new Date()
        });

        this.setState({
            currentQuestionAnswered: true
        });
    };

    updateFieldsInOption(conditionFunc, newItem) {
        this.setState(state => {
            const mcquestions = state.mcquestions.map(item => {
                if (conditionFunc(item)) {
                    const itemToBeUpdated = Object.assign({}, item);
                    Object.keys(newItem).forEach(key => {
                        itemToBeUpdated[key] = newItem[key];
                    });
                    return itemToBeUpdated;
                }
                return item;
            });
            return {
                mcquestions
            };
        });
    }

    submitAnswer() {
        const { currentQuestionIndex } = this.state;
        const condition = item => item.qindex === currentQuestionIndex;

        this.updateFieldsInOption(condition, {
            tsAnswered: new Date()
        });
        this.setState(prevState => ({
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            currentQuestionAnswered: false
        }));
        if (currentQuestionIndex + 1 < 10) {
            const conditionForNext = item =>
                item.qindex === currentQuestionIndex + 1;
            this.updateFieldsInOption(conditionForNext, {
                tsStarted: new Date()
            });
        }
    }

    renderMCQuestions() {
        const { mcquestions, currentQuestionIndex } = this.state;
        const cardsOfQuestions = mcquestions.map((question, index) => {
            const {
                uid,
                options,
                qindex,
                codeSnippet,
                tsStarted,
                duration
            } = question;
            const radioButtons = ["A", "B", "C", "D", "E"].map(
                (option, optIndex) => {
                    const optionStrId = `${uid}-option${option}`;
                    const radioGroupId = `radio-group-${uid}`;
                    return (
                        <div key={optionStrId}>
                            <Input
                                type="radio"
                                name={radioGroupId}
                                value={option}
                                id={optionStrId}
                                onChange={() =>
                                    this.onUpdateChoice(
                                        index,
                                        options[optIndex]
                                    )
                                }
                            />
                            <Label for={optionStrId}>{options[optIndex]}</Label>
                        </div>
                    );
                }
            );

            return (
                <Card
                    className={
                        qindex === currentQuestionIndex ? "show" : "hide"
                    }
                    key={qindex}
                >
                    <CardHeader>
                        Question #{qindex}
                        <div className="float-right">
                            {tsStarted && (
                                <Countdown
                                    date={
                                        new Date(
                                            tsStarted.getTime() +
                                                duration * 1000
                                        )
                                    }
                                    renderer={countdownRenderer}
                                    onComplete={() => this.submitAnswer()}
                                />
                            )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Card>
                            <CardTitle className="ml-3 mt-2">
                                This is a question
                            </CardTitle>
                            {codeSnippet && (
                                <CardBody>
                                    <CodeMirror
                                        value={codeSnippet}
                                        options={{
                                            lineNumbers: false,
                                            mode: "javascript",
                                            readOnly: "nocursor"
                                        }}
                                    />
                                </CardBody>
                            )}
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

    renderProgChallenges() {
        const { progchallenges, currentQuestionIndex } = this.state;
        const cardsOfChallenges = progchallenges.map(question => {
            const { qindex, challengeText, answerTemplate } = question;

            return (
                <Card
                    className={
                        qindex === currentQuestionIndex ? "show" : "hide"
                    }
                    key={qindex}
                >
                    <CardHeader>Question #{qindex} </CardHeader>
                    <CardBody>
                        <Card>
                            <CardBody>{challengeText}</CardBody>
                        </Card>
                        <FormGroup className="ml-4 mt-4" />
                        <Label>Your answer is: {answerTemplate}</Label>
                    </CardBody>
                </Card>
            );
        });
        return cardsOfChallenges;
    }

    render() {
        const { currentQuestionAnswered } = this.state;
        return (
            <Container>
                <Row>
                    <Col lg={{ size: 8, offset: 2 }}>
                        {this.renderMCQuestions()}
                        {this.renderProgChallenges()}
                        <Button
                            className="mt-4"
                            block
                            onClick={() => this.submitAnswer()}
                            disabled={!currentQuestionAnswered}
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

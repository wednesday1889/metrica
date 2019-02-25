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
    CardText,
    CardTitle,
    Label,
    Input,
    FormGroup
} from "reactstrap";

import CodeMirror from "codemirror";

import "codemirror/addon/runmode/runmode";
import "codemirror/mode/meta";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/display/autorefresh";
import Highlighter from "react-codemirror-runmode";

import { Controlled as CodeMirror2 } from "react-codemirror2";

import Countdown from "react-countdown-now";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    questions: [
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
            duration: 10,
            type: "mcq"
        },
        {
            uid: "2",
            qindex: 2,
            questionText: "What is zero?",
            codeSnippet:
                "function f2() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 20,
            type: "mcq"
        },
        {
            uid: "3",
            qindex: 3,
            questionText: "What is zero?",
            codeSnippet:
                "function f2() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 20,
            type: "mcq"
        },
        {
            uid: "4",
            qindex: 4,
            questionText: "What is zero?",
            codeSnippet:
                "function f2() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 20,
            type: "mcq"
        },
        {
            uid: "5",
            qindex: 5,
            questionText: "What is zero?",
            codeSnippet:
                "function f2() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            options: ["option1", "option2", "option3", "option4", "option5"],
            answer: "",
            tsStarted: "",
            tsAnswered: "",
            duration: 20,
            type: "mcq"
        },
        {
            uid: "6",
            qindex: 6,
            questionText: "question11",
            answer:
                "function f3() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            answerTemplate:
                "function f() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            tsStarted: "",
            tsAnswered: "",
            duration: 180,
            type: "challenge"
        },
        {
            uid: "7",
            qindex: 7,
            questionText: "question21",
            answer:
                "function f4() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            answerTemplate:
                "function f() { \n\tvar x = 2;\n} \nconsole.log(x); // Uncaught ReferenceError: x is not defined",
            tsStarted: "",
            tsAnswered: "",
            duration: 20,
            type: "challenge"
        }
    ],
    currentQuestionIndex: 1,
    examStarted: false,
    examDone: false
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
                const questions = state.questions.map(item => {
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
                    questions
                };
            });
        }
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        // this.unsubscribe();
    }

    onUpdateAnswer = value => {
        const { currentQuestionIndex } = this.state;
        const condition = item => item.qindex === currentQuestionIndex;
        this.updateDeepState(condition, {
            answer: value,
            tsAnswered: new Date()
        });

        this.setState({
            currentQuestionAnswered: true
        });
    };

    updateDeepState(conditionFunc, newItem) {
        this.setState(state => {
            const questions = state.questions.map(item => {
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
                questions
            };
        });
    }

    submitAnswer(index) {
        const { currentQuestionIndex, questions } = this.state;

        // can't stop the countdown callback without doing weird stuff, so here's a workaround
        if (index && index !== currentQuestionIndex) return;

        const condition = item => item.qindex === currentQuestionIndex;

        this.updateDeepState(condition, {
            tsAnswered: new Date()
        });
        this.setState(prevState => ({
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            currentQuestionAnswered: false
        }));
        if (currentQuestionIndex + 1 <= questions.length) {
            const conditionForNext = item =>
                item.qindex === currentQuestionIndex + 1;
            this.updateDeepState(conditionForNext, {
                tsStarted: new Date()
            });
        } else {
            this.setState({ examDone: true });
        }
    }

    renderRadioButtons(uid, index, options) {
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
                                this.onUpdateAnswer(options[optIndex])
                            }
                        />
                        <Label for={optionStrId}>{options[optIndex]}</Label>
                    </div>
                );
            }
        );
        return radioButtons;
    }

    renderQuestions() {
        const { questions, currentQuestionIndex } = this.state;
        const cardsOfQuestions = questions.map((question, index) => {
            const {
                uid,
                options,
                qindex,
                codeSnippet,
                tsStarted,
                duration,
                type,
                questionText,
                answer
            } = question;

            const radioButtons =
                type === "mcq"
                    ? this.renderRadioButtons(uid, index, options)
                    : null;

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
                                    onComplete={() => this.submitAnswer(qindex)}
                                />
                            )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Card>
                            <CardTitle className="ml-3 mt-2">
                                {questionText}
                            </CardTitle>
                            {codeSnippet && (
                                <CardBody>
                                    <Highlighter
                                        id={uid}
                                        theme="default"
                                        value={codeSnippet}
                                        language="javascript"
                                        codeMirror={CodeMirror}
                                    />
                                </CardBody>
                            )}
                        </Card>
                        {type === "mcq" && (
                            <div>
                                <FormGroup className="ml-4 mt-4">
                                    {radioButtons}
                                </FormGroup>
                                <Label>Your answer is: {question.answer}</Label>
                            </div>
                        )}
                        {type === "challenge" && (
                            <CodeMirror2
                                className="border border-info mt-1"
                                value={answer}
                                options={{
                                    mode: "javascript",
                                    theme: "default",
                                    lineNumbers: true,
                                    autoRefresh: true
                                }}
                                onBeforeChange={(editor, data, value) => {
                                    this.onUpdateAnswer(value);
                                }}
                                onChange={(editor, data, value) => {
                                    this.onUpdateAnswer(value);
                                }}
                                onPaste={(editor, event) => {
                                    event.preventDefault();
                                }}
                            />
                        )}
                    </CardBody>
                </Card>
            );
        });
        return cardsOfQuestions;
    }

    render() {
        const { currentQuestionAnswered, examDone, examStarted } = this.state;
        return (
            <Container>
                <Row>
                    {!examStarted && (
                        <Col lg={{ size: 6, offset: 3 }}>
                            <Card>
                                <CardHeader
                                    className="text-white bg-warning"
                                    inverse
                                >
                                    <strong>
                                        Exam Guidelines - Please read ME!
                                    </strong>
                                </CardHeader>
                                <CardText className="pl-4 pt-2 pb-2 pr-4">
                                    The duration for this exam is around 30
                                    minutes.
                                    <br />
                                    <br />
                                    Each question is timed, once the timer is up
                                    you will be moved to the next question with
                                    the current question being set to
                                    unanswered. You can&apos;t go back to a
                                    previous question.
                                    <br />
                                    <br />
                                    This exam contains multiple choice questions
                                    and programming challenges
                                    <br />
                                    <br />
                                    Please make sure you have a stable internet
                                    connection while taking this assessment.
                                    <br />
                                    <br />
                                    <i>
                                        <strong>
                                            For the programming challenges,
                                            don&apos;t worry too much on syntax.
                                            We just want to see your basic
                                            programming knowledge and problem
                                            solving skills
                                        </strong>
                                    </i>
                                </CardText>
                            </Card>
                            <Button
                                className="mt-4 bg-primary"
                                block
                                onClick={() =>
                                    this.setState({ examStarted: true })
                                }
                            >
                                I am READY!
                            </Button>
                        </Col>
                    )}
                    {examStarted && !examDone && (
                        <Col lg={{ size: 8, offset: 2 }}>
                            {this.renderQuestions()}
                            <Button
                                className="mt-4 bg-primary"
                                block
                                onClick={() => this.submitAnswer()}
                                disabled={!currentQuestionAnswered}
                            >
                                Submit Answer
                            </Button>
                        </Col>
                    )}
                    {examStarted && examDone && (
                        <Col lg={{ size: 4, offset: 4 }}>
                            <Card color="success" inverse>
                                <CardHeader>
                                    Your have completed the Online Assessment!
                                </CardHeader>
                                <CardText className="pl-4 pt-2 pb-2 pr-4">
                                    Congratulations on completing the exam!
                                    <br />
                                    We will be assessing your exam answers and
                                    our recruiter will contact you soon. <br />
                                    <br />
                                    Thank you!
                                </CardText>
                            </Card>
                        </Col>
                    )}
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

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
    FormGroup,
    Alert
} from "reactstrap";

import CodeMirror from "codemirror";
import { js_beautify as jsBeautify } from "js-beautify";

import "codemirror/addon/runmode/runmode";
import "codemirror/mode/meta";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/display/autorefresh";
import Highlighter from "react-codemirror-runmode";

import { Controlled as CodeMirror2 } from "react-codemirror2";

import Countdown from "react-countdown-now";

import { GrowingSpinner } from "../CenteredSpinner";
import ExamCompleteCard from "./examCompleteCard";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    questions: [],
    currentQuestionIndex: -1,
    examStarted: false,
    examDone: false,
    languageTaken: "js",
    loading: false,
    isError: "",
    currentQuestionAnswered: false
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

const beautify = str => {
    // const cleanedCommentsStr = str.replace(/\*\//g, "*/\n");
    const options = {
        indent_size: "4",
        indent_char: " ",
        max_preserve_newlines: "5",
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: "normal",
        brace_style: "collapse",
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: "0",
        indent_inner_html: false,
        comma_first: false,
        e4x: false
    };

    return jsBeautify(
        str.replace(/\*\//g, "*/\n").replace(/\/\*/g, "\n/*"),
        options
    );
};

const updateQuestions = (questions, conditionFunc, newItem) => {
    const questionsUpdated = questions.map(item => {
        if (conditionFunc(item)) {
            const itemToBeUpdated = Object.assign({}, item);
            Object.keys(newItem).forEach(key => {
                itemToBeUpdated[key] = newItem[key];
            });
            return itemToBeUpdated;
        }
        return item;
    });

    return questionsUpdated;
};

const JavascriptExamPage = props => (
    <AuthUserContext.Consumer>
        {authUser => (
            <JavascriptComponent
                authUser={authUser}
                firebase={props.firebase}
                history={props.history}
            />
        )}
    </AuthUserContext.Consumer>
);

class JavascriptComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    onUpdateAnswer = value => {
        const { currentQuestionIndex, questions } = this.state;
        const condition = item => item.qindex === currentQuestionIndex;
        const updatedQuestions = updateQuestions(questions, condition, {
            answer: value,
            tsAnswered: this.getCurrentDateInTimestamp()
        });

        this.setState({
            questions: updatedQuestions,
            currentQuestionAnswered: true
        });
    };

    getCurrentDateInTimestamp() {
        const { firebase } = this.props;
        return firebase.Timestamp.fromDate(new Date());
    }

    generateExam() {
        const { authUser } = this.props;
        const { email, examCode } = authUser;

        const { firebase } = this.props;

        const generateExamFunc = firebase.generateExam();

        this.setState({ loading: true });

        firebase
            .exam(email)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    this.startListeningToFirebaseExam();
                } else {
                    generateExamFunc({
                        email,
                        examCode,
                        language: "js"
                    })
                        .then(() => {
                            this.setState({ loading: false });
                            this.startListeningToFirebaseExam();
                        })
                        .catch(error => {
                            this.setState({
                                isError: error.message,
                                loading: false
                            });
                        });
                }
            });
    }

    startListeningToFirebaseExam() {
        const { firebase, authUser } = this.props;
        const { email } = authUser;

        this.setState({ loading: true });
        firebase
            .exam(email)
            .get()
            .then(snapshot => {
                const exam = snapshot.data();

                const beautifiedQuestions = exam.questions.map(question => {
                    const newQuestion = Object.assign({}, question);
                    if (newQuestion.type === "mcq") {
                        newQuestion.codeSnippet = beautify(
                            newQuestion.codeSnippet
                        );
                    } else {
                        newQuestion.answer = beautify(newQuestion.answer);
                    }
                    return newQuestion;
                });

                exam.questions = beautifiedQuestions;
                this.initialized = true;
                this.setState({
                    ...exam,
                    loading: false
                });

                this.startExam();
            });
    }

    startExam() {
        const { currentQuestionIndex, questions } = this.state;

        const { tsStarted, duration } = questions[currentQuestionIndex - 1];
        let isTimedout = false;
        // debugger;
        if (tsStarted && duration) {
            const dateStarted = tsStarted.toDate();
            const dateNow = new Date();
            const timeLapsed = dateNow.getTime() - dateStarted.getTime();
            isTimedout = timeLapsed / 1000 >= duration;
        }

        if (questions[currentQuestionIndex - 1].tsStarted === "") {
            const condition = currItem =>
                currItem.qindex === currentQuestionIndex && !currItem.tsStarted;

            const updatedQuestions = updateQuestions(questions, condition, {
                tsStarted: this.getCurrentDateInTimestamp()
            });

            this.setState(
                {
                    examStarted: true,
                    questions: updatedQuestions
                },
                this.updateFirebase
            );
        } else if (currentQuestionIndex + 1 <= questions.length && isTimedout) {
            const conditionForNext = item =>
                item.qindex === currentQuestionIndex + 1;
            const updatedQuestions = updateQuestions(
                questions,
                conditionForNext,
                {
                    tsStarted: this.getCurrentDateInTimestamp()
                }
            );
            const conditionForPrev = item =>
                item.qindex === currentQuestionIndex;
            const updatedQuestionsForPrev = updateQuestions(
                updatedQuestions,
                conditionForPrev,
                {
                    tsAnswered: this.getCurrentDateInTimestamp()
                }
            );

            this.setState(
                prevState => ({
                    examStarted: true,
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    questions: updatedQuestionsForPrev
                }),
                this.updateFirebase
            );
        } else if (isTimedout) {
            this.setState({ examDone: true });
        }
    }

    updateFirebase() {
        const { firebase } = this.props;
        const { authUser } = this.props;
        const { email } = authUser;

        const {
            currentQuestionIndex,
            questions,
            examStarted,
            examDone,
            languageTaken
        } = this.state;

        firebase
            .exam(email)
            .update({
                questions,
                currentQuestionIndex,
                examStarted,
                examDone,
                languageTaken
            })
            .then(() => {
                if (currentQuestionIndex + 1 <= questions.length) {
                    const conditionForNext = item =>
                        item.qindex === currentQuestionIndex + 1;
                    const updatedQuestions = updateQuestions(
                        questions,
                        conditionForNext,
                        {
                            tsStarted: this.getCurrentDateInTimestamp()
                        }
                    );
                    this.setState({ questions: updatedQuestions });
                } else {
                    // this.setState({ examDone: true });
                }
            });
    }

    submitAnswer(index) {
        const { currentQuestionIndex, questions } = this.state;
        // can't stop the countdown callback without doing weird stuff, so here's a workaround
        if (index && index !== currentQuestionIndex) return;

        const indexToUse = index || currentQuestionIndex;

        const condition = item => item.qindex === indexToUse;

        const updatedQuestions = updateQuestions(questions, condition, {
            tsAnswered: this.getCurrentDateInTimestamp()
        });

        const conditionNextQuestion = item =>
            item.qindex === currentQuestionIndex + 1;

        const updatedQuestionsForNext = updateQuestions(
            updatedQuestions,
            conditionNextQuestion,
            {
                tsStarted: this.getCurrentDateInTimestamp()
            }
        );

        if (currentQuestionIndex === 10) {
            this.setState(
                {
                    currentQuestionIndex: 10,
                    examDone: true,
                    questions: updatedQuestionsForNext
                },
                this.updateFirebase
            );
        } else {
            this.setState(
                prevState => ({
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    questions: updatedQuestionsForNext,
                    currentQuestionAnswered: false
                }),
                this.updateFirebase
            );
        }
    }

    renderRadioButtons(qindex, index, options) {
        const radioButtons = ["A", "B", "C", "D", "E"].map(
            (option, optIndex) => {
                const optionStrId = `${qindex}-option${option}`;
                const radioGroupId = `radio-group-${qindex}`;
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

                        <Label className="text-monospace" for={optionStrId}>
                            {options[optIndex]}
                        </Label>
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
                options,
                qindex,
                codeSnippet,
                tsStarted,
                duration,
                type,
                questionText,
                answer
            } = question;
            // const formattedAnswer = jsBeautify(answer);

            const radioButtons =
                type === "mcq"
                    ? this.renderRadioButtons(qindex, index, options)
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
                                            tsStarted.toDate().getTime() +
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
                                        id={`highlighter${qindex}`}
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
                                <Label className="text-monospace">
                                    Your answer is: {question.answer}
                                </Label>
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
        const {
            currentQuestionAnswered,
            examDone,
            examStarted,
            loading,
            isError
        } = this.state;

        return (
            <Container>
                <Row>
                    {loading && (
                        <Col lg={{ size: 6, offset: 3 }}>
                            <GrowingSpinner />
                        </Col>
                    )}
                    {!loading && !examStarted && (
                        <Col lg={{ size: 6, offset: 3 }}>
                            <Card>
                                <CardHeader className="text-white bg-warning">
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
                                onClick={() => this.generateExam()}
                            >
                                I am READY!
                            </Button>
                            {isError && (
                                <Alert className="mt-2" color="danger">
                                    {isError}
                                </Alert>
                            )}
                        </Col>
                    )}
                    {!loading && examStarted && !examDone && (
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
                    {!loading && examStarted && examDone && (
                        <ExamCompleteCard />
                    )}
                </Row>
            </Container>
        );
    }
}

const condition = authUser => !!authUser && authUser.screeningStatus === 2;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(JavascriptExamPage);

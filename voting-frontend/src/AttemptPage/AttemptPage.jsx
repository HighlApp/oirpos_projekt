import React from 'react';
import {authHeader} from "../_helpers";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";

export default class AttemptPage extends React.Component {
    apiUrl = "http://localhost:4000";
    qCounter = 0;
    token = null;
    questionId = null;


    constructor(props) {
        super(props);

        this.state = {
            showSnackbar: false,
            snackbarText: null,
            error: null,
            voting: {
                title: '',
                questions: {},
            },
            answer: "",
            result: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.voting !== nextState.voting
            || this.state.error !== nextState.error
            || this.state.showSnackbar !== nextState.showSnackbar
            || this.state.snackbarText !== nextState.snackbarText
            || this.state.result !== nextState.result
        ) {
            return true;
        } else return this.state.answer !== nextState.answer;
    }

    getVotingQuestion(token) {
        this.token = token;
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${this.apiUrl}/voting/${token}`, requestOptions).then(this.handleResponse);
    }

    componentDidMount() {
        const path = this.props.history.location.pathname;
        const token = path.slice(path.lastIndexOf('/') + 1);
        this.getVotingQuestion(token)
            .then(r => {
                if (r.title === undefined) { //means that response is results of voting
                    this.setState({
                        result: this.transformVoting(r),
                        showSnackbar: true,
                        snackbarText: "Pobrano wyniki ankiety!"
                    })
                } else {
                    this.setState({ //means that response question to answer
                        voting: r,
                        showSnackbar: true,
                        snackbarText: "Pomyślnie pobrano pytanie!"
                    });
                    this.questionId = r.question.id;
                }
            })
            .catch(e => this.setState({showSnackbar: true, error: e}));
    }


    saveAnswer(answer) {
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
            body: JSON.stringify(answer.value),
        };

        const buildUrl = `${this.apiUrl}/voting/answer/${answer.uuid}/${answer.id}`;
        console.log(buildUrl);
        return fetch(buildUrl, requestOptions).then(this.handleResponse);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.saveAnswer({
            value: this.state.answer + "",
            uuid: this.token,
            id: this.questionId
        })
            .then(r => this.setState({showSnackbar: true, error: null, snackbarText: 'Pomyślnie zapisano odpowiedź!'}))
            .catch(e => this.setState({showSnackbar: true, error: e}))
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({showSnackbar: false});
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.qCounter = 0;
    }

    handleRadioChange = (val) => {
        this.setState({answer: val});
    };

    onKeyPress(event) {
        const parsed = parseInt(event.target.value);
        let newVal = undefined;
        if (isNaN(parsed)) {
            newVal = '';
        } else {
            newVal = parsed;
        }

        this.setState(this.setState({answer: newVal}));
    }

    transformVoting(voting) {
        let modifiedQuestions = [];
        voting.questions.forEach(question => {
            const answers = question.answers;
            let modifiedAnswers = {};
            for (var i = 0; i < answers.length; ++i) {
                if (!modifiedAnswers[answers[i].value])
                    modifiedAnswers[answers[i].value] = 0;
                ++modifiedAnswers[answers[i].value];
            }
            const modifiedQuestion = {
                ...question,
                answers: modifiedAnswers
            }
            modifiedQuestions.push(modifiedQuestion);
        });
        voting.questions = modifiedQuestions;
        return voting;
    }


    render() {
        const renderTypedComponent = (type, variants) => {
            switch (type) {
                case 'bool':
                    return (
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="quiz" name="quiz"
                                        value={this.state.answer}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            this.handleRadioChange(val);
                                        }}
                            >
                                <FormControlLabel value="TAK" control={<Radio/>} label="Tak"/>
                                <FormControlLabel value="NIE" control={<Radio/>} label="Nie"/>
                            </RadioGroup>
                        </FormControl>
                    );
                case 'num':
                    return (
                        <FormControl>
                            <input type="number" onKeyPress={e => this.onKeyPress(e)}
                                   onChange={e => this.onKeyPress(e)}
                            />
                        </FormControl>
                    );
                case 'many':
                    return (
                        <FormControl variant="outlined">
                            <InputLabel id="selectLabel">Odpowiedź</InputLabel>
                            <Select
                                labelId="selectLabel"
                                style={{width: '15rem'}}
                                value={this.state.answer}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    this.handleRadioChange(val);
                                }}>
                                {variants.split(';').map(variant => {
                                    return (<MenuItem value={variant}>{variant}</MenuItem>);
                                })}
                            </Select>
                        </FormControl>
                    );
            }
        };

        return (
            <>
                {this.state.voting.title !== ""
                    ?
                    <div style={{
                        width: '35rem',
                        backgroundColor: "whitesmoke",
                        padding: "1rem",
                        border: "0.3rem solid #3f51b5",
                        borderRadius: "0.5rem",
                        margin: '0 auto'
                    }}>
                        <form onSubmit={this.handleSubmit}
                              style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                              }}
                        >
                            <Typography variant="h4">{this.state.voting.title}</Typography>
                            {(this.state.voting && this.state.voting.title) && [this.state.voting.question].map((question, idq) => {
                                return (
                                    <>
                                        <Typography variant="h6">{question.name}</Typography>
                                        {renderTypedComponent(question.type, question.additionalData)}
                                    </>
                                );
                            })}
                            <Button type="submit" style={{}} color="primary" variant="contained">Zapisz
                                odpowiedź</Button>
                        </form>
                    </div>
                    : null}
                {this.state.result !== null
                    ?
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            width: '35rem',
                            backgroundColor: "whitesmoke",
                            padding: "1rem",
                            border: "0.3rem solid #3f51b5",
                            borderRadius: "0.5rem",
                            margin: '0 auto'

                        }}>
                        <Typography variant="h5">Wyniki ankiety: "{this.state.result.name}"</Typography>
                        {this.state.result.questions.map((q, idx) => {
                            return (
                                <>
                                    <Typography variant="h3">{idx + 1}. {q.name}</Typography>
                                    <Typography>Odpowiedzi</Typography>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}>
                                        {Object.keys(q.answers).map((key) => {
                                            return (
                                                <>
                                                    <div><strong>{key}: </strong>{q.answers[key]} głosów</div>
                                                </>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    :
                    null
                }
                <Snackbar open={this.state.showSnackbar} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity={this.state.error === null ? "success" : "error"}>
                        {this.state.error === null
                            ? this.state.snackbarText
                            : this.state.error
                        }
                    </Alert>
                </Snackbar>
            </>
        );
    }
}


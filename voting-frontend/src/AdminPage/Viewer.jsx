import React from 'react';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {authHeader} from "../_helpers";
import Button from '@material-ui/core/Button';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

export default class Viewer extends React.Component {
    apiUrl = "http://localhost:4000";

    state = {
        showSnackbar: false,
        snackbarText: null,
        error: null,
        votings: [],
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

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({showSnackbar: false});
    };

    getVotings() {
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${this.apiUrl}/voting`, requestOptions).then(this.handleResponse);
    }

    generateLink(id) {
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${this.apiUrl}/voting/link/${id}`, requestOptions).then(this.handleResponse)
            .then(r => this.setState({
                showSnackbar: true,
                snackbarText: "Wygenerowano link: " + window.location.href + 'attempt/' + r.uuid,
            }))
            .catch(e => this.setState({showSnackbar: true, error: e}));
    }

    componentDidMount() {
        this.getVotings()
            .then(r => this.setState({votings: this.transformVotings(r)}))
            .catch(e => console.log(e));
    }

    transformVotings(votings) {
        votings.forEach(voting => {
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
        });
        console.log(votings);
        return votings;
    }

    activateQuestion(qId, vId) {
        const requestOptions = {
            method: 'GET',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${this.apiUrl}/voting/${vId}/question/${qId}/activate/`, requestOptions).then(this.handleResponse)
            .then(r => this.setState({
                showSnackbar: true,
                snackbarText: "Uaktywniono pytanie!",
            }))
            .catch(e => this.setState({showSnackbar: true, error: e}));
    }

    render() {
        // let markActiveQuestion = (this.state.votings && this.state.votings.questions.filter(q => !q.active)[0].id);

        return (
            <div>
                {this.state.votings.map(v => {
                    return (
                        <Accordion style={{width: '100%', backgroundColor: '#3f51b51a'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>{v.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Button style={{marginBottom: '2rem'}} color="primary" variant="contained" onClick={() => this.generateLink(v.id)}>Generuj link</Button>
                                <Typography variant="subtitle2">Pytania:</Typography>
                                {v.questions.map((q, idx) => {
                                    return (
                                        <>
                                            <Typography variant="subtitle1">{idx + 1}. {q.name}</Typography>
                                            {v.questions.filter(q => !q.active).length !== 0 && v.questions.filter(q => !q.active)[0].id === q.id
                                            ?
                                                <Button style={{}} color="primary"
                                                        variant="contained" onClick={() => this.activateQuestion(q.id, v.id)}>Aktywuj</Button>
                                            :
                                                null
                                            }
                                            {q.additionalData
                                                ? (q.additionalData.substring(0, q.additionalData.length - 1)).split(';').map((variant, idv) => {
                                                    return (
                                                        <>
                                                            <Typography style={{marginLeft: '1rem'}}
                                                                    variant="caption">{idv + 1}. {variant}</Typography>
                                                        </>
                                                    );
                                                })
                                                : null
                                            }
                                            <Accordion style={{width: '100%', backgroundColor: '#3f51b51a'}}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                                    <Typography>Odpowiedzi</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                                    {Object.keys(q.answers).map((key) => {
                                                        return (
                                                            <>
                                                                <div><strong>{key}: </strong>{q.answers[key]}</div>
                                                            </>
                                                        );
                                                    })}
                                                </AccordionDetails>
                                            </Accordion>
                                        </>
                                    );
                                })}

                            </AccordionDetails>
                        </Accordion>
                    );
                })}
                <Snackbar open={this.state.showSnackbar} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity={this.state.error === null ? "success" : "error"}>
                        {this.state.error === null
                            ? this.state.snackbarText
                            : this.state.error
                        }
                    </Alert>
                </Snackbar>
            </div>


        );
    }
}


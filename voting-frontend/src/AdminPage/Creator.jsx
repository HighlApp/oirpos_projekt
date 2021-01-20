import React from 'react';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import produce from "immer"
import VerticalGroup from "../_components/VerticalGroup";
import Button from "@material-ui/core/Button";
import {authHeader} from "../_helpers";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import AccordionDetails from "@material-ui/core/AccordionDetails";


class Creator extends React.Component {
    apiUrl = "http://localhost:4000";

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            questions: [],
            showSnackbar: false,
            error: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createVoting(voting) {
        const requestOptions = {
            method: 'POST',
            headers: {...authHeader(), 'Content-Type': 'application/json'},
            body: JSON.stringify(voting),

        };

        return fetch(`${this.apiUrl}/voting/create`, requestOptions).then(this.handleResponse);
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

    handleSubmit(event) {
        event.preventDefault();

        let questions = [...this.state.questions];
        questions = questions.map(q => {
            return {
                name: q.name,
                type: q.type,
                additionalData: (q.variants ? q.variants.reduce(function (strBuild, element) {
                    return strBuild + element.value + ';';
                }, '') : undefined),
            }
        });

        this.createVoting({
            name: this.state.name,
            questions: questions,
        })
            .then(r => this.setState({showSnackbar: true, error: null}))
            .catch(e => this.setState({showSnackbar: true, error: e}))
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({showSnackbar: false});
    };

    addQuestion = (option) => {
        var newItem = {
            name: "",
            type: option
        }

        if (option === 'many') {
            newItem.variants = [{id: new Date(), value: ""}]
        }

        this.setState(produce(draft => {
            draft.questions.push(newItem);
        }));
    }

    addVariant = (itemIdx) => {
        this.setState(produce(draft => {
            draft.questions[itemIdx].variants.push({id: new Date(), value: ""});
        }));
    }

    itemQuestionChangeHandler = (event, idx) => {
        var value = event.target.value;

        this.setState(produce(draft => {
            draft.questions[idx].name = value;
        }));
    }

    variantChangeHandler = (event, itemIdx, varIdx) => {
        var value = event.target.value;

        this.setState(produce(draft => {
            draft.questions[itemIdx].variants[varIdx].value = value;
        }));
    }

    translateQuestionType = (type) => {
        switch (type) {
            case "bool":
                return "'Tak/Nie'";
            case "many":
                return "'Wiele wyborów'";
            case "num":
                return "'Podanie liczby'";
        }
    }

    render() {
        const votingItems = this.state.questions.map((item, idx) => {
            var additionalFields = null;
            if (item.type === 'many') {
                additionalFields = item.variants.map((variant, varIdx) => {
                    return (
                        <>
                            <TextValidator
                                label={"Treść wariantu nr " + (varIdx + 1)}
                                style={{width: "18rem", marginBottom: "1.5rem"}}
                                onChange={e => this.variantChangeHandler(e, idx, varIdx)}
                                value={variant.value}
                                validators={['required']}
                                errorMessages={['To pole jest wymagane']}
                            />
                        </>
                    )
                })

                additionalFields.push(
                    <Button variant="contained" color="primary" onClick={this.addVariant.bind(this, idx)}>
                        Dodaj kolejny wariant
                    </Button>
                );
            }


            return (
                <div style={{
                    backgroundColor: "whitesmoke",
                    padding: "1rem",
                    margin: "1rem",
                    border: "0.3rem solid #3f51b5",
                    borderRadius: "0.5rem"
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between"
                    }}>
                        <p>Pytanie typu {this.translateQuestionType(item.type)}</p>
                        <div style={{
                            color: "white",
                            alignSelf: "flex-start",
                            height: "25px",
                            width: "25px",
                            backgroundColor: "#bbb",
                            borderRadius: "50%",
                            display: "inline-block",
                            textAlign: "center"
                        }}>
                            {idx + 1}
                        </div>
                    </div>

                    <TextValidator
                        label="Treść pytania"
                        style={{width: "25rem", marginBottom: "1rem"}}
                        onChange={e => this.itemQuestionChangeHandler(e, idx)}
                        value={item.name}
                        validators={['required']}
                        errorMessages={['To pole jest wymagane']}
                    />
                    {additionalFields}
                </div>)
        })

        return (
            <div>
                <ValidatorForm
                    ref="form"
                    style={{
                        width: '100%',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                    // onSubmit={this.handleSubmit}
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                >
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <TextValidator
                            label="Nazwa ankiety"
                            onChange={e => this.setState({name: e.target.value})}
                            style={{width: "25rem", marginBottom: "2rem"}}
                            value={this.state.name}
                            validators={['required']}
                            errorMessages={['To pole jest wymagane']}
                        />

                        {votingItems}

                        <VerticalGroup onSelection={this.addQuestion}/>
                        <Button type="submit" style={{marginLeft: '6.6rem'}} color="secondary" variant="contained">Utwórz ankietę</Button>
                    </div>
                </ValidatorForm>
                <Snackbar open={this.state.showSnackbar} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity={this.state.error === null ? "success" : "error"}>
                        {this.state.error === null
                            ? "Utworzono nową ankietę!"
                            : this.state.error
                        }
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default Creator;
import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function VerticalGroup(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <p>Dodaj pytanie</p>
            <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical outlined primary button group"
                variant="contained"
            >
                <Button onClick={props.onSelection.bind(this, "bool")}>Tak/Nie</Button>
                <Button onClick={props.onSelection.bind(this, "many")}>Wiele wyborów</Button>
                <Button onClick={props.onSelection.bind(this, "num")}>Podanie liczby</Button>
            </ButtonGroup>
        </div>
    );
}
import React from 'react';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Creator from "./Creator";
import Viewer from "./Viewer";

export default class AdminPage extends React.Component {
    state = {
    }

    render() {
        return (
            <div style={{width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h1>Panel Administratora</h1>

                <div style={{width: '80%'}}>
                    <Accordion style={{backgroundColor: '#3f51b51a'}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Stwórz ankietę</Typography>
                        </AccordionSummary>
                        <AccordionDetails >
                            <Creator />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{backgroundColor: '#3f51b51a'}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Przeglądaj ankiety</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Viewer />
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        );
    }
}


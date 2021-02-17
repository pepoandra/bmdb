import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { NotFound } from './components/NotFound'

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Rules} from "./components/Rules";
import {CalendarComponent} from "./components/Calendar";
import {Scores} from "./components/Scores";
import {Suggestions} from "./components/Suggestions";
import Bistro from "./components/Bistro";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);


export default function BasicExample () {
  return (
        <Router>
            <div>
                <Paper>
                    <Tabs
                        value={'value'}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label={'Calendar'} component={Link} to={'/'}/>
                        <Tab label={'Rules'} component={Link} to={'/rules'}/>
                        <Tab label={'Scoreboard'} component={Link} to={'/scores'}/>
                        <Tab label={'Suggestions'} component={Link} to={'/suggestions'}/>
                        <Tab label={'Bistro'} component={Link} to={'/bistro'}/>
                    </Tabs>
                </Paper>
                <hr />
                <Switch>
                    <Route exact path="/">
                        <CalendarComponent />
                    </Route>
                    <Route path="/rules">
                        <Rules  />
                    </Route>
                    <Route path="/scores">
                        <Scores />
                    </Route>
                    <Route path="/suggestions">
                        <Suggestions />
                    </Route>
                    <Route path="/bistro">
                        <Bistro />
                    </Route>
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
  )
}


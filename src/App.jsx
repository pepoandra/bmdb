import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { CalendarComponent } from './components/Calendar'
import { NotFound } from './components/NotFound'
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
                        <Tab label="Calendar" component={Link} to={'/'}/>
                        <Tab label="Movies" component={Link} to={'/movies'}/>
                    </Tabs>
                </Paper>
                <hr />
                <Switch>
                    <Route exact path="/">
                        <CalendarComponent />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
  )
}

function About () {
  return (
        <div>
            <h2>About</h2>
        </div>
  )
}

function Dashboard () {
  return (
        <div>
            <h2>Dashboard</h2>
        </div>
  )
}

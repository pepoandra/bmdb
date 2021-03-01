import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { NotFound } from './components/NotFound'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {CalendarComponent} from "./components/Calendar";
import {Scores} from "./components/Scores";
import {Suggestions} from "./components/Suggestions";
import Bistro from "./components/Bistro";
import {MovieExplorer} from "./components/MovieExplorer";
import {Flowchart} from "./components/Flowchart";


export default function BasicExample () {
    const [value, setValue] = useState(0)
    return (
        <Router>
            <div>
                <Paper>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        onChange={(event, value) => {
                            setValue(value);
                        }}
                    >
                        <Tab label={'Calendar'} component={Link} to={'/'}/>
                        <Tab label={'Movies'} component={Link} to={'/movies'}/>
                        <Tab label={'Scoreboard'} component={Link} to={'/scores'}/>
                        <Tab label={'Suggestions'} component={Link} to={'/suggestions'}/>
                        <Tab label={'Flowchart'} component={Link} to={'/flowchart'}/>
                        <Tab label={'Bistro'} component={Link} to={'/bistro'}/>
                    </Tabs>
                </Paper>
                <hr />
                <Switch>
                    <Route exact path="/">
                        <CalendarComponent />
                    </Route>
                    <Route path="/movies">
                        <MovieExplorer  />
                    </Route>
                    <Route path="/scores">
                        <Scores />
                    </Route>
                    <Route path="/suggestions">
                        <Suggestions />
                    </Route>
                    <Route path="/flowchart">
                        <Flowchart />
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


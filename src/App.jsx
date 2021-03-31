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
import {AmplifyAuthenticator, AmplifySignOut, AmplifySignIn} from '@aws-amplify/ui-react'
import queryString from 'query-string';

const paths = ['/', '/movies', '/scores', '/suggestions', '/flowchart', '/bistro', '/bmdb']
const getValueFromURL = () => {
    return paths.indexOf(window.location.pathname)
}

export default function App () {
    const [value, setValue] = useState(getValueFromURL())
    const { m } = queryString.parse(location.search);

    return (
        <Router>
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
                    <Tab label={'Scores'} component={Link} to={'/scores'}/>
                    <Tab label={'Suggestions'} component={Link} to={'/suggestions'}/>
                    <Tab label={'Flowchart'} component={Link} to={'/flowchart'}/>
                    <Tab label={'Bistro'} component={Link} to={'/bistro'}/>

                </Tabs>
            </Paper>
            <Switch>
                <Route exact path="/">
                    <CalendarComponent />
                </Route>
                <Route path="/movies">
                    <MovieExplorer selectedMovie={m}  />
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
                    <AmplifyAuthenticator>
                        <AmplifySignIn
                            slot="sign-in" hideSignUp
                            headerText="Welcome to the Bistro HQ"
                            formFields={[
                                {
                                    type: "email",
                                    label: "Name",
                                    placeholder: "You know who you'd be",
                                    required: true,
                                },
                                {
                                    type: "password",
                                    label: "Password",
                                    placeholder: "Don't think it, don't say it",
                                    required: true,
                                },
                            ]}
                        />
                        <Bistro/>
                        <AmplifySignOut />
                    </AmplifyAuthenticator>
                </Route>
                <Route component={NotFound} />
            </Switch>
        </Router>
  )
}


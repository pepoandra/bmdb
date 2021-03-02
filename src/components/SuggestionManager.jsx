import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, FormLabel, Grow, InputAdornment, Link, Paper, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API, graphqlOperation} from "aws-amplify";
import { listSuggestions} from "../graphql/queries";
import {displayVerticalSpace} from "../helpers/helpers";
import {Alert} from "@material-ui/lab";
import {deleteSuggestion, updateSuggestion} from "../graphql/mutations";
import Typography from "@material-ui/core/Typography";

const initialState = {
    suggestions: [],
    selectedSuggestion: '',
    reply: '',
    savedSuccess: false,
    savedError: false,
    errorMsg: '',
}

export function SuggestionManager () {
    const [state, setState] = useState(initialState)

    useEffect(() => {
        fetchSuggestions()
    }, [])

    async function fetchSuggestions () {
        const apiData = await API.graphql({ query: listSuggestions })
        const fetchedSuggestions = apiData.data.listSuggestions.items;
        if(fetchedSuggestions && fetchedSuggestions.length > 0){
            await setState({...state, suggestions: fetchedSuggestions.filter(n => !n._deleted ) })
            onClickSuggestions(fetchedSuggestions[0].id)
        }
    }

    function onClickSuggestions(id) {
        const s = state.suggestions.find(s => s.id === id)
        if(!s) return;
        setState({
            ...state,
            selectedSuggestion: s.id,
            reply: s.reply,
        })
    }


    async function handleDeleteSuggestion() {
        const actualSuggestion = state.suggestions.find(s => s.id === state.selectedSuggestion)
        const input = {
            id: actualSuggestion.id,
            _version: actualSuggestion._version
        }
        try {
            const algo = await API.graphql(graphqlOperation(deleteSuggestion, {input: input }))
            setState({...state, savedSuccess: true})
            await fetchSuggestions();
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            alert((err.errors[0].errorType[0]))
            setState({...state, savedError: true, errorMsg: err.message})
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)
    }
    async function saveSuggestion() {
        const actualSuggestion = state.suggestions.find(s => s.id === state.selectedSuggestion)
        const newSuggestion = {
            id: actualSuggestion.id,
            _version: actualSuggestion._version,
            reply: state.reply
        }

        try {
            const algo = await API.graphql(graphqlOperation(updateSuggestion, {input: newSuggestion }))
            // setState({...state, movies: state.movies.concat([algo.data.updateMovie])})
            await fetchSuggestions();
            setState({...state, savedSuccess: true})
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            setState({...state, savedError: true })
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)

    }

    function handleReplyChange (event) {
        setState({...state, reply: event.target.value})
    }

    function displayAlert() {
        if(!(state.savedError || state.savedSuccess)) return
        const severity = state.savedSuccess? 'success' : 'error'
        const msg = state.savedSuccess? 'Reply saved!' : state.errorMsg
        return <Paper >
            <Alert variant="filled" severity={severity}>
                {msg}
            </Alert>
        </Paper>
    }

    function displaySuggestion (id) {
        const suggestion = state.suggestions.find(s => s.id === id)
        if (!suggestion) return
        return <Card className={'bistroMovieCard'}>
            <CardHeader
                title={suggestion.movie}
                subheader={suggestion.name}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>
                            {suggestion.description}
                        </Typography>
                        {displayVerticalSpace(20)}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Reply"
                            multiline
                            fullWidth
                            rows={4}
                            variant="outlined"
                            onChange={handleReplyChange}
                            value={suggestion.thoughts}
                        />
                        {displayVerticalSpace(45)}
                    </Grid>
                    <Grid item xs={4}>
                        <Button fullWidth onClick={handleDeleteSuggestion} variant="contained" color="secondary">
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={7}>
                        <Button fullWidth onClick={saveSuggestion} variant="contained" color="primary">
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grow in={state.savedError || state.savedSuccess}>
                            <div>
                                {displayAlert()}
                            </div>
                        </Grow>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    }
    function generateSuggestionItem(suggestion) {
        return (<ListItem button onClick={() => onClickSuggestions(suggestion.id)}>
            <ListItemText  primary={suggestion.movie} />
        </ListItem>)
    }
    return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormLabel component={'label'}>Select Suggestion</FormLabel>
                            <List
                                component="nav"
                                aria-label="main mailbox folders"
                                style={{maxHeight: '50vw', overflow: 'auto'}}
                            >
                                {state.suggestions.map(generateSuggestionItem)}
                            </List>
                        </Grid>
                        <Grid item xs={8}>
                            {displaySuggestion(state.selectedSuggestion)}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
}

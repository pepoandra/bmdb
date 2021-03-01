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
import {listLinks} from "../graphql/queries";
import {displayVerticalSpace} from "../helpers/helpers";
import {Alert} from "@material-ui/lab";
import {
    deleteLink,
    updateLink
} from "../graphql/mutations";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core/styles";
import {CreateLink} from "./CreateLink";
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '50%',
        left: '50%',
        outline: 'none',
        border: 'none'
    },
    paper: {
        position: 'absolute',
        width: 600,
        boxShadow: theme.shadows[5],
        outline: 'none'
    },
    hideBorder: {
        '&.MuiExpansionPanel-root:before': {
            display: 'none',
        },
    },
}));
const initialState = {
    searchedForLink: '',
    isModalOpen: false,
    links: [],
    tags: [],
    selectedLink: '',
    reason: '',
    inputReason: '',
    target: '',
    inputTarget: '',
    inputSource: '',
    source: '',
    value: 0,
    savedSuccess: false,
    savedError: false,
    errorMsg: '',
}

export function LinkManager (props) {
    const [state, setState] = useState(initialState)
    const { movieTitles, tags } = props;
    const classes = useStyles();

    useEffect(() => {
        fetchLinks()
    }, [state.isModalOpen])

    async function fetchLinks () {
        const apiData = await API.graphql(graphqlOperation(listLinks, {limit: 1000}))

        const fetchedLinks = apiData.data.listLinks.items;
        if(fetchedLinks && fetchedLinks.length > 0){
            const cleanLinks = fetchedLinks.filter(n => !n._deleted )
            await setState({...state, links: cleanLinks })
            onClickLink(fetchedLinks[0].id)
        }
    }

    function onClickLink(id) {
        const l = state.links.find(s => s.id === id)
        if(!l) return;
        setState({
            ...state,
            inputReason: l.reason,
            source: l.source,
            target: l.target,
            id: l.id,
            reason: l.reason,
            inputSource: l.source,
            inputTarget: l.target,
            selectedLink: l.id,
            value: l.value,
        })
    }


    async function handleDeleteLink() {
        const actualLink = state.links.find(s => s.id === state.selectedLink)
        const input = {
            id: actualLink.id,
            _version: actualLink._version
        }
        try {
            const algo = await API.graphql(graphqlOperation(deleteLink, {input: input }))
            setState({...state, savedSuccess: true})
            await fetchLinks();
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            alert((err.errors[0].errorType[0]))
            setState({...state, savedError: true, errorMsg: err.message})
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)
    }
    async function saveLink() {
        const actualLink = state.links.find(s => s.id === state.selectedLink)
        const newLink = {
            id: actualLink.id,
            _version: actualLink._version,
            target: state.target,
            source: state.source,
            value: state.value,
            reason: state.inputReason,
        }

        try {
            const algo = await API.graphql(graphqlOperation(updateLink, {input: newLink }))
            alert(JSON.stringify(algo))
            await fetchLinks();
            setState({...state, savedSuccess: true})
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            setState({...state, savedError: true })
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)

    }
    function filterDisplayedLinks(link) {
        let res = link.source.toLowerCase().includes(state.searchedForLink.toLowerCase())
        res = res || link.target.toLowerCase().includes(state.searchedForLink.toLowerCase())
        return res || link.reason.toLowerCase().includes(state.searchedForLink.toLowerCase())
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

    function handleValueChange (event) {
        let value = 0;
        if(event.target.value > 0 ){
            value = event.target.value > 10? 10 : event.target.value.replace(/^0+/, '')
        }
        setState({...state, value: value})
    }
    function displayLink (id) {
        const link = state.links.find(s => s.id === id)
        if (!link) return
        return <Card className={'bistroMovieCard'}>
            <CardHeader
                title={`${link.source} <-> ${link.target} ` }
                subheader={link.reason}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={movieTitles}
                            getOptionLabel={(option) => option.title}
                            id="source"
                            onChange={(event, newValue) => {
                                setState({...state, source : newValue.title})
                            }}
                            inputValue={state.inputSource}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputSource: newInputValue })
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Source" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={2}/>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={movieTitles}
                            getOptionLabel={(option) => option.title}
                            id="source"
                            onChange={(event, newValue) => {
                                // setState({...state, newTag: newValue.title})
                                setState({...state, target : newValue.title})
                            }}
                            inputValue={state.inputTarget}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputTarget: newInputValue })
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Target" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={tags}
                            getOptionLabel={(option) => option.title}
                            id="reason"
                            onChange={(event, newValue) => {
                                if(newValue && newValue.title){
                                    setState({...state, reason: newValue.title})
                                }
                            }}
                            inputValue={state.inputReason}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputReason: newInputValue })
                            }}
                            freeSolo
                            renderInput={(params) => <TextField {...params} label="Reason" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={4}/>
                    <Grid item xs={3}>
                        <div className={'outerCenterTextField'}>
                            {displayVerticalSpace(17)}
                            <div className={'centerTextField'} >
                                <TextField
                                    style={{top: '50%'}}
                                    type={'number'}
                                    fullWidth
                                    id="value"
                                    label="Value"
                                    onChange={handleValueChange}
                                    value={parseFloat(state.value)}
                                    inputProps={{ min: "0", max: "10", step: "0.5", style: {margin: 'auto'}}}
                                    InputProps={{ endAdornment:<InputAdornment position="end">/10</InputAdornment>}}
                                />
                            </div>
                        </div>
                        {displayVerticalSpace(35)}
                    </Grid>
                    <Grid item xs={4}>
                        <Button fullWidth onClick={handleDeleteLink} variant="contained" color="secondary">
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={7}>
                        <Button fullWidth onClick={saveLink} variant="contained" color="primary">
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
    function generateLinkItem(link) {
        return (<ListItem button onClick={() => onClickLink(link.id)}>
            <ListItemText  primary={`${link.source} <-> ${link.target}`}
            />
        </ListItem>)
    }
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Button onClick={() => setState({...state, isModalOpen: true})} fullWidth variant="contained" color="primary">
                        Create Link
                    </Button>
                    {displayVerticalSpace(15)}
                    <TextField
                        fullWidth
                        id="searchedForLink"
                        autoComplete={'off'}
                        label={'Select link'}
                        onChange={(event) => {
                            setState({...state, searchedForLink: event.target.value})
                        }}
                        value={ state.searchedForLink }
                    />
                    <List
                        component="nav"
                        aria-label="main mailbox folders"
                        style={{maxHeight: '50vw', overflow: 'auto'}}
                    >
                        {state.links.filter(filterDisplayedLinks).map(generateLinkItem)}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    {displayLink(state.selectedLink)}
                </Grid>
            </Grid>
            <Modal
                open={state.isModalOpen}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}
                onEscapeKeyDown={() => setState({...state, isModalOpen: false})}
            >
                <div className={classes.paper}>
                    <CreateLink
                        movieTitles={movieTitles}
                        tags={tags}
                        closeModal={() => setState({...state, isModalOpen: false})}/>
                </div>
            </Modal>
        </div>
    )
}

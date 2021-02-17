import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, FormLabel, InputAdornment, Link, Paper, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API, graphqlOperation} from "aws-amplify";
import {listMovies} from "../graphql/queries";
import {displayVerticalSpace} from "../helpers/helpers";
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {CreateMovie} from "./CreateMovie";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DROPDOWN_OPTIONS, NAMES, NOBODY} from "../helpers/constants";
import Grow from '@material-ui/core/Grow';
import {Alert} from "@material-ui/lab";
import moment from 'moment'
import {updateMovie, deleteMovie} from "../graphql/mutations";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';


const initialState = {
    movies: [],
    selectedMovie: '',
    rating: 0,
    tags: '',
    newTag: '',
    watchers: '',
    thoughts: '',
    isCreateModalOpen: false,
    savedSuccess: false,
    savedError: false,
    date: '',
    errorMsg: '',
    personLoggedIn: ''
}

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
}));

function Bistro () {
    const [state, setState] = useState(initialState)
    const classes = useStyles();

    useEffect(() => {
        fetchMovies()
        Auth.currentSession()
            .then(data => setState({...state, personLoggedIn: data.idToken.payload.preferred_username}))
            .catch(err => console.log(err));
    }, [])
    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        const fetchedMovies = apiData.data.listMovies.items;
        if(fetchedMovies && fetchedMovies.length > 0){
            await setState({...state, movies: fetchedMovies.filter(n => !n._deleted ) })
            onClickMovie(fetchedMovies[0].title)
        }
    }

    function onClickMovie(title) {
        const m = state.movies.find(movie => movie.title === title)
        if(!m) return;
        setState({
            ...state,
            watchers: m.watchedBy,
            pickedBy: m.pickedBy,
            corkedBy: m.corkedBy,
            rating: m[`rate${state.personLoggedIn}`],
            tags: m.tags,
            newTag: '',
            selectedMovie: m.title,
            thoughts: m.thoughts,
            date: moment(new Date(m.date)).format('YYYY-MM-DDTHH:mm')
        })

    }

    function handleCloseCreateMovie() {
        setState({...state, isCreateModalOpen: false})
    }
    function clickCreateMovie() {
        setState({...state, isCreateModalOpen: !state.isCreateModalOpen })
    }

    async function handleDeleteMovie() {
        const actualMovie = state.movies.find(m => m.title === state.selectedMovie)
        const input = {
            id: actualMovie.id,
            _version: actualMovie._version
        }
        try {
            const algo = await API.graphql(graphqlOperation(deleteMovie, {input: input }))
            alert('success')
            setState({...state, savedSuccess: true})
            await fetchMovies();
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            alert((err.errors[0].errorType[0]))
            setState({...state, savedError: true, errorMsg: err.message})
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)
    }
    async function saveMovie() {
        const actualMovie = state.movies.find(m => m.title === state.selectedMovie)
        const newMovie = {
            id: actualMovie.id,
            watchedBy: state.watchers,
            pickedBy: state.pickedBy,
            corkedBy: state.corkedBy,
            [`rate${state.personLoggedIn}`]: state.rating,
            thoughts: state.thoughts,
            tags: state.tags,
            date: moment(new Date(state.date)).format(),
            _version: actualMovie._version,
        }
        if (validateMovie(newMovie)) {
            try {
                const algo = await API.graphql(graphqlOperation(updateMovie, {input: newMovie }))
                await fetchMovies();
                setState({...state, savedSuccess: true})
            } catch (err) {
                setState({...state, savedError: true})
            }
            setTimeout(() => {
                setState({...state, savedSuccess: false, savedError: false})
            }, 7000)
        }
    }
    function validateMovie(movie){
        if(movie.watchedBy.length === 0 ) return false;
        return true;
    }
    function isNameChecked(name) {
        return state.watchers.includes(name)
    }

    async function handleChangeWatchers(name){
        if(isNameChecked(name)){
            await setState({...state, watchers: state.watchers.filter(w => w !== name) })
        } else {
            await setState({...state, watchers: state.watchers.concat([name]) })
        }
    }
    function handleOnDeleteTag(tag) {
        setState({...state, tags: state.tags.filter(t => t !== tag)})
    }
    function handleAddTag() {
        if(state.newTag) setState({...state, newTag: '', tags: state.tags.concat(state.newTag) })
    }
    function handleChangeTag(event) {
        setState({...state, newTag: event.target.value})
    }
    function handleRatingChange (event) {
        let value = 0;
        if(event.target.value > 0 ){
            value = event.target.value > 10? 10 : event.target.value.replace(/^0+/, '')
        }
        setState({...state, rating: value})
    }
    function handleThoughtsChange (event) {
        setState({...state, thoughts: event.target.value})
    }
    function displayCheckbox(name) {
        return <FormControlLabel
            control={
                <Checkbox
                    checked={isNameChecked(name)}
                    name={name}
                    color="primary"
                    onChange={() => handleChangeWatchers(name)}
                />
            }
            label={name}
        />;
    }
    function onChangeDate(event) {
        setState({...state, date: event.target.value})
        // alert(JSON.stringify(event.target.value));
    }
    function displayAlert() {
        if(!(state.savedError || state.savedSuccess)) return
        const severity = state.savedSuccess? 'success' : 'error'
        const msg = state.savedSuccess? 'Movie saved!' : state.errorMsg
        return <Paper >
            <Alert variant="filled" severity={severity}>
                {msg}
            </Alert>
        </Paper>
    }
    const tagPlaceHolder = state.tags.length === 0? displayVerticalSpace(47) : null;
    const options = DROPDOWN_OPTIONS.map(n => {
        return {
            title: n,
        }
    })
    function displayMovie (title) {
        const event = state.movies.find(m => m.title === title)
        if (!event) return
        return <Card className={'bistroMovieCard'}>
            <CardHeader
                title={state.selectedMovie}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={2}>
                        <TextField
                            type={'number'}
                            fullWidth
                            id="rating"
                            label="Your rating"
                            onChange={handleRatingChange}
                            value={state.rating}
                            inputProps={{ min: "0", max: "10", step: "0.5"}}
                            InputProps={{ endAdornment:<InputAdornment position="end">/10</InputAdornment>}}
                        />
                    </Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.title}
                            id="corkedBy"
                            autoComplete
                            onInputChange={(event, newInputValue) => {
                                setState({...state, corkedBy: newInputValue})
                            }}
                            clearOnEscape
                            includeInputInList
                            value={ {title: state.corkedBy} }
                            renderInput={(params) => <TextField {...params} label="Corked by" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {displayVerticalSpace(90)}
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.title}
                            id="pickedBy"
                            onInputChange={(event, newInputValue) => {
                                setState({...state, pickedBy: newInputValue})
                            }}
                            autoComplete
                            clearOnEscape
                            value={ {title: state.pickedBy} }
                            includeInputInList
                            renderInput={(params) => <TextField {...params} label="Picked by" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="thoughts"
                            label="Bistro thoughts"
                            multiline
                            fullWidth
                            rows={4}
                            variant="outlined"
                            onChange={handleThoughtsChange}
                            value={event.thoughts}
                        />
                        {displayVerticalSpace(25)}
                    </Grid>
                    <Grid item xs={7}>
                        <FormLabel component={'label'}>Watched by</FormLabel>
                        <FormGroup row>
                            {NAMES.map(n => displayCheckbox(n))}
                        </FormGroup>
                    </Grid>
                    <Grid container xs={5}>
                        <FormLabel component={'label'}>Date & Time</FormLabel>
                        <TextField
                            id="datetime-local"
                            type="datetime-local"
                            value={state.date}

                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={onChangeDate}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {displayVerticalSpace(10)}
                        <Divider />
                        {displayVerticalSpace(15)}
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="tag"
                            label="Tag"
                            value={state.newTag}
                            onChange={handleChangeTag}
                        />
                        {displayVerticalSpace(10)}
                    </Grid>
                    <Grid item xs={3}>
                        <Button fullWidth onClick={handleAddTag} variant="contained" color="primary">
                            Add Tag
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {tagPlaceHolder}
                        <div className={'tags'}>
                            {state.tags.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onDelete={() => handleOnDeleteTag(t)}
                                    />
                                </div>
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        {displayVerticalSpace(10)}
                        <Divider />
                        {displayVerticalSpace(10)}
                    </Grid>
                    <Grid item xs={4}>
                        <Button fullWidth onClick={handleDeleteMovie} variant="contained" color="secondary">
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={7}>
                        <Button fullWidth onClick={saveMovie} variant="contained" color="primary">
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
    function generateMovieItem(movie) {
        return (<ListItem button onClick={() => onClickMovie(movie.title)}>
            <ListItemText  primary={movie.title} />
        </ListItem>)
    }
    return (
        <Container maxWidth="md">
            <Typography variant={'h2'}>{state.personLoggedIn}</Typography>
            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Button onClick={clickCreateMovie} fullWidth variant="contained" color="primary">
                            Create Movie
                        </Button>
                        {displayVerticalSpace(15)}
                        <Divider/>
                        {displayVerticalSpace(15)}
                        <FormLabel component={'label'}>Select Movie</FormLabel>
                        <List
                            component="nav"
                            aria-label="main mailbox folders"
                            style={{maxHeight: '50vw', overflow: 'auto'}}
                        >
                            {state.movies.map(generateMovieItem)}
                        </List>
                    </Grid>
                    <Grid item xs={8}>
                        {displayMovie(state.selectedMovie)}
                    </Grid>
                </Grid>
            </Box>
            <div>
                <Modal
                    open={state.isCreateModalOpen}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.modal}
                    onEscapeKeyDown={handleCloseCreateMovie}
                >
                    <div className={classes.paper}>
                        <CreateMovie closeModal={handleCloseCreateMovie}/>
                    </div>
                </Modal>
            </div>
        </Container>
    )
}

export default withAuthenticator(Bistro);
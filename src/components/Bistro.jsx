import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, FormLabel, InputAdornment, Link, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API} from "aws-amplify";
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
import {NAMES} from "../helpers/constants";



const personLoggedIn = 'Seb'
const initialState = {
    movies: [],
    selectedMovie: '',
    rating: 0,
    tags: '',
    newTag: '',
    watchers: '',
    thoughts: '',
    isCreateModalOpen: false,
}

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '50%',
        left: '50%',
    },
    paper: {
        position: 'absolute',
        width: 600,
        boxShadow: theme.shadows[5],
    },
}));

export function Bistro () {
    const [state, setState] = useState(initialState)
    const classes = useStyles();

    useEffect(() => {
        fetchMovies()
    }, [])
    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        const fetchedMovie = apiData.data.listMovies.items;
        if(fetchedMovie.length > 0)
        await setState({
            ...state,
            movies: fetchedMovie,
            tags: fetchedMovie[0].tags,
            rating: fetchedMovie[0][`rate${personLoggedIn}`],
            selectedMovie: fetchedMovie[0].title,
            watchers: fetchedMovie[0].watchedBy,
            thoughts: fetchedMovie[0].thoughts,
            corkedBy: fetchedMovie[0].corkedBy,
            pickedBy: fetchedMovie[0].pickedBy
        })
    }
    function selectCorker(event) {
        setState({...state, corkedBy: event.target.value})
    }
    function selectPicker(event) {
        setState({...state, pickedBy: event.target.value})
    }
    function handleCloseCreateMovie() {
        setState({...state, isCreateModalOpen: false})
    }
    function clickCreateMovie() {
        setState({...state, isCreateModalOpen: !state.isCreateModalOpen })
    }
    function saveMovie() {
        const actualMovie = state.movies.find(m => m.title === state.selectedMovie)
        const newMovie = {
            watchedBy: state.watchers,
            [`rate${personLoggedIn}`]: state.rating,
            thoughts: state.thoughts,
            tags: state.tags
        }
        alert(JSON.stringify(actualMovie))
        alert(JSON.stringify(newMovie))
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
    function handleDeleteTag(event){
        setState({...state, tags: state.tags.filter(t => t !== event.currentTarget.id)})
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
                            options={NAMES.map(n => {
                                return {
                                    title: n,
                                }
                            })}
                            getOptionLabel={(option) => option.title}
                            id="corkedBy"
                            autoComplete
                            onChange={selectCorker}
                            clearOnEscape
                            includeInputInList
                            defaultvalue={state.corkedBy}
                            renderInput={(params) => <TextField value={state.corkedBy} {...params} label="Corked by" margin="normal" />}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {displayVerticalSpace(90)}
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={NAMES.map(n => {
                                return {
                                    title: n,
                                }
                            })}
                            getOptionLabel={(option) => option.title}
                            id="pickedBy"
                            onChange={selectPicker}
                            autoComplete
                            clearOnEscape
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
                            defaultValue={event.thoughts}
                        />
                        {displayVerticalSpace(25)}
                    </Grid>
                    <Grid item xs={12}>
                        <FormLabel component={'label'}>Watched by</FormLabel>
                        <FormGroup row>
                            {['Seb', 'Amy', 'Dov', 'Shane'].map(n => displayCheckbox(n))}
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        {displayVerticalSpace(10)}
                        <Divider />
                        {displayVerticalSpace(10)}
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="tag"
                            label="Tag"
                            value={state.newTag}
                            onChange={handleChangeTag}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button fullWidth onClick={handleAddTag} variant="contained" color="primary">
                            Add Tag
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {displayVerticalSpace(25)}
                        <div className={'tags'}>
                            {state.tags.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        clickable
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onClick={handleDeleteTag}
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
                    <Grid item xs={12}>
                        <Button fullWidth onClick={saveMovie} variant="contained" color="primary">
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    }
    function generateMovieItem(movie) {
        return (<ListItem button onClick={() => setState({...state, selectedMovie: movie.title})}>
            <ListItemText  primary={movie.title} />
        </ListItem>)
    }
    return (
        <Container maxWidth="md">
            <Typography variant={'h2'}>{personLoggedIn}</Typography>
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
                    onClose={handleCloseCreateMovie}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.modal}

                >
                    <div className={classes.paper}>
                        <CreateMovie/>
                    </div>
                </Modal>
            </div>
        </Container>

    )
}


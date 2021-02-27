import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import { Container, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API} from "aws-amplify";
import {listMovies} from "../graphql/queries";
import {checker, displayVerticalSpace} from "../helpers/helpers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";
import moment from 'moment'
import { Auth, graphqlOperation } from 'aws-amplify';

import {ViewMovie} from "./ViewMovie";
import FormGroup from "@material-ui/core/FormGroup";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DROPDOWN_OPTIONS, NAMES} from "../helpers/constants";

const initialState = {
    unfilteredMovies: [],
    movies: [],
    searchedForMovie: '',
    selectedMovie: '',
    allTags: [],
    inputTag: '',
    inputWatchedBy: '',
    inputCorkedBy: '',
    inputPickedBy: '',
}
const filterInitialState = {
    tags: [],
    watchedBy: [],
    pickedBy: [],
    corkedBy: [],
    startDate: '',
    endDate: '',
}

export function MovieExplorer () {
    const [personLoggedIn, setPersonLoggedIn] = useState('')
    const [filters, setFilters] = useState(filterInitialState)
    const [state, setState] = useState(initialState)

    useEffect(() => {
        fetchMovies()
    }, [])

    useEffect(async ()=>{
        const data =  await Auth.currentSession()
        await setPersonLoggedIn(data.idToken.payload.preferred_username)
    }, [])

    async function fetchMovies () {
        const apiData = await API.graphql(graphqlOperation(listMovies, {limit: 1000}))

        const fetchedMovies = apiData.data.listMovies.items;
        if(fetchedMovies && fetchedMovies.length > 0){
            const cleanMovies = fetchedMovies.filter(n => !n._deleted ).sort((a, b) => new Date(b.date) - new Date(a.date))
            let tags = [];
            cleanMovies.map(m => {
                tags = tags.concat(m.tags)
            })
            await setState({...state, movies: cleanMovies, allTags: noDuplicate(tags), unfilteredMovies: fetchedMovies })

            onClickMovie(fetchedMovies[0].title)
        }
    }

    function applyFilters(m) {
        let res = true
        if(filters.watchedBy.length > 0){
            res = res & checker(m.watchedBy, filters.watchedBy)
        }
        if(filters.tags.length > 0){
            res = res & checker(m.tags, filters.tags)
        }
        if(filters.corkedBy.length > 0){
            res = res & filters.corkedBy.includes(m.corkedBy)
        }
        if(filters.pickedBy.length > 0){
            res = res & filters.pickedBy.includes(m.pickedBy)
        }
        return res
    }

    function filterDisplayedMovies(movie) {
        return movie.title.toLowerCase().includes(state.searchedForMovie.toLowerCase())
    }
    function onClickMovie(title) {
        const m = state.movies.find(movie => movie.title === title)
        if(!m) return;
        setState({
            ...state,
            watchedBy: m.watchedBy,
            pickedBy: m.pickedBy,
            corkedBy: m.corkedBy,
            title: m.title,
            rating: m[`rate${personLoggedIn}`] || 0,
            tags: m.tags,
            newTag: '',
            selectedMovie: m.title,
            thoughts: m.thoughts,
            date: moment(new Date(m.date)).format('YYYY-MM-DDTHH:mm')
        })
    }

    function selectPrevMovie() {
        const idx = state.movies.findIndex(m => m.title === state.selectedMovie);
        if (idx === state.movies.length - 1) return
        handleEventClick(state.movies[idx + 1])
    }
    function selectNextMovie() {
        const idx = state.movies.findIndex(m => m.title === state.selectedMovie);
        if (idx === 0) return
        handleEventClick(state.movies[idx - 1])
    }
    async function handleEventClick (event) {
        await setState({...state, selectedMovie: event.title})
    }
    function arrowPressAction(event){
        if([38, 39].includes(event.keyCode)){
            selectNextMovie()
        }
        if([37, 40].includes(event.keyCode)){
            selectPrevMovie()
        }

    }

    function generateMovieItem(movie) {
        return (<ListItem button onClick={() => onClickMovie(movie.title)}>
            <ListItemText  primary={movie.title}/>
        </ListItem>)
    }
    const tagPlaceHolder = filters.tags.length === 0? displayVerticalSpace(47) : null;
    const watchedByPlaceHolder = filters.watchedBy.length === 0? displayVerticalSpace(47) : null;
    const corkedByPlaceHolder = filters.corkedBy.length === 0? displayVerticalSpace(47) : null;
    const pickedByPlaceHolder = filters.pickedBy.length === 0? displayVerticalSpace(47) : null;

    const tagOptions = state.allTags.map(t => {
        return {title: t}
    })
    const pickedByOptions = DROPDOWN_OPTIONS.map(o => {
        return {title: o}
    })
    const watchedByOptions = NAMES.map(o => {
        return {title: o}
    })
    function noDuplicate(arr) {
        return [...new Set(arr)]
    }
    function deleteChip(type, value){
        if(value) setFilters({...filters, [type]: filters[type].filter(w => w !== value)})
    }
    function onChangeAutocomplete(type, value){
        if(value && value.title) setFilters({...filters, [type]: noDuplicate(filters[type].concat([value.title])) })
    }

    return <Container maxWidth="lg">
        <Typography variant={'h2'}>Movies</Typography>
        <Box my={2} >
            <div onKeyDown={arrowPressAction} tabIndex="0" style={{borderline: 'none', border: 'none', outline: 'none'}}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={watchedByOptions}
                            getOptionLabel={(option) => option.title}
                            id="watchedBy"
                            onChange={(event, newValue) => {
                                // setState({...state, newTag: newValue.title})
                                onChangeAutocomplete('watchedBy', newValue)
                            }}
                            inputValue={state.inputWatchedBy}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputWatchedBy: newInputValue})
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Watched by" margin="normal" />}
                        />
                        {watchedByPlaceHolder}
                        <div className={'tags'}>
                            {filters.watchedBy.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onDelete={() => deleteChip('watchedBy', t)}
                                    />
                                </div>
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete
                            options={pickedByOptions}
                            getOptionLabel={(option) => option.title}
                            id="pickedBy"
                            onChange={(event, newValue) => {
                                // setState({...state, newTag: newValue.title})
                                onChangeAutocomplete('pickedBy', newValue)
                            }}
                            inputValue={state.inputPickedBy}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputPickedBy: newInputValue})
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Picked by" margin="normal" />}
                        />
                        {pickedByPlaceHolder}
                        <div className={'tags'}>
                            {filters.pickedBy.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onDelete={() => deleteChip('pickedBy', t)}
                                    />
                                </div>
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete
                            options={pickedByOptions}
                            getOptionLabel={(option) => option.title}
                            id="corkedBy"
                            onChange={(event, newValue) => {
                                // setState({...state, newTag: newValue.title})
                                onChangeAutocomplete('corkedBy', newValue)
                            }}
                            inputValue={state.inputCorkedBy}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputCorkedBy: newInputValue})
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Corked by" margin="normal" />}
                        />
                        {corkedByPlaceHolder}
                        <div className={'tags'}>
                            {filters.corkedBy.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onDelete={() => deleteChip('corkedBy', t)}
                                    />
                                </div>
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={tagOptions}
                            getOptionLabel={(option) => option.title}
                            id="Tags"
                            onChange={(event, newValue) => {
                                // setState({...state, newTag: newValue.title})
                                onChangeAutocomplete('tags', newValue)
                            }}
                            inputValue={state.inputTag}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputTag: newInputValue})
                            }}
                            autoComplete
                            clearOnEscape
                            renderInput={(params) => <TextField {...params} label="Tags" margin="normal" />}
                        />
                        {tagPlaceHolder}
                        <div className={'tags'}>
                            {filters.tags.map(t => {
                                return <div className={'chips'}>
                                    <Chip
                                        label={t}
                                        id={t}
                                        value={t}
                                        color="primary"
                                        onDelete={() => setFilters({...filters, tags: filters.tags.filter(w => w !== t)})}
                                    />
                                </div>
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            id="searchedForMovie"
                            autoComplete={'off'}
                            label={'Select movie'}
                            onChange={(event) => {
                    setState({...state, searchedForMovie: event.target.value})
                    }}
                            value={ state.searchedForMovie }
                        />
                        <List
                            component="nav"
                            aria-label="main mailbox folders"
                            style={{maxHeight: '75vw', overflow: 'auto', scroll: 'visible'}}

                        >
                            {state.movies.filter(applyFilters).filter(filterDisplayedMovies).map(generateMovieItem)}
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        {state.selectedMovie !== ''?
                            <ViewMovie
                                movie={state.movies.find(m => m.title === state.selectedMovie)}
                                nextFunction={selectNextMovie}
                                prevFunction={selectPrevMovie}
                            /> : null}
                    </Grid>
                </Grid>
            </div>
        </Box>
    </Container>
}

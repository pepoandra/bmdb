import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {AppBar, Button, Card, Container, FormLabel, InputAdornment, Link, Paper, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API, graphqlOperation} from "aws-amplify";
import {listMovies} from "../graphql/queries";
import {displayVerticalSpace, noDuplicate} from "../helpers/helpers";
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
import {NotFound} from "./NotFound";
import {SuggestionManager} from "./SuggestionManager";
import {LinkManager} from "./LinkManager";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";


const initialState = {
    selectedTab: 0,
    movies: [],
    allTags: [],
    searchedForMovie: '',
    selectedMovie: '',
    title: '',
    rating: 0,
    tags: '',
    newTag: '',
    inputNewTag: '',
    watchedBy: [],
    inputPickedBy: '',
    inputCorkedBy: '',
    thoughts: '',
    date: '',
}

const msgInitialState = {
    savedSuccess: false,
    savedError: false,
    errorMsg: '',
}
const filterInitialState = {
    watchedByUser: false,
    toRateByUser: false,
    tags: [],
    pickedBy: '',
    corkedBy: '',
    startDate: '',
    endDate: '',
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
    hideBorder: {
        '&.MuiExpansionPanel-root:before': {
            display: 'none',
        },
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function Bistro () {
    const [state, setState] = useState(initialState)
    const [personLoggedIn, setPersonLoggedIn] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const classes = useStyles();
    const [filters, setFilters] = useState(filterInitialState)
    const [update, setUpdate] = useState(false)
    const [msgs, setMsgs] = useState(msgInitialState)
    useEffect(() => {
        fetchMovies()
    }, [update, isCreateModalOpen])

    useEffect(async ()=>{
        const data =  await Auth.currentSession()
        await setPersonLoggedIn(data.idToken.payload.preferred_username)
    }, [])
    async function fetchMovies () {
        const apiData = await API.graphql(graphqlOperation(listMovies, {limit: 1000}))
        const fetchedMovies = apiData.data.listMovies.items;
        if(fetchedMovies && fetchedMovies.length > 0){
            const cleanMovies = fetchedMovies.filter(n => !n._deleted );
            let allTags = [];
            cleanMovies.map(m => {
                allTags = noDuplicate(allTags.concat(m.tags))
            })
            await setState({...state, movies: cleanMovies, allTags })
        }
    }
    function handleTitleChange(event) {
        setState({...state, title: event.target.value})
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
            inputCorkedBy: m.corkedBy,
            inputPickedBy: m.pickedBy,
            title: m.title,
            rating: m[`rate${personLoggedIn}`] || 0,
            tags: m.tags,
            newTag: '',
            selectedMovie: m.title,
            thoughts: m.thoughts,
            date: moment(new Date(m.date)).format('YYYY-MM-DDTHH:mm')
        })
    }

    function handleCloseCreateMovie() {
        setIsCreateModalOpen(false)
    }
    function clickCreateMovie() {
        setIsCreateModalOpen(true)
    }

    function keyPress(event){
        if(event.keyCode === 13){
            handleAddTag()
        }
    }
    async function handleDeleteMovie() {
        const actualMovie = state.movies.find(m => m.title === state.selectedMovie)
        const input = {
            id: actualMovie.id,
            _version: actualMovie._version
        }
        try {
            const algo = await API.graphql(graphqlOperation(deleteMovie, {input: input }))
            setMsgs({...msgs, savedSuccess: true})
            setUpdate(!update)
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            setMsgs({...msgs, savedError: true, errorMsg: err.message})
        }
        setTimeout(() => {
            setMsgs({...msgs, savedSuccess: false, savedError: false})
        }, 7000)
    }
    async function saveMovie() {
        const actualMovie = state.movies.find(m => m.title === state.selectedMovie)
        const newMovie = {
            id: actualMovie.id,
            title: state.title,
            watchedBy: state.watchedBy,
            pickedBy: state.pickedBy,
            corkedBy: state.corkedBy,
            [`rate${personLoggedIn}`]: state.rating,
            thoughts: state.thoughts,
            tags: state.tags,
            date: moment(new Date(state.date)).format(),
            _version: actualMovie._version,
        }
        if (validateMovie(newMovie)) {
            try {
                const algo = await API.graphql(graphqlOperation(updateMovie, {input: newMovie }))
                setMsgs({...msgs, savedSuccess: true})
                setUpdate(!update)
            } catch (err) {
                setMsgs({...msgs, savedError: true, errorMsg: err.message})
            }
            setTimeout(() => {
                setMsgs({...msgs, savedSuccess: false, savedError: false})
            }, 7000)
        }
    }
    function applyFilters(m) {
        let res = true
        if(filters.watchedByUser) {
            res = res & m.watchedBy.includes(personLoggedIn)
        }
        if(filters.toRateByUser) {
            res = res & (!m[`rate${personLoggedIn}`])
        }
        return res
    }
    function validateMovie(movie){
        if(movie.watchedBy.length === 0 ) return false;
        return true;
    }
    function isNameChecked(name) {
        return state.watchedBy.includes(name)
    }
    function isFilterChecked(filter) {
        return filters[filter]
    }
    async function handleChangeWatchers(name){
        if(isNameChecked(name)){
            await setState({...state, watchedBy: state.watchedBy.filter(w => w !== name) })
        } else {
            await setState({...state, watchedBy: state.watchedBy.concat([name]) })
        }
    }
    async function handleFilterChange(filter){
        await setFilters({...filters, [filter]: !filters[filter]})
    }
    function handleOnDeleteTag(tag) {
        setState({...state, tags: state.tags.filter(t => t !== tag)})
    }
    function handleAddTag() {
        if(state.newTag !== '') {
            return setState({...state, newTag: '', tags: state.tags.concat(state.newTag) })
        }
        if(state.inputNewTag !== '') return setState({...state, inputNewTag: '', tags: state.tags.concat(state.inputNewTag) })
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
    function displayFilterCheckbox(filter) {
        return <FormControlLabel
            control={
                <Checkbox
                    checked={isFilterChecked(filter)}
                    name={filter}
                    color="primary"
                    onChange={() => handleFilterChange(filter)}
                />
            }
            label={filter.split('By')[0]}
        />;
    }
    function onChangeDate(event) {
        setState({...state, date: event.target.value})
    }
    function displayAlert() {
        if(!(msgs.savedError || msgs.savedSuccess)) return
        const severity = msgs.savedSuccess? 'success' : 'error'
        const msg = msgs.savedSuccess? 'Movie saved!' : msgs.errorMsg
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
                    <Grid item xs={7}>
                        <TextField
                            fullWidth
                            id="title"
                            label="Title"
                            value={state.title}
                            onChange={handleTitleChange}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {displayVerticalSpace(45)}
                    </Grid>
                    <Grid item xs={3}>
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
                    <Grid item xs={5}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.title}
                            id="corkedBy"
                            autoComplete
                            onChange={(event, newValue) => {
                                if(newValue && newValue.title){
                                    setState({...state, corkedBy: newValue.title})
                                }
                            }}
                            inputValue={state.inputCorkedBy}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputCorkedBy: newInputValue})
                            }}
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
                            onChange={(event, newValue) => {
                                if(newValue && newValue.title){
                                    setState({...state, pickedBy: newValue.title})
                                }
                            }}
                            autoComplete
                            clearOnEscape
                            inputValue={state.inputPickedBy}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputPickedBy: newInputValue})
                            }}
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
                            value={state.thoughts}
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
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            options={state.allTags.map(t => {
                                return {title: t}
                            })}
                            getOptionLabel={(option) => option.title}
                            id="Tags"
                            onChange={(event, newValue) => {
                                if(newValue && newValue.title){
                                    setState({...state, newTag: newValue.title})
                                }
                            }}
                            inputValue={state.inputNewTag}
                            onInputChange={(event, newInputValue) => {
                                setState({...state, inputNewTag: newInputValue})
                            }}
                            freeSolo
                            renderInput={(params) => <TextField {...params} label="Tags" margin="normal" />}
                            onKeyDown={keyPress}
                        />
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                        {displayVerticalSpace(30)}
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
                    <Grid item xs={1}/>
                    <Grid item xs={7}>
                        <Button fullWidth onClick={saveMovie} variant="contained" color="primary">
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grow in={msgs.savedError || msgs.savedSuccess}>
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
    return !NAMES.includes(personLoggedIn)? <NotFound/> :
        (
            <Container maxWidth="md">
                <Typography variant={'h2'}>{personLoggedIn}</Typography>
                <Box my={2}>
                    <AppBar position="static">
                        <Tabs value={state.selectedTab}
                              onChange={
                                  (event, newValue) => setState({...state, selectedTab: newValue})}
                              aria-label="simple tabs example">
                            <Tab label="Movies"  />
                            <Tab label="Links"  />
                            <Tab label="Suggestions" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={state.selectedTab} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Button onClick={clickCreateMovie} fullWidth variant="contained" color="primary">
                                    Create Movie
                                </Button>
                                {displayVerticalSpace(15)}
                                <FormGroup row>
                                    {displayFilterCheckbox('watchedByUser')}
                                    {displayFilterCheckbox('toRateByUser')}
                                </FormGroup>
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
                                    style={{maxHeight: '50vw', overflow: 'auto'}}
                                >
                                    {state.movies.filter(applyFilters).filter(filterDisplayedMovies).map(generateMovieItem)}
                                </List>
                            </Grid>
                            <Grid item xs={8}>
                                {displayMovie(state.selectedMovie)}
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={state.selectedTab} index={1}>
                        <LinkManager
                            movieTitles={state.movies.map(m => {
                                return {title: m.title}
                            })}
                            tags={noDuplicate(state.allTags).map(t => {
                                return {title: t}
                            })}
                        />
                    </TabPanel>
                    <TabPanel value={state.selectedTab} index={2}>
                        <SuggestionManager/>
                    </TabPanel>
                </Box>
                <div>
                    <Modal
                        open={isCreateModalOpen}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        className={classes.modal}
                        onEscapeKeyDown={handleCloseCreateMovie}
                    >
                        <div className={classes.paper}>
                            <CreateMovie closeModal={handleCloseCreateMovie} personLoggedIn={personLoggedIn} tags={state.allTags}/>
                        </div>
                    </Modal>
                </div>
                <AmplifySignOut/>
            </Container>
        )
}

export default withAuthenticator(Bistro);
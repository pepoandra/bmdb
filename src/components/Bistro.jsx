import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, FormLabel, InputAdornment, Link, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import {API} from "aws-amplify";
import {listMovies} from "../graphql/queries";
import {displayVerticalSpace} from "../helpers/helpers";
import Chip from '@material-ui/core/Chip';

import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

const personLoggedIn = 'Seb'

export function Bistro () {
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState('')
    const [rating, setRating] = useState(0)
    const [tags, setTags] = useState([])
    const [watchers, setWatchers] = useState([])
    const [newTag, setNewTag] = useState('')
    const [thoughts, setThoughts] = useState('')

    useEffect(() => {
        fetchMovies()
    }, [])
    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        await setMovies(apiData.data.listMovies.items)
        if(apiData.data.listMovies.items.length > 0) setMovieWithTags(apiData.data.listMovies.items[0].title)

    }
    async function setMovieWithTags(title) {
        setSelectedMovie(title)
        const movie = movies.find(m => m.title === title)
        if(movie){
            await setTags(movie.tags)
            await setRating(movie[`rate${personLoggedIn}`])
            await setWatchers(movie.watchedBy)
            await setThoughts(movie.thoughts)
        }
    }

    function saveMovie() {
        const actualMovie = movies.find(m => m.title === selectedMovie)
        const newMovie = {
            watchedBy: watchers,
            [`rate${personLoggedIn}`]: rating,
            thoughts: thoughts,
            tags: tags
        }
        alert(JSON.stringify(actualMovie))
        alert(JSON.stringify(newMovie))
    }
    function isNameChecked(name) {
        return watchers.includes(name)
    }

    async function handleChangeWatchers(name){
        if(isNameChecked(name)){
            await setWatchers(watchers.filter(w => w !== name))
        } else {
            await setWatchers(watchers.concat([name]))
        }
    }
    function handleDeleteTag(event){
        setTags(tags.filter(t => t !== event.currentTarget.id))
    }
    function handleAddTag() {
        if(newTag) setTags(tags.concat(newTag))
        setNewTag('')
    }
    function handleChangeTag(event) {
        setNewTag(event.target.value)
    }
    function handleRatingChange (event) {
        let value = 0;
        if(event.target.value > 0 ){
            value = event.target.value > 10? 10 : event.target.value.replace(/^0+/, '')
        }
        setRating(value)
    }
    function handleThoughtsChange (event) {
        setRating(event.target.value)
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
        const event = movies.find(m => m.title === title)
        if (!event) return
        return <Card className={'bistroMovieCard'}>
            <CardHeader
                title={selectedMovie}
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
                            value={rating}
                            inputProps={{ min: "0", max: "10", step: "0.5"}}
                            InputProps={{ endAdornment:<InputAdornment position="end">/10</InputAdornment>}}
                        />
                        {displayVerticalSpace(25)}
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
                            value={newTag}
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
                            {tags.map(t => {
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
        return (<ListItem button onClick={() => setSelectedMovie((movie.title))}>
            <ListItemText  primary={movie.title} />
        </ListItem>)
    }
    return (
        <Container maxWidth="md">
            <Typography variant={'h2'}>{personLoggedIn}</Typography>
            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <List component="nav" aria-label="main mailbox folders" style={{maxHeight: '50vw', overflow: 'auto'}}>
                            {movies.map(generateMovieItem)}
                        </List>
                    </Grid>
                    <Grid item xs={8}>
                        {displayMovie(selectedMovie)}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}


import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, InputAdornment, TextField} from "@material-ui/core";
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
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}
const mockTags = ['these', 'are', 'fake', 'tags']
export function Bistro () {
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState('')
    const [rating, setRating] = useState(0)
    const [tags, setTags] = useState(mockTags)
    const [newTag, setNewTag] = useState('')

    useEffect(() => {
        fetchMovies()
    }, [])
    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        await setMovies(apiData.data.listMovies.items)
        setSelectedMovie(apiData.data.listMovies.items[0].title)
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
                            defaultValue={'what we thought of the movie as a group'}
                        />
                        {displayVerticalSpace(25)}

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
                        {displayVerticalSpace(15)}
                        <Button fullWidth variant="contained" color="primary">
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
            <Box my={12}>
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



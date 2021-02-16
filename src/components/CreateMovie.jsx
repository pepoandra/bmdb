import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, FormLabel, InputAdornment, Link, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import {displayVerticalSpace} from "../helpers/helpers";
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {NAMES} from "../helpers/constants";


const personLoggedIn = 'Seb'
const initialState = {
    movies: [],
    title: '',
    rating: 0,
    tags: [],
    newTag: '',
    watchers: [],
    thoughts: '',
    isCreateModalOpen: false,
    corkedBy: '',
    pickedBy: '',
}

export function CreateMovie () {
    const [state, setState] = useState(initialState)

    async function handleChangeWatchers(name){
        if(isNameChecked(name)){
            await setState({...state, watchers: state.watchers.filter(w => w !== name) })
        } else {
            await setState({...state, watchers: state.watchers.concat([name]) })
        }
    }
    function isNameChecked(name) {
        return state.watchers.includes(name)
    }
    function selectCorker(event, value) {
        setState({...state, corkedBy: value.title})
    }
    function selectPicker(event, value) {
        setState({...state, pickedBy: value.title})
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


    function handleChangeTag(event) {
        setState({...state, newTag: event.target.value})
    }
    function saveMovie() {
        const newMovie = {
            title: state.title,
            watchedBy: state.watchers,
            pickedBy: state.pickedBy,
            corkedBy: state.corkedBy,
            [`rate${personLoggedIn}`]: state.rating,
            thoughts: state.thoughts,
            tags: state.tags
        }
        alert(JSON.stringify(newMovie))
    }
    function handleRatingChange (event) {
        let value = 0;
        if(event.target.value > 0 ){
            value = event.target.value > 10? 10 : event.target.value.replace(/^0+/, '')
        }
        setState({...state, rating: value})
    }
    function handleTitleChange(event) {
        setState({...state, title: event.target.value})
    }
    function handleDeleteTag(event){
        setState({...state, tags: state.tags.filter(t => t !== event.currentTarget.id)})
    }
    function handleAddTag() {
        if(state.newTag) setState({...state, newTag: '', tags: state.tags.concat(state.newTag) })
    }
    function handleThoughtsChange (event) {
        setState({...state, thoughts: event.target.value})
    }
    const options = NAMES.map(n => {
            return {
                title: n,
            }
        })

    return <Card className={'createMovieCard'}>
        <CardHeader
            title={'Bistro Movies'}
            subheader={'Presents '}
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
                        onChange={selectCorker}
                        clearOnEscape
                        includeInputInList
                        renderInput={(params) => <TextField {...params} label="Corked by" margin="normal" />}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={5}>
                    <Autocomplete
                        options={options}
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
                    {displayVerticalSpace(10)}
                    <TextField
                        id="thoughts"
                        label="Bistro thoughts"
                        multiline
                        fullWidth
                        onChange={handleThoughtsChange}
                        rows={4}
                        variant="outlined"
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
                <Grid item xs={2}>
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
                    <Button onClick={saveMovie} fullWidth variant="contained" color="primary">
                        Save
                    </Button>
                </Grid>
                {displayVerticalSpace(10)}
                <Divider />
                {displayVerticalSpace(10)}
            </Grid>
        </CardContent>
    </Card>
}


import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, TextField, Typography} from "@material-ui/core";
import logo from '../box.png';
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import {displayVerticalSpace} from "../helpers/helpers"; // Tell webpack this JS file uses this image
import { listSuggestions} from '../graphql/queries'
import { createSuggestion } from "../graphql/mutations";
import { API, graphqlOperation } from 'aws-amplify'

export function Suggestions () {
    const [name, setName] = useState('')
    const [movie, setMovie] = useState('')
    const [description, setDescription] = useState('')
    const [suggestions, setSuggestions] = useState([])
    useEffect(() => {
        fetchSuggestions()
    }, [])
    async function fetchSuggestions () {
        const apiData = await API.graphql({ query: listSuggestions })
        await setSuggestions(apiData.data.listSuggestions.items)
    }

    function handleFieldChange(event) {
        switch (event.target.id) {
            case 'name':
                setName(event.target.value)
                break
            case 'movie':
                setMovie(event.target.value)
                break
            case 'description':
                setDescription(event.target.value)
            default:
                break
        }
    }
    async function addSuggestion(){
        if(!movie) return;
        const newSuggestion = {
            name: name,
            movie: movie,
            description: description,
        }
        setSuggestions(suggestions.concat([newSuggestion]))
        try {
            await API.graphql(graphqlOperation(createSuggestion, {input: newSuggestion}))
        } catch (err) {
            alert(JSON.stringify(err.stack))
        }
    }
    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <img src={logo} alt="Logo" className={'cork'}/>
                                }
                                titleTypographyProps={{variant: 'h5'}}
                                title={'You know better than I'}
                                subheader={`Tell us what should we watch next`}
                            />
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <TextField  fullWidth id="name" label="Your name" onChange={handleFieldChange} />
                                    </Grid>
                                    <Grid item xs={2}>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField fullWidth id="movie" label="Movie name" onChange={handleFieldChange} />
                                        {displayVerticalSpace(8)}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="description"
                                            label="What's up with this movie?"
                                            multiline
                                            fullWidth
                                            rows={4}
                                            variant="outlined"
                                            onChange={handleFieldChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {displayVerticalSpace(8)}
                                        <Button fullWidth onClick={addSuggestion} variant="contained" color="primary">
                                            Suggest
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    {suggestions.map(s => {
                        return <Grid item xs={12}>
                            <div>
                                {displayVerticalSpace(20)}
                            <Card>
                                <CardHeader
                                    titleTypographyProps={{variant: 'h5'}}
                                    title={s.movie}
                                    subheader={s.name}
                                />
                                <CardContent>
                                    <Typography>{s.description}</Typography>
                                </CardContent>
                            </Card>
                            </div>
                        </Grid>
                    })}
                </Grid>
            </Box>
        </Container>
    )
}



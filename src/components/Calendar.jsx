 import React, { useState, useEffect } from 'react'
import '../App.css'
import {API, graphqlOperation} from 'aws-amplify'
import { listMovies, listPersons } from '../graphql/queries'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Button from '@material-ui/core/Button';
import Dialog  from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';import Grid from '@material-ui/core/Grid';
import {displayVerticalSpace} from "../helpers/helpers";
import Chip from "@material-ui/core/Chip";
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('e8bb48788d1a95090608148c98ab71d5')
import cork from '../cork.png';
import movieImg from '../movie.jpg';
import {NAMES} from "../helpers/constants";
import Divider from "@material-ui/core/Divider";
const localizer = momentLocalizer(moment)
const HOUR_OFFSET = 0;
import Carousel from 'react-material-ui-carousel'
import {Paper} from '@material-ui/core'
import ReactCountryFlag from "react-country-flag"

 function CalendarComponent () {
    const [movies, setMovies] = useState([])
    const [persons, setPersons] = useState([])

    const [selectedMovie, setSelectedMovie] = useState('')

    const [overview, setOverview] = useState('')
    const [movieImages, setMovieImages] = useState([])
    const [country, setCountry] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false)

    function openModal () {
        setIsOpen(true)
    }


    function getMovieInfo (title) {
        moviedb.searchMovie({ query: title.split('(')[0], language: 'en' })
            .then(res => {
                setOverview(res.results[0].overview)
                setMovieImages([res.results[0].poster_path, res.results[0].backdrop_path])
                setCountry(res.results[0].original_language)
            })
            .catch(console.error)
    }

    function closeModal () {
        setIsOpen(false)
    }
    useEffect(() => {
        fetchMovies()
        fetchPersons()
    }, [])

    function setHours (d) {
        d.setHours(d.getHours() + HOUR_OFFSET)
        return d
    }
    async function handleEventClick (event) {
        await setSelectedMovie(event.title)
        getMovieInfo(event.title)
        const person = persons.find(p => p.id === event.person)
        openModal()
    }
    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        const fetchedMovies = apiData.data.listMovies.items;
        await setMovies(fetchedMovies.filter(n => !n._deleted ))
    }
    async function fetchPersons () {
        const apiData = await API.graphql({ query: listPersons })
        setPersons(apiData.data.listPersons.items)
    }

    function getBistroAverageRating(movie) {
        let sum = 0, count = 0;
        NAMES.map(n => {
            if( movie[`rate${n}`]){
                sum += movie[`rate${n}`]
                count += 1
            }
        })
        if(count === 0) return;
        const avg = sum / count
        let backgroundColor = avg  < 4 ? 'red' : 'gray'
        backgroundColor = avg > 6? 'green' : backgroundColor
        const avatarStyles = {
            height: '45px',
            width: '45px',
            backgroundColor
        }

        return <Avatar style={avatarStyles}>
            {avg}
        </Avatar>

    }
    function showDescription (title) {
        const event = movies.find(m => m.title === title)
        if (!event) return
/*
                    <ReactCountryFlag
                        className="emojiFlag"
                        countryCode={country.toUpperCase()}
                        style={{
                            fontSize: '2em',
                            lineHeight: '2em',
                        }}
                    />
 */
        return <Card>
            <Grid container>
                <Grid item xs={6}>
                    <CardHeader
                        avatar={getBistroAverageRating(event)}
                        title={selectedMovie}
                        titleTypographyProps={{
                        variant: 'h4'
                        }}
                    />
                    <div className={'tags'}>
                        {event.tags.map(t => {
                            return <div className={'chips'}>
                                <Chip
                                    label={t}
                                    color="primary"
                                />
                            </div>
                        })}
                    </div>
                </Grid>
                <Grid item xs={5}>
                    {displayVerticalSpace(15)}
                    <Grid container>
                        <Grid item xs={2}>
                            <img src={cork} alt="Logo" className={'minicork'}/>
                        </Grid>
                        <Grid item xs={4}>
                            {displayVerticalSpace(10)}
                            <Typography> {event.corkedBy} </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <img src={movieImg} alt="Logo" className={'minicork'}/>
                        </Grid>
                        <Grid item xs={4}>
                            {displayVerticalSpace(10)}
                            <Typography align={'center'}>{event.pickedBy} </Typography>
                        </Grid>
                        {NAMES.map(n => {
                            if(!event[`rate${n}`]) return;
                            const rate = event[`rate${n}`]
                            return <Grid item xs={5}>
                                <Typography align={'right'}>{`${n}: ${rate}`}</Typography>
                            </Grid>
                        })}
                    </Grid>
                </Grid>
            </Grid>
            <CardContent>
                <Divider/>
                {displayVerticalSpace(10)}
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>{event.thoughts}</Typography>
                        {displayVerticalSpace(15)}
                    </Grid>
                    {displayVerticalSpace(15)}
                    <Grid item xs={12}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography>What the internet says</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {overview}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        {displayVerticalSpace(15)}
                    </Grid>
                    <Grid item xs={12}>
                        <Carousel>
                            {movieImages.map((img, ind) => {
                                const className = ind === 0? 'portrait' : 'landscape'
                                return <Paper className={'paperImage'}>
                                    <CardMedia
                                        className={className}
                                        component="img"
                                        image={`https://image.tmdb.org/t/p/original/${img}`}
                                    />
                                </Paper>
                            })}
                        </Carousel>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    }
    const dialogPaper = {
        minHeight: '50vh',
        maxHeight: '90vh',
    }

    return (
        <div className="App">
            <div>
                <Calendar
                    localizer={localizer}
                    events={movies.map((m, id) => {
                return {
                    id,
                    start: setHours(new Date(m.date)),
                    end: setHours(new Date(m.date)),
                    ...m,
                }
                    })}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={event => handleEventClick(event)}
                    style={{ height: 800 }}
                    popup
                />
            </div>
            <Dialog
                fullWidth={false}
                maxWidth={'sm'}
                scroll={'paper'}
                classes={{dialogPaper}}
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="max-width-dialog-title"
            >
                {showDescription(selectedMovie)}
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export { CalendarComponent }

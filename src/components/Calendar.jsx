 import React, { useState, useEffect } from 'react'
import '../App.css'
import '../../node_modules/flag-icon-css/css/flag-icon.css'
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
import Slider from '@material-ui/core/Slider';


 function CalendarComponent () {
    const [movies, setMovies] = useState([])
    const [persons, setPersons] = useState([])

    const [selectedMovie, setSelectedMovie] = useState('')

    const [overview, setOverview] = useState('')
    const [movieImages, setMovieImages] = useState([])
    const [country, setCountry] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false)

    function selectNextMovie() {
        const idx = movies.findIndex(m => m.title === selectedMovie);
        if (idx === movies.length - 1) return
        handleEventClick(movies[idx + 1])
    }
    function selectPrevMovie() {
        const idx = movies.findIndex(m => m.title === selectedMovie);
        if (idx === 0) return
        handleEventClick(movies[idx - 1])
    }
     async function handleEventClick (event) {
         await setSelectedMovie(event.title)
         getMovieInfo(event.title)
         openModal()
     }
    function openModal () {
        setIsOpen(true)
    }
    // Turns out that just searching for the movie title we save
    // will not always return the right movie in the first position,
    // so this function deals with the special cases
    function handleExceptions(movieTitle) {
        switch (movieTitle){
            case 'Welcome to the South':
                return 1;
            case '1991':
                return 10;
            default:
                return 0;
        }
    }

    function getMovieInfo (title) {
        moviedb.searchMovie({ query: title, language: 'en' })
            .then(res => {
                const idx = handleExceptions(title)
                setOverview(res.results[idx].overview)
                setMovieImages([res.results[idx].poster_path, res.results[idx].backdrop_path])
                moviedb.movieInfo(res.results[idx].id).then(res => {
                    if(res.production_countries && res.production_countries.length > 0) setCountry(JSON.stringify(res.production_countries[0].iso_3166_1))
                })
            })
            .catch(console.error)
    }

    function closeModal () {
        setIsOpen(false)
    }
    useEffect(() => {
        fetchMovies()
    }, [])

    function setHours (d) {
        d.setHours(d.getHours() + HOUR_OFFSET)
        return d
    }

    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        const fetchedMovies = apiData.data.listMovies.items;
        await setMovies(fetchedMovies.filter(n => !n._deleted ).sort((a, b) => b.date - a.date))
    }


    function getFlagAvatar(movie) {
        const avatarStyles = {
            height: '50px',
            width: '60px',
            backgroundColor: 'white'
        }
        if(country.length === 0) return;
        return <Avatar style={avatarStyles}>
            <span style={{fontSize: '50px' }} className={`flag-icon flag-icon-${country.toLowerCase().slice(1, -1)}`}></span>
        </Avatar>
    }
    function getBistroAverage(movie){
        let sum = 0, count = 0;
        NAMES.map(n => {
            if( movie[`rate${n}`]){
                sum += movie[`rate${n}`]
                count += 1
            }
        })
        if(count === 0) return;
        return (sum / count).toFixed(2)
    }
    function getNumberColor(avg) {
        const color = avg < 4 ? 'red' : 'gray';
        return avg > 6? 'green' : color
    }
    function showDescription (title) {
        const event = movies.find(m => m.title === title)
        if (!event) return
        return <Card>
            <Grid container>
                <Grid item xs={6}>
                    <CardHeader
                        avatar={getFlagAvatar(event)}
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
                    <Grid container>
                        <Grid item xs={1}>
                            <img src={cork} alt="Logo" className={'minicork'}/>
                        </Grid>
                        <Grid item xs={4}>
                            {displayVerticalSpace(10)}
                            <Typography> {event.corkedBy} </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <img src={movieImg} alt="Logo" className={'minicork'}/>
                        </Grid>
                        <Grid item xs={4}>
                            {displayVerticalSpace(10)}
                            <Typography align={'left'}>{event.pickedBy} </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {displayVerticalSpace(15)}
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography>Bistro</Typography>
                            <Slider
                                value={getBistroAverage(event)}
                                aria-labelledby="discrete-slider-always"
                                valueLabelDisplay="on"
                                disabled
                                min={0}
                                max={10}
                                style={{width: '90%', color: getNumberColor(getBistroAverage(event))}}
                            />
                        </Grid>
                        {NAMES.map(n => {
                            if(!event[`rate${n}`]) return;
                            const rate = event[`rate${n}`]
                            return <Grid item xs={6}>
                                <Typography>{n}</Typography>
                                <Slider
                                    value={rate}
                                    aria-label={n}
                                    aria-labelledby="discrete-slider-always"
                                    valueLabelDisplay="on"
                                    disabled
                                    min={0}
                                    max={10}
                                    style={{width: '80%', color: getNumberColor(rate) }}
                                />
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
        overflow: 'scroll',
    }
     function arrowPressAction(event){
         if([38, 39].includes(event.keyCode)){
             selectNextMovie()
         }
         if([37, 40].includes(event.keyCode)){
             selectPrevMovie()
         }
         if(event.keyCode === 27){
             closeModal()
         }
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
                fullWidth={true}
                maxWidth={'md'}
                scroll={'body'}
                classes={{dialogPaper}}
                paperProps={{className: 'paperDialog'}}
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="max-width-dialog-title"
                onKeyDown={arrowPressAction}
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

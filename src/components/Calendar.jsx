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
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {displayVerticalSpace} from "../helpers/helpers";
import Chip from "@material-ui/core/Chip";
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('e8bb48788d1a95090608148c98ab71d5')

const localizer = momentLocalizer(moment)
const HOUR_OFFSET = 0;
function CalendarComponent () {
  const [movies, setMovies] = useState([])
  const [persons, setPersons] = useState([])

  const [selectedMovie, setSelectedMovie] = useState('')

  const [overview, setOverview] = useState('')
  const [poster, setPoster] = useState('')

  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal () {
    setIsOpen(true)
  }


  function getMovieInfo (title) {
    moviedb.searchMovie({ query: title.split('(')[0], language: 'en' })
      .then(res => {
        setOverview(res.results[0].overview)
        setPoster(res.results[0].poster_path)
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
      setMovies(apiData.data.listMovies.items)
  }
  async function fetchPersons () {
    const apiData = await API.graphql({ query: listPersons })
    setPersons(apiData.data.listPersons.items)
  }

  function showDescription (title) {
    const event = movies.find(m => m.title === title)
    if (!event) return
    let backgroundColor = event.worst > event.best? '#FF0000' :'#006400'
    backgroundColor = event.worst === event.best? '#C0C0C0': backgroundColor
    const avatarStyles = {
        height: '70px',
        width: '70px',
        backgroundColor }

      return <Card>
        <CardHeader
            avatar={
                <Avatar style={avatarStyles}>
                    {event.pickedBy}
                </Avatar>
            }
            title={selectedMovie}
        />
                <CardContent>
                    <Grid container>
                        <Grid item xs={12}>
                            {`Corked by: ${event.corkedBy}   Picked by: ${event.pickedBy}`}
                        </Grid>
                        <Grid item xs={12}>
                            {`Seb: ${event.rateSeb}   Amy: ${event.rateAmy}   Shane: ${event.rateShane}    Dov: ${event.rateDov}`}
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textPrimary" component="p">
                                {overview}
                            </Typography>
                        </Grid>
                        {displayVerticalSpace(15)}
                        <Grid item xs={12} style={{textAlign: "center"}}>

                        </Grid>
                        {displayVerticalSpace(8)}
                        <Grid item xs={12} style={{textAlign: "center"}}>
                            <CardMedia
                                className={'media'}
                                component="img"
                                image={`https://image.tmdb.org/t/p/original/${poster}`}
                            />
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

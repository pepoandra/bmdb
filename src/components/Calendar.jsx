 import React, { useState, useEffect } from 'react'
import '../App.css'
import { API } from 'aws-amplify'
import { listMovies, listPersons } from '../graphql/queries'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ThumbUpAltTwoToneIcon from '@material-ui/icons/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@material-ui/icons/ThumbDownAltTwoTone';
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('e8bb48788d1a95090608148c98ab71d5')

const localizer = momentLocalizer(moment)

function CalendarComponent () {
  const [movies, setMovies] = useState([])
  const [persons, setPersons] = useState([])

  const [selectedMovie, setSelectedMovie] = useState('')
  const [suggestedBy, setSuggestedBy] = useState('')

  const [overview, setOverview] = useState('')
  const [poster, setPoster] = useState('')

  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal () {
    setIsOpen(true)
  }

  function getMovieInfo (title) {
    moviedb.searchMovie({ query: title.split('(')[0] })
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
    d.setHours(d.getHours() + 5)
    return d
  }
  async function handleEventClick (event) {
    await setSelectedMovie(event.title)
    getMovieInfo(event.title)
    const person = persons.find(p => p.id === event.person)
    if (person) {
      setSuggestedBy(person.name)
    } else {
      setSuggestedBy('idk, lol')
    }
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
  function displayVerticalSpace(margin) {
      return <div style={{ margin }}> </div>;
  }
  function showDescription (title) {
    const event = movies.find(m => m.title === title)
    if (!event) return
    return <Card>
                <Grid container spacing={3}>
                    <Grid item xs={5}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={6}>
                                    <h3>
                                        Picked by: {suggestedBy}
                                    </h3>
                                </Grid>
                                {displayVerticalSpace(15)}
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textPrimary" component="p">
                                        {overview}
                                    </Typography>
                                </Grid>

                                {displayVerticalSpace(15)}
                                <Grid item xs={12} style={{textAlign: "center"}}>
                                    <div>{event.best} <ThumbUpAltTwoToneIcon/>  <ThumbDownAltTwoToneIcon/> {event.worst} </div>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Grid>
                    <Grid item xs={6}>
                        <CardMedia
                            component="img"
                            alt="Contemplative Reptile"
                            image={`https://image.tmdb.org/t/p/original/${poster}`}
                            title="Contemplative Reptile"
                        />
                        {displayVerticalSpace()}
                    </Grid>
                </Grid>
            </Card>
  }

  return (
    <div className="App">
        <div>
            <Calendar
              localizer={localizer}
              events={movies.map((m, id) => {
                return {
                  id,
                  title: m.title,
                  worst: m.worst || 0,
                  best: m.best || 0,
                  start: setHours(new Date(m.date)),
                  end: setHours(new Date(m.date)),
                  person: m.personID
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
            open={modalIsOpen}
            onClose={closeModal}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">{selectedMovie}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {showDescription(selectedMovie)}
                </DialogContentText>
            </DialogContent>
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

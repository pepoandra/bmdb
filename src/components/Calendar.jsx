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
const localizer = momentLocalizer(moment)
const HOUR_OFFSET = 0;
import {ViewMovie} from "./ViewMovie";
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        justifyContent: 'center',
        left: '50%',
        top: '50%',
        outline: 'none',
        border: 'none',
        overflow: 'auto'
    },
    paper: {
        top: '20%',
        border: 'none',
        outline: 'none',
        display: 'relative',
        width: '1000px',
        boxShadow: theme.shadows[5],
    },
}));
function CalendarComponent () {
    const [movies, setMovies] = useState([])

    const [selectedMovie, setSelectedMovie] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false)
    const classes = useStyles();

    function selectPrevMovie() {
        const idx = movies.findIndex(m => m.title === selectedMovie);
        if (idx === movies.length - 1) return
        handleEventClick(movies[idx + 1])
    }
    function selectNextMovie() {
        const idx = movies.findIndex(m => m.title === selectedMovie);
        if (idx === 0) return
        handleEventClick(movies[idx - 1])
    }
    async function handleEventClick (event) {
        await setSelectedMovie(event.title)
        openModal()
    }
    function openModal () {
        setIsOpen(true)
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
        await setMovies(fetchedMovies.filter(n => !n._deleted ).sort((a, b) => new Date(b.date) - new Date(a.date)))
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
                open={false}
                onClose={closeModal}
                aria-labelledby="max-width-dialog-title"
                onKeyDown={arrowPressAction}
            >
                <ViewMovie movie={movies.find(m => m.title === selectedMovie)}/>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Modal
                open={modalIsOpen}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={`${classes.modal}`}
                onEscapeKeyDown={closeModal}
                onKeyDown={arrowPressAction}
            >
                <div className={classes.paper}>
                    <ViewMovie
                        movie={movies.find(m => m.title === selectedMovie)}
                        nextFunction={selectNextMovie}
                        prevFunction={selectPrevMovie}
                        closeFunction={closeModal}
                    />
                </div>
            </Modal>
        </div>
    )
}

export { CalendarComponent }

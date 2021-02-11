import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { listMovies } from './graphql/queries';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import Amplify from 'aws-amplify';
import config from './aws-exports';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('e8bb48788d1a95090608148c98ab71d5')

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});
const localizer = momentLocalizer(moment);

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [overview, setOverview] = useState('');
  const [poster, setPoster] = useState('');


  const [modalIsOpen,setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function getMovieInfo(title) {
    moviedb.searchMovie({ query: title.split('(')[0] })
        .then(res => {
            setOverview(res.results[0].overview);
            setPoster(res.results[0].poster_path);
        })
        .catch(console.error);
  }

  function closeModal(){
    setIsOpen(false);
  }
  useEffect(() => {
    fetchMovies();
  }, []);

  function setHours(d) {
      d.setHours(d.getHours() + 5 );
      return d;
  }
  async function handleEventClick(event) {
      await setSelectedMovie(event.title);
      getMovieInfo(event.title);
      openModal();
  }
  async function fetchMovies() {
    const apiData = await API.graphql({ query: listMovies });
    setMovies(apiData.data.listMovies.items);
  }

  function showDescription(title) {
      const event = movies.find(m => m.title === title);
      if (!event) return;
      return <div>
                <div style={{width :'50%', float: 'left'}}>
                   <ul>
                      <li>
                          {`Title: ${title}`}
                      </li>
                      <li>
                          {`Votes for best: ${event.best}`}
                      </li>
                      <li>
                          {`Votes for worst: ${event.worst}`}
                      </li>
                   </ul>
                  <p style={{margin: '10px'}}>{overview}</p>
                </div>
                <div sstyle={{width :'50%', float: 'right', alignContent: 'center'}}>
                 <img style={{height: '80%', width: '30%'}}src={`https://image.tmdb.org/t/p/original/${poster}`}/>
                </div>
            </div>
  }

  return (
    <div className="App">
      <h1>BMDB.</h1>
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
                  }
              })}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={event => handleEventClick(event)}
              style={{ height: 800 }}
            />
        </div>
        <div>
            <Modal
               isOpen={modalIsOpen}
               contentLabel="BMDB"
               className="Modal"
            >
                {showDescription(selectedMovie)}
                <div class="center">
                    <button onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    </div>
  );
}

export default App;
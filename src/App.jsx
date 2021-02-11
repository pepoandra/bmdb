import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { listMovies } from './graphql/queries';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import Amplify from 'aws-amplify';
import config from './aws-exports';

import 'react-big-calendar/lib/css/react-big-calendar.css';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});
const localizer = momentLocalizer(moment);

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  function setHours(d) {
      d.setHours(d.getHours() + 8 );
      return d;
  }
  async function fetchMovies() {
    const apiData = await API.graphql({ query: listMovies });
    setMovies(apiData.data.listMovies.items);
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
                      start: setHours(new Date(m.date)),
                      end: setHours(new Date(m.date)),
                  }

              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 800 }}
            />
        </div>
    </div>
  );
}

export default App;
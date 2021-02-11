import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
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
                      start: new Date(m.date),
                      end: new Date(m.date),
                  }

              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
        </div>
    </div>
  );
}

export default App;
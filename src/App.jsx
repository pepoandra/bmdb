import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { listMovies } from './graphql/queries';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import Amplify from 'aws-amplify';
import config from './aws-exports';
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
      <h1>Back to just OG code</h1>
        <div>
            <Calendar
              localizer={localizer}
              events={movies.map((m, id) => {
                  return {
                      id,
                      title: m.title,
                      start: m.date,
                      end: m.date,
                  }

              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
        </div>
      <div style={{marginBottom: 30}}>
        {
          movies.map(movie => (
            <div key={movie.id || movie.title}>
              <h2>{movie.title}</h2>
              <p>{JSON.stringify(movie)}</p>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default App;
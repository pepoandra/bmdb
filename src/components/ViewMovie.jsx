import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import cork from "../cork.png";
import {displayVerticalSpace} from "../helpers/helpers";
import Typography from "@material-ui/core/Typography";
import movieImg from "../movie.jpg";
import Slider from "@material-ui/core/Slider";
import {NAMES} from "../helpers/constants";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Carousel from "react-material-ui-carousel";
import {Paper} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import {useEffect, useState} from "react";
const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb('e8bb48788d1a95090608148c98ab71d5')
import '../App.css'

const initialState = {
    overview: '',
    movieImages: [],
}

export function ViewMovie (props) {
    const { movie } = props;
    const [state, setState] = useState(initialState);
    const [country, setCountry] = useState('')

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
    useEffect(() => {
        getMovieInfo(movie.title);
    }, [movie.title])

    function getMovieInfo (title) {
        moviedb.searchMovie({ query: title, language: 'en' })
            .then(res => {
                const idx = handleExceptions(title)
                setState({
                    ...state,
                    overview: res.results[idx].overview,
                    movieImages: [res.results[idx].poster_path, res.results[idx].backdrop_path],
                })
                moviedb.movieInfo(res.results[idx].id).then(resp => {
                    if(resp.production_countries && resp.production_countries.length > 0) {
                        setCountry(
                            JSON.stringify(resp.production_countries[0].iso_3166_1).toLowerCase().slice(1, -1)
                        )
                    }
                })
            })
            .catch(console.error)
    }
    function getFlagAvatar() {
        const avatarStyles = {
            height: '50px',
            width: '75px',
            borderRadius: 0,
            backgroundColor: 'white'
        }
        if(country.length === 0) return;
        return <Avatar style={avatarStyles}>
            <span style={{fontSize: '50px' }} className={`flag-icon flag-icon-${country}`}></span>
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

    const bistroAverage = getBistroAverage(movie)

    return <Card>
        <Grid container>
            <Grid item xs={6}>
                <CardHeader
                    avatar={getFlagAvatar(movie)}
                    title={movie.title}
                    titleTypographyProps={{
                        variant: 'h4'
                    }}
                />
                <div className={'tags'}>
                    {movie.tags.map(t => {
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
                        <Typography> {movie.corkedBy} </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <img src={movieImg} alt="Logo" className={'minicork'}/>
                    </Grid>
                    <Grid item xs={4}>
                        {displayVerticalSpace(10)}
                        <Typography align={'left'}>{movie.pickedBy} </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                {displayVerticalSpace(15)}
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>Bistro</Typography>
                        <Slider
                            value={bistroAverage}
                            aria-labelledby="discrete-slider-always"
                            valueLabelDisplay="on"
                            disabled
                            min={0}
                            max={10}
                            style={{width: '90%', color: getNumberColor(bistroAverage)}}
                        />
                    </Grid>
                    {NAMES.map(n => {
                        if(!movie[`rate${n}`]) return;
                        const rate = movie[`rate${n}`]
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
                    <Typography>{movie.thoughts}</Typography>
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
                                {state.overview}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    {displayVerticalSpace(15)}
                </Grid>
                <Grid item xs={12}>
                    <Carousel>
                        {state.movieImages.map((img, ind) => {
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
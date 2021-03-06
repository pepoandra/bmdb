import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import cork from "../imgs/cork.png";
import bmdb from "../imgs/bmdb.png";
import tmdb from "../imgs/tmdb.png";
import {displayVerticalSpace} from "../helpers/helpers";
import Typography from "@material-ui/core/Typography";
import movieImg from "../imgs/movie.jpg";
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
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import queryString from 'query-string';

const initialState = {
    overview: '',
    movieImages: [],
}

export function ViewMovie (props) {
    const { movie, nextFunction, prevFunction, closeFunction  } = props;
    const [state, setState] = useState(initialState);
    const [country, setCountry] = useState('')
    const [tmdbRating, setTmdbRating] = useState('')

    useEffect(() => {
        getMovieInfo(movie.title);
    }, [movie.title])

    function getQuery(title){
        const q = {
            language: 'en',
            query: title,
        }
        switch (title){
            case 'Joe':
                return {...q, year: 1970 }
            case '1987':
                return {...q, year: 2014 }
            case '1991':
                return {...q, year: 2018 }
            case 'The Firm':
                return {...q, year: 1989 }
            case 'Stand By Me':
                return {...q, year: 1986 }
            case 'Network':
                return {...q, year: 1976 }
            case 'Wild Tales':
                return {...q, year: 2014 }
            case 'Suspiria':
                return {...q, year: 1977}
            case 'Suspiria (2018)':
                return {...q, year: 2018}
            case 'Royal Wedding':
                return {...q, year: 1951}
            case 'Ravenous':
                return {...q, year: 1999}
            case 'House on Haunted Hill':
                return {...q, year: 1959}
            default:
                return q
        }
    }
    function getMovieInfo (title) {
        moviedb.searchMovie(getQuery(title))
            .then(res => {
                setState({
                    ...state,
                    overview: res.results[0].overview,
                    movieImages: [res.results[0].poster_path, res.results[0].backdrop_path],
                })
                moviedb.movieInfo(res.results[0].id).then(resp => {
                    setTmdbRating(resp.vote_average.toString())
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

    function copyTextToClipboard() {
        const text = `http://www.bmdb.site/movies?${queryString.stringify({m : movie.title})}`
        var textArea = document.createElement("textarea");

        // Place in the top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of the white box if rendered for any reason.
        textArea.style.background = 'transparent';

        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
        alert('Copied to clipboard!')
    }
    const bistroAverage = getBistroAverage(movie)
    const ratingAvatarStyles = {
        height: '45px',
        width: '45px',
    }
    return <Card id={'movieViewer'}>
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
                    <Grid item xs={1} style={{marginRight: '10px'}}>
                        <img src={cork} alt="Logo" className={'minicork'}/>
                    </Grid>
                    <Grid item xs={3}>
                        {displayVerticalSpace(10)}
                        <Typography> {movie.corkedBy} </Typography>
                    </Grid>
                    <Grid item xs={1} style={{marginRight: '17px'}}>
                        <img src={movieImg} alt="Logo" className={'minicork'}/>
                    </Grid>
                    <Grid item xs={3}>
                        {displayVerticalSpace(10)}
                        <div style={{alignText: 'left'}}>
                            <Typography >{movie.pickedBy} </Typography>
                        </div>
                    </Grid>
                    <Grid item  xs={8}>
                        {displayVerticalSpace(10)}
                        <div  style={{textAlign: 'center'}}>
                            <Button onClick={copyTextToClipboard}>
                                <ShareIcon/>
                                <Typography >Share! </Typography>
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                {displayVerticalSpace(15)}
                <Grid container>
                    {NAMES.map(n => {
                        if(!movie[`rate${n}`]) return  <Grid item xs={6}>{displayVerticalSpace(55)}</Grid>
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
                    <Grid item xs={2}>
                        {displayVerticalSpace(10)}
                        <img src={bmdb} alt="Logo" className={'bmdb'}/>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{alignText: 'left'}}>
                            <Avatar style={{...ratingAvatarStyles,  backgroundColor: getNumberColor(bistroAverage) }}>{bistroAverage}</Avatar>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        {displayVerticalSpace(10)}
                        <img src={tmdb} alt="Logo" className={'tmdb'}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Avatar style={{...ratingAvatarStyles,  backgroundColor: getNumberColor(tmdbRating) }}>{tmdbRating}</Avatar>
                    </Grid>
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
                            if( !img || img === '') return
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
                <Grid item xs={4}>
                    <div style={{textAlign: 'left'}}>
                        <Button onClick={prevFunction} >
                            <KeyboardArrowLeftIcon/> Prev
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{textAlign: 'center'}}>
                        {closeFunction? <Button onClick={closeFunction} >
                            <CloseIcon/> Close
                        </Button> : null }
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={nextFunction}>
                            Next <KeyboardArrowRightIcon/>
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}
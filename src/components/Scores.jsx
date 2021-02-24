import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box';
import {Card, Container, Table, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import logo from '../imgs/cork.png';
import movieImg from '../imgs/movie.jpg';
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent"; // Tell webpack this JS file uses this image
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import {API} from "aws-amplify";
import {listMovies} from "../graphql/queries";
import {checker, displayVerticalSpace} from "../helpers/helpers";
import {NAMES} from "../helpers/constants";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const initialState = {
    corkMovies: [],
    cinephileMovies: [],
}
function createData(name, sinks, own, points) {
    return { name, sinks, own, points };
}

const rows = [
    createData('Seb', 6, 3, 9),
    createData('Amy', 5, 2, 7),
    createData('Dov', 4, 2, 6),
    createData('Shane', 4, 1, 5),
];

function createDataMovies(name, movies, average, points) {
    return { name, movies, average, points };
}

const movieRows = [
    createDataMovies('Seb', 4, 3, 7),
    createDataMovies('Shane', 3, 4, 7),
    createDataMovies('Amy', 2, 3, 5),
    createDataMovies('Dov', 1, 4, 5),
];

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});
function filterCorkMovies(m) {
    return !m._deleted & NAMES.includes(m.corkedBy) & checker(NAMES, m.watchedBy)
}
function filterCinpehileMovies(m) {
    return !m._deleted & NAMES.includes(m.pickedBy) & checker(NAMES, m.watchedBy)
}

function getCorkScores(movies){
    let points = {}
    NAMES.map(n => {
        points[n] = {
            sinks: 0,
            own: 0,
        };
    })
    movies.map(m => {
        points[m.corkedBy].sinks++
        if(m.corkedBy === m.pickedBy) points[m.corkedBy].own++
    })
    NAMES.map(n => {
        points[n].points = points[n].sinks + points[n].own
    })
    return points
}

function getAverageRating(movie) {
    let sum = 0;
    let count = 0;
    NAMES.map(n => {
        const rate = movie[`rate${n}`]
        if(rate && rate > 0){
            sum += rate
            count += 1
        }
    })
    return count > 0 ? sum / count : 0;
}
function getCinephileScores(movies){
    let points = {}
    NAMES.map(n => {
        points[n] = {
            picks: 0,
            accRatings: 0,
            average: 0,
            points: 0,
        };
    })
    if(movies.length === 0) return points;
    movies.map(m => {
        points[m.pickedBy].picks+=1
        points[m.pickedBy].accRatings += getAverageRating(m)
    })
    NAMES.map(n => {
        points[n].average = points[n].accRatings / points[n].picks
        points[n].points = points[n].picks + points[n].average
    })
    return points
}

export function Scores () {
    const [state, setState] = useState(initialState)

    function getCorkRows(movies) {
        const points = getCorkScores(movies)
        const res = Object.keys(points).map(n => {
            return createData(n, points[n].sinks, points[n].own, points[n].points )
        })
        return  res.sort( (a, b) => b.points - a.points)
    }
    function getCinephileRows(movies) {
        const points = getCinephileScores(movies)
        const res = Object.keys(points).map(n => {
            return createDataMovies(n, points[n].picks, points[n].average.toFixed(2), points[n].points.toFixed(2))
        })
        return  res.sort( (a, b) => b.points - a.points)
    }

    async function fetchMovies () {
        const apiData = await API.graphql({ query: listMovies })
        const fetchedMovies = apiData.data.listMovies.items;
        if(fetchedMovies && fetchedMovies.length > 0){
            const corkMovies = fetchedMovies.filter(filterCorkMovies);
            const cinephileMovies = fetchedMovies.filter(filterCinpehileMovies);
            await setState({...state, corkMovies, cinephileMovies  })
            getCorkScores(corkMovies)

        }
    }

    useEffect(async () => {
        await fetchMovies()
    }, [])
    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Grid container>
                    <Grid item xs={6}>
                        <Card className={'rulesCard'}>
                            <CardHeader
                                avatar={
                                    <img src={logo} alt="Logo" className={'cork'}/>
                                }
                                titleTypographyProps={{variant: 'h5'}}
                                title={'Corking'}
                                subheader={`It's the final corkdown`}
                            />
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Corker</StyledTableCell>
                                                <StyledTableCell align="right">Sinks</StyledTableCell>
                                                <StyledTableCell align="right">Own cup</StyledTableCell>
                                                <StyledTableCell align="right">Points</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getCorkRows(state.corkMovies).map((row) => (
                                                <StyledTableRow key={row.name}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{row.sinks}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.own}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.points}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {displayVerticalSpace(20)}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Rules</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ul>
                                            <li>
                                                <Typography> Each person must present a movie pick for the night.</Typography>
                                            </li>
                                            <li>
                                                <Typography>Each person will have a cup representing their pick.</Typography>
                                                <ul>
                                                    <li>
                                                        One can only claim a specific cup if said cup has one's name engraved on it.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Typography>The DVD of each pick will be placed behind the corresponding cup.</Typography>
                                                <ul>
                                                    <li>
                                                        <Typography> If we do not own the DVD, a stand in must be used.</Typography>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Typography>The Final Countdown (original version or cover) must be playing for a throw to count. If you throw before The Final Countdown comes on it is just practice.</Typography>
                                            </li>
                                            <li>
                                                <Typography> One at a time we throw corks towards the cups with the goal of sinking them inside.</Typography>
                                            </li>
                                            <li>
                                                <Typography>After each round of cork throwing if a cup has corks in it that is the movie we watch.</Typography>
                                                <ul>
                                                    <li>
                                                        <Typography>If more than one cup has corks in it after a round has completed we move to a run-off round between how ever many are left. </Typography>
                                                    </li>
                                                    <li>
                                                        <Typography> If someone has a stand-in DVD and more than three corks have been sunk into their cup, we do not watch their pick, but instead we watch whatever the stand-in is.</Typography>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Points</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ul>
                                            <li>
                                                <Typography>1 point for sinking the cork in the final cup (does not count if the game moves to another round)</Typography>
                                            </li>
                                            <li>
                                                <Typography> 1 extra point for sinking it into your own cup.</Typography>
                                            </li>
                                            <li>
                                                Two or more people can team up and choose the same movie, but the points for the movie will only be awarded to the person who’s cup the cork is in.
                                            </li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card className={'rulesCard'}>
                            <CardHeader
                                avatar={
                                    <img src={movieImg} alt="Logo" className={'cork'}/>
                                }
                                titleTypographyProps={{variant: 'h5'}}
                                title={'Points'}
                                subheader={`Cinephile hall of fame`}
                            />
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Cinephile</StyledTableCell>
                                                <StyledTableCell align="right">Picks</StyledTableCell>
                                                <StyledTableCell align="right">Ratings</StyledTableCell>
                                                <StyledTableCell align="right">Points</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getCinephileRows(state.cinephileMovies).map((row) => (
                                                <StyledTableRow key={row.name}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{row.movies}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.average}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.points}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {displayVerticalSpace(20)}
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Rules</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ol>
                                            <li>
                                                <Typography> After each movie is watched it will be uploaded to the BMDB.</Typography>
                                            </li>
                                            <li>
                                                <Typography> Each member can submit their rating for the movie out of 10.</Typography>
                                                <ul>
                                                    <li>
                                                        <Typography>
                                                            Members can only rate movies they have watched. (Duh)
                                                        </Typography>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Points</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ol>
                                            <li>
                                                <Typography>The average rating of each persons picked are compiled and added to the total number of picks they had each week, giving a point total.</Typography>
                                            </li>
                                            <ul>
                                                <li>
                                                    <Typography>
                                                        A movie has to be watched by all four Bistro members for the average rating to count towards the point total, a movie watched by three or less people can still be uploaded and rated, it just won’t affect the overall scores.

                                                    </Typography>
                                                </li>
                                                <li>
                                                    <Typography>
                                                        If a movie is picked by more than two people, only the person who’s cup had the cork in it gets the points.

                                                    </Typography>
                                                </li>
                                            </ul>
                                            <li>
                                                <Typography>At the end of each month the person with the highest point total gets to either have a guaranteed pick in the next month or decide on a theme week everyone must pick their movies around.</Typography>
                                            </li>
                                        </ol>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}



import React from 'react'
import Box from '@material-ui/core/Box';
import {Card, Container, Table, TableContainer, TableHead, TableRow} from "@material-ui/core";
import logo from '../cork.png';
import movieImg from '../movie.jpg';
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent"; // Tell webpack this JS file uses this image
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

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
export function Scores () {
    return (
        <Container maxWidth="lg">
            <Box my={12}>
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
                                            {rows.map((row) => (
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
                                                <StyledTableCell align="right">Movies picked</StyledTableCell>
                                                <StyledTableCell align="right">Average rating</StyledTableCell>
                                                <StyledTableCell align="right">Points</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {movieRows.map((row) => (
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
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}



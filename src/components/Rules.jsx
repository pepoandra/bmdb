import React from 'react'
import Box from '@material-ui/core/Box';
import {Card, Container, Typography} from "@material-ui/core";
import logo from '../cork.png';
import movieImg from '../movie.jpg';

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent"; // Tell webpack this JS file uses this image
import LocalMoviesOutlinedIcon from '@material-ui/icons/LocalMoviesOutlined';
import FormatListNumberedOutlinedIcon from '@material-ui/icons/FormatListNumberedOutlined';

export function Rules () {
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
                                subheader={`How movies get selected`}
                            />
                            <CardContent>
                                <ol>
                                    <li>
                                        <Typography> Each person chooses a movie</Typography>
                                    </li>
                                    <li>
                                        <Typography>We line up the 4 movies with cups</Typography>
                                    </li>
                                    <li>
                                        <Typography>we each throw corks, one at a time, at the cups</Typography>
                                    </li>
                                    <li>
                                        <Typography>Chosen movie gets watched, even if it got corked by someone other than the picker.</Typography>
                                    </li>
                                    <li>
                                        <Typography>Shall there be a tie, we just keep throwing.</Typography>
                                    </li>
                                </ol>
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
                                subheader={`How points are assigned`}
                            />
                            <CardContent>
                                <ol>
                                    <li>
                                        <Typography>Each person rates the movies</Typography>
                                    </li>
                                    <li>
                                        <Typography>We calculate scores based on # of movies picked & their averages (TBD)</Typography>
                                    </li>
                                    <li>
                                        <Typography>Points are awarded every week</Typography>
                                    </li>
                                    <li>
                                        <Typography>At the end of the month, winner gets to choose a movie (TBD)</Typography>
                                    </li>
                                    <li>
                                        <Typography>Year round winner gets to decide a theme (TBD)</Typography>
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}



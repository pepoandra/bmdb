import React from 'react'
import Box from '@material-ui/core/Box';
import {Card, Container, Typography} from "@material-ui/core";
import cork from '../cork.png';
import movieImg from '../movie.jpg';

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails"; // Tell webpack this JS file uses this image


export function Rules () {
    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Grid container>
                    <Grid item xs={6}>
                        <Card className={'rulesCard'}>
                            <CardHeader
                                avatar={
                                    <img src={cork} alt="Logo" className={'cork'}/>
                                }
                                titleTypographyProps={{variant: 'h5'}}
                                title={'Corking'}
                                subheader={`How movies get selected`}
                            />
                            <CardContent>
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
                                title={'Movie picks'}
                                subheader={`How points are assigned`}
                            />
                            <CardContent>
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



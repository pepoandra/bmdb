import React, {useState, useEffect} from 'react'
import {Container} from "@material-ui/core";
import {API} from "aws-amplify";
import {listLinks, listMovies} from "../graphql/queries";
import { graphqlOperation } from 'aws-amplify';
import ForceGraph3D from 'react-force-graph-3d';
import {NAMES} from "../helpers/constants";
import SpriteText from 'three-spritetext';
import {BLACKLISTED_TAGS} from "../helpers/constants";
import Grid from "@material-ui/core/Grid";
import {displayVerticalSpace} from "../helpers/helpers";


const createLinksFromMovieTags = (movies) => {
    const tagDict = {}
    const graphLinks = []
    const nodesWithLinks = new Set()

    movies.forEach(m => {
        m.tags.forEach(t => {
            if(BLACKLISTED_TAGS.includes(t)){
                return
            }
            if(Array.isArray(tagDict[t])) {
                tagDict[t].push(m.title)
            } else{
                tagDict[t] = [m.title]
            }
        })
    })

    Object.keys(tagDict).forEach(t => {
        for (let i = 0; i < tagDict[t].length - 1; i++) {
            for (let j = i + 1; j < tagDict[t].length; j++) {
                nodesWithLinks.add(tagDict[t][i])
                nodesWithLinks.add(tagDict[t][j])
                graphLinks.push({
                    source: tagDict[t][i],
                    target: tagDict[t][j],
                    curvature: 0.5 * Math.random(),
                    reason: t,
                    value: 9,
                })
            }
        }
    })
    return {graphLinks, nodesWithLinks}
}

export function Flowchart () {
    const [movies, setMovies] = useState([])
    const [links, setLinks] = useState([])
    const [usedNodes, setUsedNodes] = useState(new Set())
    useEffect(async () => {
        await fetchMovies()
        fetchLinks()
    }, [])

    async function fetchLinks () {
        const apiData = await API.graphql(graphqlOperation(listLinks, {limit: 1000}))

        const fetchedLinks = apiData.data.listLinks.items;
        if(fetchedLinks && fetchedLinks.length > 0){
            const cleanLinks = fetchedLinks.filter(n => !n._deleted )
            await setLinks(cleanLinks)
        }
    }
    async function fetchMovies () {
        const apiData = await API.graphql(graphqlOperation(listMovies, {limit: 1000}))
        const fetchedMovies = apiData.data.listMovies.items;
        if(fetchedMovies && fetchedMovies.length > 0){
            const cleanMovies = fetchedMovies.filter(n => !n._deleted ).sort((a, b) => new Date(b.date) - new Date(a.date))
            await setMovies(cleanMovies)
        }
    }

    const { graphLinks, nodesWithLinks } = createLinksFromMovieTags(movies)
    const nodes = movies
        .map(m => {
            return {id: m.title, group: NAMES.findIndex(n => n === m.pickedBy)}
        })
    const data = {
        links: graphLinks.concat(links),
        nodes
    }


    return <Container maxWidth="xl">
        <Grid container align="center">
            {displayVerticalSpace(10)}
            <Grid item xs={12}>
                <ForceGraph3D
                    width={1200}
                    graphData={data}
                    nodeAutoColorBy="group"
                    linkVisibility={true}
                    linkOpacity={0.7}
                    backgroundColor={'white'}
                    linkWidth={1}
                    nodeLabel="id"
                    linkCurvature="curvature"
                    linkThreeObjectExtend={true}
                    linkThreeObject={link => {
                        // extend link with text sprite
                        const sprite = new SpriteText(`${link.reason}`);
                        sprite.color = 'darkgrey';
                        sprite.textHeight = 4;
                        return sprite;
                    }}
                    linkPositionUpdate={(sprite, { start, end }) => {
                        const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
                            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                        })));

                        // Position sprite
                        Object.assign(sprite.position, middlePos);
                    }}
                    nodeThreeObject={node => {
                        const sprite = new SpriteText(node.id);
                        sprite.color = node.color;
                        sprite.textHeight = 8;
                        return sprite;
                    }}
                />
            </Grid>
        </Grid>
    </Container>
}

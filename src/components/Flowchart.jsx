import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box';
import { Container, TextField} from "@material-ui/core";
import {API} from "aws-amplify";
import {listLinks, listMovies} from "../graphql/queries";
import Typography from "@material-ui/core/Typography";
import { graphqlOperation } from 'aws-amplify';
import ForceGraph3D from 'react-force-graph-3d';
import {NAMES} from "../helpers/constants";
import SpriteText from 'three-spritetext';

const initialState = {
    movies: [],
}

const createLinksFromMovieTags = (movies) => {
    const tagDict = {}

    movies.forEach(m => {
        m.tags.forEach(t => {
            if(Array.isArray(tagDict[t])) {
                tagDict[t].push(m.title)
            } else{
                tagDict[t] = [m.title]
            }
        })
    })
    const links = []
    Object.keys(tagDict).forEach(t => {
        for(let i = 0; i < tagDict[t].length - 2; i++){
            for(let k = i; tagDict[t].length -1; k++){
                links.push({
                    source: tagDict[t][i],
                    target: tagDict[t][k],
                    reason: t,
                    value: 9,
                })
            }
        }
    })

    return links
}


export function Flowchart () {
    const [state, setState] = useState(initialState)
    const [links, setLinks] = useState([])
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
            await setState({...state, movies: cleanMovies })
        }
    }
    const nodes = state.movies.map(m => {
        return {id: m.title, group: NAMES.findIndex(n => n === m.pickedBy)}
    })


    const data = {
        links ,
        nodes
    }
    return <Container maxWidth="lg">

        <Box my={2} >
            <ForceGraph3D
                graphData={data}
                nodeAutoColorBy="group"
                height={800}
                linkVisibility={true}
                linkOpacity={0.7}
                backgroundColor={'white'}
                linkWidth={1}
                nodeThreeObject={node => {
                    const sprite = new SpriteText(node.id);
                    sprite.color = node.color;
                    sprite.textHeight = 8;
                    return sprite;
                }}
            />
        </Box>
    </Container>
}

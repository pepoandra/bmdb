import React, { useState } from 'react'
import {Button, Card, Grow, InputAdornment, Paper, TextField} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {displayVerticalSpace} from "../helpers/helpers";
import {API, graphqlOperation} from "aws-amplify";
import {createLink, updateLink} from "../graphql/mutations";
import {Alert} from "@material-ui/lab";


const initialState = {
    reason: '',
    inputReason: '',
    target: '',
    inputTarget: '',
    inputSource: '',
    source: '',
    value: 0,
    savedSuccess: false,
    savedError: false,
    errorMsg: '',
}

export function CreateLink (props) {
    const { movieTitles, tags, closeModal } = props;
    const [state, setState] = useState(initialState)
    function handleValueChange (event) {
        let value = 0;
        if(event.target.value > 0 ){
            value = event.target.value > 10? 10 : event.target.value.replace(/^0+/, '')
        }
        setState({...state, value: value})
    }
    function displayAlert() {
        if(!(state.savedError || state.savedSuccess)) return
        const severity = state.savedSuccess? 'success' : 'error'
        const msg = state.savedSuccess? 'Reply saved!' : state.errorMsg
        return <Paper >
            <Alert variant="filled" severity={severity}>
                {msg}
            </Alert>
        </Paper>
    }

    async function saveLink() {
        const newLink = {
            target: state.target,
            source: state.source,
            value: state.value,
            reason: state.inputReason,
        }

        try {
            const algo = await API.graphql(graphqlOperation(createLink, {input: newLink }))
            alert(JSON.stringify(algo))
            setState({...state, savedSuccess: true})
        } catch (err) {
            alert(JSON.stringify(err.errors[0]))
            setState({...state, savedError: true })
        }
        setTimeout(() => {
            setState({...state, savedSuccess: false, savedError: false})
        }, 7000)

    }
    return <Card className={'bistroMovieCard'}>
        <CardHeader
            title={'Add Link'}
            subheader={"That flowchart won't populate itself"}
        />
        <CardContent>
            <Grid container>
                <Grid item xs={5}>
                    <Autocomplete
                        options={movieTitles}
                        getOptionLabel={(option) => option.title}
                        id="source"
                        onChange={(event, newValue) => {
                            setState({...state, source : newValue.title})
                        }}
                        inputValue={state.inputSource}
                        onInputChange={(event, newInputValue) => {
                            setState({...state, inputSource: newInputValue })
                        }}
                        autoComplete
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Source" margin="normal" />}
                    />
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={5}>
                    <Autocomplete
                        options={movieTitles}
                        getOptionLabel={(option) => option.title}
                        id="source"
                        onChange={(event, newValue) => {
                            // setState({...state, newTag: newValue.title})
                            setState({...state, target : newValue.title})
                        }}
                        inputValue={state.inputTarget}
                        onInputChange={(event, newInputValue) => {
                            setState({...state, inputTarget: newInputValue })
                        }}
                        autoComplete
                        clearOnEscape
                        renderInput={(params) => <TextField {...params} label="Target" margin="normal" />}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Autocomplete
                        options={tags}
                        getOptionLabel={(option) => option.title}
                        id="reason"
                        onChange={(event, newValue) => {
                            // setState({...state, newTag: newValue.title})
                            setState({...state, reason : newValue.title})
                        }}
                        inputValue={state.inputReason}
                        onInputChange={(event, newInputValue) => {
                            setState({...state, inputReason: newInputValue })
                        }}
                        freeSolo
                        renderInput={(params) => <TextField {...params} label="Reason" margin="normal" />}
                    />
                </Grid>
                <Grid item xs={4}/>
                <Grid item xs={3}>
                    <div className={'outerCenterTextField'}>
                        {displayVerticalSpace(17)}
                        <div className={'centerTextField'} >
                            <TextField
                                style={{top: '50%'}}
                                type={'number'}
                                fullWidth
                                id="value"
                                label="Value"
                                onChange={handleValueChange}
                                value={parseFloat(state.value)}
                                inputProps={{ min: "0", max: "10", step: "0.5", style: {margin: 'auto'}}}
                                InputProps={{ endAdornment:<InputAdornment position="end">/10</InputAdornment>}}
                            />
                        </div>
                    </div>
                    {displayVerticalSpace(35)}
                </Grid>
                <Grid item xs={4}>
                    <Button fullWidth onClick={closeModal} variant="contained" color="secondary">
                        Close
                    </Button>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={7}>
                    <Button fullWidth onClick={saveLink} variant="contained" color="primary">
                        Save
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Grow in={state.savedError || state.savedSuccess}>
                        <div>
                            {displayAlert()}
                        </div>
                    </Grow>
                </Grid>
            </Grid>
        </CardContent>
    </Card>


}

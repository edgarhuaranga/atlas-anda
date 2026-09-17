import React, { useState, useEffect } from "react";
import { CssBaseline,  Grid, Radio, RadioGroup, FormControlLabel, FormControl, TextField} from "@mui/material";
import Searcher from "../Searcher/Searcher";
import { getWords, getPhenomena } from "../../api/client";
import Hero from '../Hero/Hero';

const Home = () => {

    const [searchableWords, setSearchableWords] = useState([]);
    const [searchablePhenomns, setSearchablePhenomns] = useState([]);
    const [items, setItems] = useState([]);
    const [phenoms, setPhenoms] = useState([]);
    const [value, setValue] = useState('palabra');

    useEffect(() => {
        getWords().then((words) => {
            const sorted = words.map((w) => w.word).sort();
            setSearchableWords(sorted);
            setItems(sorted);
        });
        getPhenomena().then((phenomena) => {
            const mapped = phenomena.map((p) => ({ k: p.key, w: p.label }));
            setSearchablePhenomns(mapped);
            setPhenoms(mapped);
        });
    }, []);

    const requestSearch = (searchedVal) => {
        const filteredItems = searchableWords.filter((item) => {
            return item.toLowerCase().includes(searchedVal.toLowerCase());
        });
        const filteredPhenoms = searchablePhenomns.filter((item) => {
            return item.w.toLowerCase().includes(searchedVal.toLowerCase());
        });

        setItems(filteredItems);
        setPhenoms(filteredPhenoms);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    }


    return(
        <>
        <CssBaseline enableColorScheme/>
        <Hero/>
        <Grid container fixed mt={2} spacing={3}>
            <Grid container row xs={12}>
                <Grid xs={12} pl={6} sm={6} md={6} mb={3}>
                    <TextField
                            fullWidth
                            onChange={(event) => {
                                requestSearch(event.target.value);
                              }}
                            label="Búsqueda de palabra" variant="standard">
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6} md={6} pl={6}>
                    <FormControl xs={6}>
                        <RadioGroup row aria-labelledby="tipo-mapa" defaultValue="{value}" value={value} onChange={handleChange} name="radio-buttons-group">
                            <FormControlLabel value="palabra" control={<Radio />} label="Palabra" />
                            <FormControlLabel value="fenomeno" control={<Radio />} label="Fenómeno" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid item xs={12} pl={3}>
                {(value === 'palabra') && <Searcher items={items} type={value}/>}
                {(value === 'fenomeno') && <Searcher items={phenoms} type={value}/>}
            </Grid>

        </Grid>
    </>
    )
};

export default Home;

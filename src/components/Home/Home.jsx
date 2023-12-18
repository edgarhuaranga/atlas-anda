import React, { useState } from "react";
import { CssBaseline,  Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField} from "@mui/material";
import Header from "../Header/Header";
import Searcher from "../Searcher/Searcher";
import words from '../Map/words.json'
import phenomenoms from '../../files/phenomenoms.json'
import Hero from '../Hero/Hero';

const Home = () => {
    
    const searchableWords = words.map((value, key)=>{
        return value.word;
    });

    console.log("+++++++++++++");
    searchableWords.sort();
    

    const searchablePhenomns = phenomenoms.map((value, key) => {
        return {"k": value.key, "w":value.word};
    });

    const [items, setItems] = useState(searchableWords);
    const [phenoms, setPhenoms] = useState(searchablePhenomns);
    const [value, setValue] = useState('palabra');

    const requestSearch = (searchedVal) => {
        const filteredItems = searchableWords.filter((item) => { 
            return item.toLowerCase().includes(searchedVal.toLowerCase());
        });
        
        const filteredPhenoms = searchablePhenomns.filter((item) => { 
            return item.w.toLowerCase().includes(searchedVal.toLowerCase()); 
        });
        
        setItems(filteredItems);
        setPhenoms(filteredPhenoms);
        console.log(phenoms);
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
                                console.log(event.target.value);
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
import React, { useState } from "react";
import { CssBaseline,  Grid, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField} from "@mui/material";
import Header from "../Header/Header";
import Searcher from "../Searcher/Searcher";
import words from '../Map/words.json'


const Home = () => {
    const searchableWords = words.map((value, key)=>{
        return value.word;
    });

    const [items, setItems] = useState(searchableWords);


    const requestSearch = (searchedVal) => {
            const filteredItems = searchableWords.filter((item) => {
            return item.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setItems(filteredItems);
        console.log(searchedVal);
        console.log(items);
    };

    const cancelSearch = () => {
        //setSearched("");
        //requestSearch(searched);
    };

    
    const [value, setValue] = useState('palabra');
    return(
        <>
        <CssBaseline />
        <Header />
        
        <Grid container fixed mt={2} spacing={3}>
            <Grid container row xs={12} sx={{border: '3px green solid' }}>
                <Grid xs={12} pl={6} sm={6} md={6}>
                    <FormControl xs={6}>
                        <TextField
                            onChange={(event) => {
                                console.log(event.target.value);
                                requestSearch(event.target.value);
                              }}
                            label="Búsqueda de palabra" variant="standard">
                            
                        </TextField>
                        {/* <SearchBar
                            value={searched}
                            onChange={(searchVal) => requestSearch(searchVal)}
                            onCancelSearch={() => cancelSearch()}
                            placeholder="Busca la palabra"
                        />         */}
                    </FormControl>
                    
                </Grid>
                <Grid xs={12} sm={6} md={6} pl={3}>
                    <FormControl xs={6}>
                        <FormLabel id="tipo-mapa">Tipo de atlas</FormLabel>
                        <RadioGroup row aria-labelledby="tipo-mapa" defaultValue="palabra" name="radio-buttons-group">
                        <FormControlLabel value="palabra" control={<Radio />} label="Palabra" />
                            <FormControlLabel value="fenomeno" control={<Radio />} label="Fenómeno" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            
            <Grid item xs={12} pl={3}>
                <Searcher items={items}/>
            </Grid>
            
        </Grid>
    </>
    )
};

export default Home;
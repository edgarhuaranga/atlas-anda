import axios from "axios";

const URL = "https://raw.githubusercontent.com/edgarhuaranga/aliaa/main/codes/small_data.json";

export default {
    getData: () =>
    axios({
        'method':'GET',
        'url':URL
    })
}
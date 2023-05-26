import axios from 'axios'
//const WEATHER_REST_API_URL = 'https://api-weather-app.herokuapp.com/api'
const WEATHER_REST_API_URL = 'http://localhost:8080/api'
const WEATHER_CLASSIFY_API_URL = 'http://127.0.0.1:8000/api/v1/'
const WEATHER_PREDICT_API_URL = 'http://127.0.0.1:8000/api/v2/6'
const CHATBOT_API_URL = 'http://127.0.0.1:8000/api/v3/'

class UserService {     
    getLatestRecord() {
        return axios.get(WEATHER_REST_API_URL + '/getLatest');
    }
    addLatest(){
        return axios.get(WEATHER_REST_API_URL + '/addLatest');
    }
    getRecordList() {
        return axios.get(WEATHER_REST_API_URL + '/getDiagramRecords');
    }
    getPredictNextHour() {
        return axios.get(WEATHER_PREDICT_API_URL);
    }

    async ensampleClassify(temp, speed, pres, humid, rain, vis, clou) {
        let param_json = JSON.stringify({
            "temperature": temp,
            "wind_speed": speed,
            "pressure": pres,
            "humidity": humid,
            "rain": rain,
            "vis_km": vis,
            "cloud": clou
        });
        return fetch(WEATHER_CLASSIFY_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: param_json,
                redirect: 'follow'
            })
            .then(res => res.json())
            .then(response => {
                // console.log('Success:', JSON.stringify(response));
                return response;
            })
            .catch(error => console.error('Error here:', error))
    }

    async _chatbotHelper(place) {
        if (localStorage.getItem(place) == null) {
            const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
            if (place === "Ho Chi Minh City") {
                let data = null;
                //const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${place}`;
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${API_KEY}`
                return axios
                    .get(url)
                    .then(async(response) => {
                        data = response.data;
                        return this
                            .getLatestRecord()
                            .then(async(response) => {
                                let humidity = response.data.humidity;
                                let pressure = data.main.pressure;
                                let wind_speed = data.wind.speed;
                                let temp = response.data.temperature;
                                let visibility = data.visibility;
                                let clouds = data.clouds.all;
                                let rain = data.rain["1h"];

                                const result = await this.ensampleClassify(temp, wind_speed, pressure, humidity, visibility, clouds, rain);
                                localStorage.setItem(place, JSON.stringify({"temp": temp, "humidity": humidity, "wind_speed": wind_speed, "classify": result.Condition}));
                                //DEBUG console.log(localStorage);
                                return data;
                            })
                            .catch((err) => {
                                console.err(err);
                            });
                    })

            } else {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${API_KEY}`
                //const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${place}`;
                return axios
                    .get(url)
                    .then(async(response) => {
                        let data = response.data;
                        let humidity = data.main.humidity;
                        let pressure = data.main.pressure;
                        let wind_speed = data.wind.speed;
                        let temp = data.main.feels_like;
                        //let temp = data.main.temp;
                        let visibility = data.visibility;
                        let clouds = data.clouds.all;
                        let rain = data.rain["1h"];
                        const result = await this.ensampleClassify(temp, wind_speed, pressure, humidity, visibility, clouds, rain);
                        localStorage.setItem(place, JSON.stringify({"temp": temp, "humidity": humidity, "wind_speed": wind_speed, "classify": result.Condition}));
                        //DEBUG console.log(localStorage);
                        return data;
                    })
            }
        }
    }


    async getChatbotReponse(user_input) {
        return axios
            .post(CHATBOT_API_URL, {"input": user_input})
            .then(async(response) => {
                let raw_bot_response = response.data.response;
                //DEBUG console.log(raw_bot_response);
                let place = null;
                let time = null;
                let bot_response = raw_bot_response;
                if (raw_bot_response.includes("%") || raw_bot_response.includes("$")) {
                    place = 'Ho Chi Minh City';
                    time = 'now';
                }

                // need to get the place and time in order to determine temperature, humidity
                // weather condition
                let place_regexp = RegExp("(?<=%%)([A-Za-z ]+)(?=%%)");
                if (raw_bot_response.match(place_regexp) != null) {
                    place = raw_bot_response.match(place_regexp)[0];
                }

                let time_regexp = RegExp("(?<=@@)([A-Za-z0-9 ]+)(?=@@)");
                if (raw_bot_response.match(time_regexp) != null) {
                    time = raw_bot_response.match(time_regexp)[0];
                }

                // DEBUG console.log(`Place: ${place}, Time: ${time}`); do something to get all
                // the data or just a few neccessary stuff for user that
                if (place != null) {
                    await this._chatbotHelper(place);
                    let data = JSON.parse(localStorage.getItem(place))
                    let temp = data["temp"]
                    let humidity = data["humidity"]
                    let wt_cond = data["classify"]
                    let item = null
                    let wind_speed = data["wind_speed"]
                    if (wt_cond === 'Có mây') {
                        item = 'camera'
                        wt_cond = 'Cloud'
                    } else if (wt_cond === 'Trời nắng') {
                        item = 'sunglasses'
                        wt_cond = 'Sunny'
                    } else if (wt_cond === 'Trời mưa') {
                        item = 'umbrella'
                        wt_cond = 'Rainy'
                    } else if (wt_cond === 'Trong lành') {
                        item = 'bottle of water'
                        wt_cond = 'Clear'
                    }
                    // ask about different feature such as temp, humidity, wind speed and the
                    // response from chatbot is !!feature!! $$value$$
                    let feature_regexp = RegExp("(?<=!!)([A-Za-z0-9 ]+)(?=!!)")
                    let feature = ""
                    if (raw_bot_response.match(feature_regexp) != null) {
                        feature = raw_bot_response.match(feature_regexp)[0]
                    }
                    let value = 0
                    if (feature === "temperature") {
                        value = temp
                    } else if (feature === "humidity") {
                        value = humidity
                    } else if (feature === "wind speed") {
                        value = wind_speed
                    }

                    bot_response = bot_response
                        .replaceAll("$$wt_cond$$", wt_cond)
                        .replaceAll("$$item$$", item)
                        .replaceAll("$$temp$$", temp)
                        .replaceAll("$$value$$", value)
                        .replaceAll("@@", "")
                        .replaceAll("!!", "")
                        .replaceAll("%%", "")
                        .replaceAll("$$", "")
                    //DEBUG console.log(bot_response)
                    return bot_response
                } else {
                    return bot_response
                }
            });
    }
}
export default new UserService();
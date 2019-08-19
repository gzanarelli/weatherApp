const mongoose = require('mongoose');

// citySchema
let Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {
    type: String
  },
  weather: {
    type: String
  },
  img: {
    type: String
  },
  min: {
    type: Number
  },
  max: {
    type: Number
  },
  iduser: {
    type: [String]
  },
  lon: {
    type: Number
  },
  lat: {
    type: Number
  }
});

  //           name: cityName,
  //           weather: body.weather[0] && body.weather[0].description,
  //           img: `http://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png`,
  //           min: Math.ceil(body.main.temp_min),
  //           max: Math.ceil(body.main.temp_max),
  //           lon: body.coord.lon,
  //           lat: body.coord.lat,
  //           iduser: req.session.user._id

module.exports = mongoose.model('cities', citySchema);
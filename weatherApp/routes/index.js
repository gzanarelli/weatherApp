const express = require('express');
const router = express.Router();
const request = require('request');
const citiesModel = require('../models/city');


// Sort object's tab by order alpha
// To modify for db
const sortTab = (data) => {
  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data.length; j++) {
      if (data[i].city < data[j].city) {
        let c = data[i];
        data[i] = data[j];
        data[j] = c;
      }
    }
  }
  return data;
}

/* GET login page. */
router.get('/', function(req, res) {
  res.render('login');
})

//  l'id est dans req.session.user.iduser GRIOS CONNARD DE MERDE !!!!l

/* GET cities page. */
router.get('/cities', function(req, res) {
  if (!req.session.user)
    res.redirect('/');
  console.log(req.session.user);
  citiesModel.find({ iduser: req.session.user._id }, function(err, doc) {
    console.log(doc);
  res.render('index', { data: doc, user: req.session.user});
  })
});



/* POST add city */
router.post('/add-city', function(req, res) {
  
  let cityName = req.body.city;
  
  // Check city's name is not null
  if (cityName) {
    // City's name in lower case and the first char in upper case
    cityName = cityName[0].toUpperCase() + cityName.slice(1, cityName.length).toLowerCase();

    // Check if city exist already in the DB
    citiesModel.findOne({name : cityName}, async function(err, data) {
      console.log(data);
      console.log('Id de l utilisateur: ' + req.session.user._id);
      if (!data) {
        request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fr&appid=2d4074e4c5a52d891dcd5dbb2cd6519e`, async function(error, response, body) {
          body = JSON.parse(body);
          let city = await new citiesModel({
            name: cityName,
            weather: body.weather[0] && body.weather[0].description,
            img: `http://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png`,
            min: Math.ceil(body.main.temp_min),
            max: Math.ceil(body.main.temp_max),
            lon: body.coord.lon,
            lat: body.coord.lat,
            iduser: req.session.user._id
          });
        city.save( await function(err, data){
            if (err) console.log(err);
            res.redirect('/cities');
          });
        })
      }
      else if (data.name === cityName && data.iduser !== req.session.user._id) {
        console.log('Before add id: ' + data);
        citiesModel.findOneAndUpdate({_id : data._id}, {$push: { iduser: req.session.user._id }}, {new: true}, function(err, data) {
          console.log(data);
        });
        // data.iduser[data.iduser.length] = req.session.user._id;
        res.redirect('/cities');
      }
      else
        res.redirect('/cities');
    });
  }
});


/* POST delete city */
router.post('/delete-city', async function(req, res) {
  await citiesModel.findByIdAndUpdate({ _id: req.body.id }, {$pull: { iduser: req.session.user._id }}, function(err) {
    if (err) console.log(err);
    res.redirect('/cities');
  });
});

/* Get refresh cities */
router.post('/refresh-city', async function(req, res) {
  await citiesModel.find({ iduser: req.session.user._id }, function(err, data) {
    if (err) console.log(err);
      for(let i = 0; i < data.length; i++) {
        request(`https://api.openweathermap.org/data/2.5/weather?q=${data[i].name}&units=metric&lang=fr&appid=2d4074e4c5a52d891dcd5dbb2cd6519e`, async function(error, response, body) {
            if (error) console.log(error);
            body = JSON.parse(body);
            await citiesModel.updateOne({name: data[i].name},
              {
                weather: body.weather[0] && body.weather[0].description,
                img: `http://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png`,
                min: Math.ceil(body.main.temp_min),
                max: Math.ceil(body.main.temp_max),
              }, 
              function(err, doc) {
                if (err) console.log(err);
              });
      })
    }
    res.redirect('/cities');
  });
});

module.exports = router;

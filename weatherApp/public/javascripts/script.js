// Remove placeholder when we click on the search bar

document.getElementById('search').addEventListener('focus', function() {
    console.log(document.getElementById('search'));
    document.getElementById('search').removeAttribute('placeholder');
})


// Map interactive
var mymap = L.map('worldmap', 
      {
       center: [48.866667, 2.333333],
       zoom: 4
      }
      );


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);


// Recuperation des infos de lon et lat de chaque ville
var customIcon = L.icon({
    iconUrl: '/images/leaf-green.png',
    shadowUrl: '/images/leaf-shadow.png',
  
    // iconSize:   [38, 95], 
    // shadowSize:  [50, 64], 
    iconSize:   [19, 47], 
    shadowSize:  [25, 32],

    // iconAnchor:  [22, 94], 
    // shadowAnchor: [4, 62],  

    iconAnchor:  [11, 46], 
    shadowAnchor: [2, 31],  
  
    // popupAnchor: [-3, -76]

    popupAnchor: [-1, -38]
});

let data = document.getElementsByClassName('cities');
for (let i = 0; i < data.length; i++) {    
    let lon = data[i].attributes[1].nodeValue;    
    let lat = data[i].attributes[2].nodeValue;    
    let name = data[i].attributes[3].nodeValue;
  
    L.marker([lat, lon], {icon: customIcon}).addTo(mymap).bindPopup(name);
}

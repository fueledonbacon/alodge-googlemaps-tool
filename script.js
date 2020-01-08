class LatLng{

  constructor(lat, long){

    if (!lat || !long)
     throw new Error('Must define a latitude and longitude')

    this.lat = lat
    this.long = long
  }
}

class MapLocation{

  static initMany(inputArr) {

    return inputArr.map((input) => new MapLocation(input))
  }

  constructor({ name, address, lat, long, description = '', icon = '' }){

    this.icon = icon
    this.name = name
    this.address = address
    this.coordinate = new LatLng(lat, long),
    this.description = description
    this.link = new GMapsLink(this.coordinate)
  }

  get infoHTML(){

    return `<strong>${this.name}</strong><br>
    ${this.address}<br>
    <p>${this.description}</p>
    <a href="${this.link.href}">Get Directions</a>`
  }  
}

class GMapsLink{

  constructor(coord){

    if(!(coord instanceof LatLng))
      throw new Error('Location object not of type LatLng')
    this.coordinate = coord
  }

  get href(){

    return `https://www.google.com/maps/search/?api=1&query=${this.coordinate.lat},${this.coordinate.long}`
  }
}

class GMap{

  static example(){

    const map = new GMap({
      id: 'map',
      lat: 41.976816,
      long: -87.659916
    })

    const locations = MapLocation.initMany([
      {
        name: 'Chipotle on Broadway',
        address: '5224 N Broadway St<br> Chicago, IL 60640',
        lat: 41.976816,
        long: -87.659916
      },
      {
        name: 'Chipotle on Belmont',
        address: '1025 W Belmont Ave<br> Chicago, IL 60657',
        lat: 41.939670,
        long: -87.655167
      },
      {
        name: 'Chipotle on Sheridan',
        address: '6600 N Sheridan Rd<br> Chicago, IL 60626',
        lat: 42.002707,
        long: -87.661236
      }
    ])
  
    map.addMarkers(locations)
  }

  constructor({ id, lat, long, mapType = 'ROADMAP', zoom = 13 }){

    this.instance = new google.maps.Map(document.getElementById(id), {
      zoom,
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId[mapType]
    })

    this.infoWindow = new google.maps.InfoWindow({})
    
  }

  addMarkers(locations){

    locations.map((location) => {

      this.addMarker(location)
    })
  }

  addMarker(location){

    const marker = new google.maps.Marker({
			position: new google.maps.LatLng(location.coordinate.lat, location.coordinate.long),
			map: this.instance
    })

    this.addInfoWindowListener(location, marker)
  }

  addInfoWindowListener(location, marker){
    
    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent(location.infoHTML);
      this.infoWindow.open(this.instance, marker);
    });
  }
}

function initMap() {
  GMap.example()
}
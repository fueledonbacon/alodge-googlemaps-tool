


class GMapsLink{

  constructor(location){

    if(!(location instanceof GPSLocation))
      throw new Error('Location object not of type GPSLocation')
    this.location = location
  }

  get href(){

    return `https://www.google.com/maps/search/?api=1&query=${this.location.lat},${this.location.long}`
  }
}

class GPSLocation{

  constructor(lat, long){

    if (!lat || !long)
     throw new Error('Must define a latitude and longitude')

    this.lat = lat
    this.long = long
  }
}

class MapLocation{
  constructor(map, { name, address, location, description = '', icon = '' }){

    if (!(map instanceof GMap)){
      throw new Error('Need a Google map instance to continue.')
    }
    this.icon = icon
    this.map = map
    this.name = name
    this.address = address
    this.location = location
    this.description = description
    this.link = new GMapsLink(this.location)

    this.marker =  new google.maps.Marker({
			position: new google.maps.LatLng(this.location.lat, this.location.long),
			map: this.map.instance
    });
    
    this.map.addInfoWindowListener(this)
  }

  get infoHTML(){

    return `<strong>${this.name}</strong><br>
    ${this.address}<br>
    <p>${this.description}</p>
    <a href="${this.link.href}">Get Directions</a>`
  }  
}
class GMap{

  static example(){
    const map = new GMap('map', new GPSLocation(41.976816, -87.659916))
  
    map.addMarker({
      name: 'Chipotle on Broadway',
      address: '5224 N Broadway St<br> Chicago, IL 60640',
      location: new GPSLocation(41.976816, -87.659916)
    })
    
    
    map.addMarker({
      name: 'Chipotle on Belmont',
      address: '1025 W Belmont Ave<br> Chicago, IL 60657',
      location: new GPSLocation(41.939670, -87.655167)
    })
    
    map.addMarker({
      name: 'Chipotle on Sheridan',
      address: '6600 N Sheridan Rd<br> Chicago, IL 60626',
      location: new GPSLocation(42.002707, -87.661236)
    })
  }

  constructor( domId, centerLocation, mapType = 'ROADMAP', zoom = 13){

    this.instance = new google.maps.Map(document.getElementById(domId), {
      zoom,
      center: new google.maps.LatLng(centerLocation.lat, centerLocation.long),
      mapTypeId: google.maps.MapTypeId[mapType]
    });
    this.infoWindow = new google.maps.InfoWindow({});
    this.markers = []
  }

  addMarker(inputs){
    this.markers.push(new MapLocation(this, inputs))
  }

  addInfoWindowListener(mapLocation){
    google.maps.event.addListener(mapLocation.marker, 'click', () => {
      this.infoWindow.setContent(mapLocation.infoHTML);
      this.infoWindow.open(this.instance, mapLocation.marker);
    });
  }
}

function initMap(){
  GMap.example()
}
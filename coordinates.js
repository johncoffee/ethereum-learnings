let record = require('./record')

let lat = process.argv[2]
let lng = process.argv[3]

if (!lat || !lng) {
    console.log(`usage: [lat] [lng]`)
}
else {
    let latUint = record.uintFromLat(lat)
    let lngUint = record.uintFromLng(lng)

    console.log(`lat: `+latUint)
    console.log(`lng: `+lngUint)
}

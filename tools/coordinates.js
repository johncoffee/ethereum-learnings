let record = require('../record')

let lat = process.argv[2] // horizontal
let lng = process.argv[3] // vertical

if (!lat || !lng) {
    console.log(`usage: [lat] [lng]`)
}
else {
    let latUint = record.uintFromLat(lat)
    let lngUint = record.uintFromLng(lng)

    console.log(`lat: `+latUint)
    console.log(`lng: `+lngUint)
}

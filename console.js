var RegistryApi = require('./registry_api')
var program = require('commander')

var instance = new RegistryApi();

program
    .version('0.0.1')
    .option('-t, --transfer', 'Transfer a record')
    .option('-r, --register', 'Register a new record')
    .option('-k, --key', 'subject key')
    .option('-l, --lat', 'longitude')
    .option('-g, --lng', 'latitude')
    .parse(process.argv);

if (program.register) {
    console.log(program)
}

if (program.transfer) {

}

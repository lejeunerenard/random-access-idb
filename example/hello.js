var RAI = require('../')
var b4a = require('b4a')
const storage = RAI('dbname')
var cool = storage('cool.txt')

cool.write(100, b4a.from('GREETINGS'), function (err) {
  if (err) return console.error(err)
  cool.read(104, 3, function (err, buf) {
    if (err) return console.error(err)
    console.log(b4a.toString(buf)) // TIN
  })

  cool.read(100, 9, function (err, buf) {
    if (err) return console.error(err)
    console.log(b4a.toString(buf)) // GREETINGS
  })

})

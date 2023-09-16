var test = require('tape')
var random = require('../')('testing-' + Math.random(), { size: 1024 })
var b4a = require('b4a')

test('big', function (t) {
  t.plan(6)
  var cool = random('cool.txt')
  cool.write(32, b4a.from('GREETINGS'), function (err) {
    t.ifError(err)
    cool.write(32 + 3, b4a.from('AT SCOTT'), function (err) {
      t.ifError(err)
      cool.read(32, 9, function (err, buf) {
        t.ifError(err)
        t.equal(b4a.toString(buf), 'GREAT SCO')
      })
      cool.read(32 + 6, 5, function (err, buf) {
        t.ifError(err)
        t.equal(b4a.toString(buf), 'SCOTT')
      })
    })
  })
})

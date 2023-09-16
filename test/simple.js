var test = require('tape')
var random = require('../')('testing-' + Math.random(), { size: 5 })
var b4a = require('b4a')

test('simple', function (t) {
  t.plan(6)
  var cool = random('cool.txt', { size: 5 })
  t.equal(cool.name, 'cool.txt')
  cool.write(100, b4a.from('GREETINGS'), function (err) {
    t.ifError(err)
    cool.read(100, 9, function (err, buf) {
      t.ifError(err)
      t.equal(b4a.toString(buf), 'GREETINGS')
    })
    cool.read(104, 3, function (err, buf) {
      t.ifError(err)
      t.equal(b4a.toString(buf), 'TIN')
    })
  })
})

var exitCode = 0
test.onFailure(function () {
  exitCode = 1
})

test.onFinish(function () {
  window && window.close()
  process.exit(exitCode)
})

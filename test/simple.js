var test = require('tape')
var random = require('../')('testing-' + Math.random(), { size: 5 })
var b4a = require('b4a')

test('simple', function (t) {
  t.plan(15)
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
  cool.write(200, b4a.from('PARTIALDELETE'), function (err) {
    t.ifError(err)
    var deletionOffset = 203
    cool.del(deletionOffset, 3, function (err) {
      t.ifError(err)
      cool.read(deletionOffset, 10, function (err, buf) {
        t.ifError(err)
        t.equal(b4a.toString(buf), '\0\0\0LDELETE')
      })
    })
  })
  cool.write(300, b4a.from('FULLDELETE'), function (err) {
    t.ifError(err)
    var deletionOffset = 250
    cool.del(deletionOffset, cool.length - deletionOffset, function (err) {
      t.ifError(err)
      t.equal(cool.length, deletionOffset, 'truncated length')
      cool.read(deletionOffset, 10, function (err, buf) {
        t.ok(err, 'got error')
        t.equal(err.message, 'Could not satisfy length', 'returns error reading out of bounds')
      })
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

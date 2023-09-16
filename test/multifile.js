var test = require('tape')
var random = require('../')('testing-' + Math.random(), { size: 5 })
var b4a = require('b4a')

test('multiple files cool and good', function (t) {
  t.plan(14)
  var cool = random('cool.txt')
  var and = random('and.txt')
  var good = random('good.txt')
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
    and.write(106, b4a.from('ORANG'), function (err) {
      t.ifError(err)
      and.read(107, 3, function (err, buf) {
        t.ifError(err)
        t.equal(b4a.toString(buf), 'RAN')
        good.write(90, b4a.from('DO YOU EVER JUST... TEAPOT'), function (err) {
          t.ifError(err)
          good.read(110, 6, function (err, buf) {
            t.ifError(err)
            t.equal(b4a.toString(buf), 'TEAPOT')
            good.read(86, 10, function (err, buf) {
              t.ifError(err)
              t.equal(b4a.toString(buf), '\0\0\0\0DO YOU')
              good.read(110, 10, function (err, buf) {
                t.ok(err, 'should error when reading past end of file')
              })
            })
          })
        })
      })
    })
  })
})

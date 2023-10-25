var test = require('tape')
var rai = require('../')('testing-' + Math.random(), { size: 256 })
var Ram = require('random-access-memory')
var randombytes = require('randombytes')
var b4a = require('b4a')

test('reopen', function (t) {
  var nwrites = 100
  var nreads = 100
  t.plan(2 + nwrites * 2 + nreads)

  // this test differs from random.js in that it interleaves writes/reads, and randomly reopens the idb based storage some of the time
  var store = rai('cool.txt')
  function istore () { if (Math.random() > 0.75) store = rai('cool.txt'); return store }

  var mstore = new Ram('cool.txt')

  ;(function () {
    var zeros = b4a.alloc(500 + 100)
    var pending = 2
    istore().write(0, zeros, function (err) {
      t.ifError(err)
      if (--pending === 0) write(0)
    })
    mstore.write(0, zeros, function (err) {
      t.ifError(err)
      if (--pending === 0) write(0)
    })
  })()

  function write (i) {
    if (i === nwrites) return read(0)
    var offset = Math.floor(Math.random() * 500)
    var buf = randombytes(Math.floor(Math.random() * 100))
    var pending = 2
    istore().write(offset, buf, function (err) {
      t.ifError(err)
      if (--pending === 0) read(i + 1)
    })
    mstore.write(offset, buf, function (err) {
      t.ifError(err)
      if (--pending === 0) read(i + 1)
    })
  }

  function read (i) {
    if (i === nreads) return
    var offset = Math.floor(Math.random() * 650)
    var len = Math.floor(Math.random() * 100)
    var pending = 2
    var idata = {}
    var mdata = {}
    var store = istore()
    store.read(offset, len, function (err, buf) {
      idata = { err: err, buf: buf, length: store.length }
      if (--pending === 0) check()
    })
    mstore.read(offset, len, function (err, buf) {
      mdata = { err: err, buf: buf, length: mstore.length }
      if (--pending === 0) check()
    })
    function check () {
      t.deepEqual(idata, mdata)
      write(i + 1)
    }
  }
})

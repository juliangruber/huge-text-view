var View = require('.')
var bytes = require('bytes')

document.body.style.height = '600px'

const view = new View()
view.lines(Math.ceil(bytes('320gb') / 60))
view.pad(100)
view.fetch((line, cb) => {
  setTimeout(() => {
    cb(null, Buffer.alloc(30).toString('hex'))
  }, Math.random() * 100)
})
view.render(document.body)

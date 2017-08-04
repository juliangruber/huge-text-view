
# huge-text-view

Render text blobs _of arbitrary size_ efficiently in the browser.

_Work in progress._

## Example

```js
var View = require('huge-text-view')
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
```

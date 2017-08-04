
# huge-text-view

Render text blobs _of arbitrary size_ efficiently in the browser.

_Work in progress._

## Example

```js
var View = require('huge-text-view')
var bytes = require('bytes')

document.body.style.height = '600px'

View()
  .lines(Math.ceil(bytes('320gb') / 60))
  .pad(100)
  .fetch(function (line, cb) {
    setTimeout(function () {
      cb(null, Buffer.alloc(30).toString('hex'))
    }, Math.random() * 100)
  })
  .render(document.body)
```

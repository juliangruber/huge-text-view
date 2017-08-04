var assert = require('assert')
var css = require('component-css')

module.exports = View

function View () {
  if (!(this instanceof View)) return new View()
  this._lines = null
  this._fetch = null
  this._lineHeight = 12
  this._pad = 100
  this._rendered = {}
}

View.prototype.lines = function (lines) {
  this._lines = lines
  return this
}

View.prototype.pad = function (n) {
  this._pad = n
  return this
}

View.prototype.fetch = function (fn) {
  this._fetch = fn
  return this
}

View.prototype.render = function (container) {
  var self = this
  assert(this._lines, '.lines() required')
  assert(this._fetch, '.fetch() required')

  var outer = document.createElement('div')
  css(outer, 'height', '100%')
  css(outer, 'overflow', 'auto')
  css(outer, 'position', 'relative')

  var inner = document.createElement('div')
  css(inner, 'height', this._lineHeight * this._lines + 'px')
  css(inner, 'position', 'relative')

  container.appendChild(outer)
  outer.appendChild(inner)

  var viewHeight = outer.offsetHeight
  this._draw(inner, viewHeight)
  outer.addEventListener('scroll', function (ev) {
    self._draw(inner, viewHeight)
  })

  return this
}

View.prototype._draw = function (el, viewHeight) {
  var self = this

  var start = Math.floor(el.parentNode.scrollTop / this._lineHeight)
  var end = Math.floor(
    (el.parentNode.scrollTop + viewHeight) / this._lineHeight
  )

  start = Math.max(0, start - this._pad)
  end = Math.min(this._lines, end + this._pad)

  var rendered = Object.keys(this._rendered)
  for (var i = rendered.length - 1; i > -1; i--) {
    var j = Number(rendered[i])
    if (j < start || j > end) {
      el.removeChild(this._rendered[j])
      delete this._rendered[j]
    }
  }

  for (i = start; i < end; i++) {
    ;(function (i) {
      if (self._rendered[i]) return
      var line = document.createElement('div')
      css(line, 'position', 'absolute')
      css(line, 'left', '0')
      css(line, 'top', i * self._lineHeight + 'px')
      css(line, 'z-index', 1)
      el.appendChild(line)
      self._rendered[i] = line
      self._fetch(i, function (err, data) {
        if (err) throw err
        if (typeof data === 'string') line.innerHTML += data
        else line.appendChild(data)
      })
    })(i)
  }
}

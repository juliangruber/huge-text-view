'use strict'

const assert = require('assert')
const css = require('component-css')

module.exports = class View {
  constructor () {
    this._lines = null
    this._fetch = null
    this._lineHeight = 12
    this._pad = 100
    this._rendered = {}
  }

  lines (n) {
    this._lines = n
  }

  pad (n) {
    this._pad = n
  }

  fetch (fn) {
    this._fetch = fn
  }

  render (container) {
    assert(this._lines, '.lines() required')
    assert(this._fetch, '.fetch() required')

    const outer = document.createElement('div')
    css(outer, 'height', '100%')
    css(outer, 'overflow', 'auto')
    css(outer, 'position', 'relative')

    const inner = document.createElement('div')
    css(inner, 'height', `${this._lineHeight * this._lines}px`)
    css(inner, 'position', 'relative')

    container.appendChild(outer)
    outer.appendChild(inner)

    const viewHeight = outer.offsetHeight
    this._draw(inner, viewHeight)
    outer.addEventListener('scroll', () => this._draw(inner, viewHeight))
  }

  _draw (el, viewHeight) {
    const start = Math.max(
      0,
      Math.floor(el.parentNode.scrollTop / this._lineHeight) - this._pad
    )
    const end = Math.min(
      this._lines,
      Math.floor((el.parentNode.scrollTop + viewHeight) / this._lineHeight) +
        this._pad
    )

    const rendered = Object.keys(this._rendered)
    for (let i = rendered.length - 1; i > -1; i--) {
      const j = Number(rendered[i])
      if (j < start || j > end) {
        el.removeChild(this._rendered[j])
        delete this._rendered[j]
      }
    }

    for (let i = start; i < end; i++) {
      if (this._rendered[i]) return
      const line = document.createElement('div')
      css(line, 'position', 'absolute')
      css(line, 'left', '0')
      css(line, 'top', i * this._lineHeight + 'px')
      css(line, 'z-index', 1)
      el.appendChild(line)
      this._rendered[i] = line
      this._fetch(i, (err, data) => {
        if (err) throw err
        if (typeof data === 'string') line.innerHTML += data
        else line.appendChild(data)
      })
    }
  }
}

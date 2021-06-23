/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v1.0.1
 * GitHub: https://github.com/hustcc/ribbon.js
 * Modify by Jerry
 **/

(function () {
  const script = document.getElementById('ribbon')
  const mb = script.getAttribute('mobile')
  if (
    mb === 'false' &&
    /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)
  ) {
    return
  }

  const config = {
    z: attr(script, 'zIndex', -1), // z-index
    a: attr(script, 'alpha', 0.6), // alpha
    s: attr(script, 'size', 90), // size
    c: script.getAttribute('data-click')
  }

  function attr (node, attr, defaultValue) {
    return Number(node.getAttribute(attr)) || defaultValue
  }

  const canvas = document.createElement('canvas')
  const g2d = canvas.getContext('2d')
  const pr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = window.innerHeight
  const f = config.s
  let q; let t
  const m = Math
  let r = 0
  const pi = m.PI * 2
  const cos = m.cos
  const random = m.random
  canvas.width = width * pr
  canvas.height = height * pr
  g2d.scale(pr, pr)
  g2d.globalAlpha = config.a
  canvas.style.cssText = 'opacity: ' + config.a + ';position:fixed;top:0;left:0;z-index: ' + config.z + ';width:100%;height:100%;pointer-events:none;'
  // create canvas
  document.getElementsByTagName('body')[0].appendChild(canvas)

  function redraw () {
    g2d.clearRect(0, 0, width, height)
    q = [{ x: 0, y: height * 0.7 + f }, { x: 0, y: height * 0.7 - f }]
    while (q[1].x < width + f) draw(q[0], q[1])
  }
  function draw (i, j) {
    g2d.beginPath()
    g2d.moveTo(i.x, i.y)
    g2d.lineTo(j.x, j.y)
    const k = j.x + (random() * 2 - 0.25) * f; const n = line(j.y)
    g2d.lineTo(k, n)
    g2d.closePath()
    r -= pi / -50
    g2d.fillStyle = '#' + (cos(r) * 127 + 128 << 16 | cos(r + pi / 3) * 127 + 128 << 8 | cos(r + pi / 3 * 2) * 127 + 128).toString(16)
    g2d.fill()
    q[0] = q[1]
    q[1] = { x: k, y: n }
  }
  function line (p) {
    t = p + (random() * 2 - 1.1) * f
    return (t > height || t < 0) ? line(p) : t
  }
  if (config.c !== 'false') {
    document.onclick = redraw
    document.ontouchstart = redraw
  }
  redraw()
})()

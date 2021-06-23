;(function (name, factory) {
  if (typeof window === 'object') {
    window[name] = factory()
  }
})('Ribbons', function () {
  const _w = window
  const _b = document.body
  const _d = document.documentElement
  var random = function () {
    if (arguments.length === 1) {
      if (Array.isArray(arguments[0])) {
        const index = Math.round(random(0, arguments[0].length - 1))
        return arguments[0][index]
      }
      return random(0, arguments[0])
    } else if (arguments.length === 2) {
      return Math.random() * (arguments[1] - arguments[0]) + arguments[0]
    }
    return 0
  }
  const screenInfo = function (e) {
    const width = Math.max(
      0,
      _w.innerWidth || _d.clientWidth || _b.clientWidth || 0
    )
    const height = Math.max(
      0,
      _w.innerHeight || _d.clientHeight || _b.clientHeight || 0
    )
    const scrollx =
      Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) -
      (_d.clientLeft || 0)
    const scrolly =
      Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) -
      (_d.clientTop || 0)
    return {
      width: width,
      height: height,
      ratio: width / height,
      centerx: width / 2,
      centery: height / 2,
      scrollx: scrollx,
      scrolly: scrolly
    }
  }
  const mouseInfo = function (e) {
    const screen = screenInfo(e)
    const mousex = e ? Math.max(0, e.pageX || e.clientX || 0) : 0
    const mousey = e ? Math.max(0, e.pageY || e.clientY || 0) : 0
    return {
      mousex: mousex,
      mousey: mousey,
      centerx: mousex - screen.width / 2,
      centery: mousey - screen.height / 2
    }
  }
  const Point = function (x, y) {
    this.x = 0
    this.y = 0
    this.set(x, y)
  }
  Point.prototype = {
    constructor: Point,
    set: function (x, y) {
      this.x = x || 0
      this.y = y || 0
    },
    copy: function (point) {
      this.x = point.x || 0
      this.y = point.y || 0
      return this
    },
    multiply: function (x, y) {
      this.x *= x || 1
      this.y *= y || 1
      return this
    },
    divide: function (x, y) {
      this.x /= x || 1
      this.y /= y || 1
      return this
    },
    add: function (x, y) {
      this.x += x || 0
      this.y += y || 0
      return this
    },
    subtract: function (x, y) {
      this.x -= x || 0
      this.y -= y || 0
      return this
    },
    clampX: function (min, max) {
      this.x = Math.max(min, Math.min(this.x, max))
      return this
    },
    clampY: function (min, max) {
      this.y = Math.max(min, Math.min(this.y, max))
      return this
    },
    flipX: function () {
      this.x *= -1
      return this
    },
    flipY: function () {
      this.y *= -1
      return this
    }
  }
  const Factory = function (options) {
    this._canvas = null
    this._context = null
    this._sto = null
    this._width = 0
    this._height = 0
    this._scroll = 0
    this._ribbons = []
    this._options = {
      colorSaturation: '80%',
      colorBrightness: '60%',
      colorAlpha: 0.65,
      colorCycleSpeed: 6,
      verticalPosition: 'center',
      horizontalSpeed: 150,
      ribbonCount: 5,
      strokeSize: 5,
      parallaxAmount: -0.5,
      animateSections: true
    }
    this._onDraw = this._onDraw.bind(this)
    this._onResize = this._onResize.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this.setOptions(options)
    this.init()
  }
  Factory.prototype = {
    constructor: Factory,
    setOptions: function (options) {
      if (typeof options === 'object') {
        for (const key in options) {
          if (options.hasOwnProperty(key)) {
            this._options[key] = options[key]
          }
        }
      }
    },
    init: function () {
      try {
        this._canvas = document.createElement('canvas')
        this._canvas.style.display = 'block'
        this._canvas.style.position = 'fixed'
        this._canvas.style.margin = '0'
        this._canvas.style.padding = '0'
        this._canvas.style.border = '0'
        this._canvas.style.outline = '0'
        this._canvas.style.left = '0'
        this._canvas.style.top = '0'
        this._canvas.style.width = '100%'
        this._canvas.style.height = '100%'
        this._canvas.style['z-index'] = '-1'
        this._onResize()
        this._context = this._canvas.getContext('2d')
        this._context.clearRect(0, 0, this._width, this._height)
        this._context.globalAlpha = this._options.colorAlpha
        window.addEventListener('resize', this._onResize)
        window.addEventListener('scroll', this._onScroll)
        document.body.appendChild(this._canvas)
      } catch (e) {
        console.warn('Canvas Context Error: ' + e.toString())
        return
      }
      this._onDraw()
    },
    addRibbon: function () {
      const dir = Math.round(random(1, 9)) > 5 ? 'right' : 'left'
      let stop = 1000
      const hide = 200
      const min = 0 - hide
      const max = this._width + hide
      let movex = 0
      let movey = 0
      const startx = dir === 'right' ? min : max
      let starty = Math.round(random(0, this._height))
      if (/^(top|min)$/i.test(this._options.verticalPosition)) {
        starty = 0 + hide
      } else if (/^(middle|center)$/i.test(this._options.verticalPosition)) {
        starty = this._height / 2
      } else if (/^(bottom|max)$/i.test(this._options.verticalPosition)) {
        starty = this._height - hide
      }
      const ribbon = []
      const point1 = new Point(startx, starty)
      const point2 = new Point(startx, starty)
      let point3 = null
      let color = Math.round(random(0, 360))
      let delay = 0
      while (true) {
        if (stop <= 0) break
        stop--
        movex = Math.round(
          (Math.random() * 1 - 0.2) * this._options.horizontalSpeed
        )
        movey = Math.round((Math.random() * 1 - 0.5) * (this._height * 0.25))
        point3 = new Point()
        point3.copy(point2)
        if (dir === 'right') {
          point3.add(movex, movey)
          if (point2.x >= max) break
        } else if (dir === 'left') {
          point3.subtract(movex, movey)
          if (point2.x <= min) break
        }
        ribbon.push({
          point1: new Point(point1.x, point1.y),
          point2: new Point(point2.x, point2.y),
          point3: point3,
          color: color,
          delay: delay,
          dir: dir,
          alpha: 0,
          phase: 0
        })
        point1.copy(point2)
        point2.copy(point3)
        delay += 4
        color += this._options.colorCycleSpeed
      }
      this._ribbons.push(ribbon)
    },
    _drawRibbonSection: function (section) {
      if (section) {
        if (section.phase >= 1 && section.alpha <= 0) {
          return true
        }
        if (section.delay <= 0) {
          section.phase += 0.02
          section.alpha = Math.sin(section.phase) * 1
          section.alpha = section.alpha <= 0 ? 0 : section.alpha
          section.alpha = section.alpha >= 1 ? 1 : section.alpha
          if (this._options.animateSections) {
            const mod = Math.sin(1 + (section.phase * Math.PI) / 2) * 0.1
            if (section.dir === 'right') {
              section.point1.add(mod, 0)
              section.point2.add(mod, 0)
              section.point3.add(mod, 0)
            } else {
              section.point1.subtract(mod, 0)
              section.point2.subtract(mod, 0)
              section.point3.subtract(mod, 0)
            }
            section.point1.add(0, mod)
            section.point2.add(0, mod)
            section.point3.add(0, mod)
          }
        } else {
          section.delay -= 0.5
        }
        const s = this._options.colorSaturation
        const l = this._options.colorBrightness
        const c =
          'hsla(' +
          section.color +
          ', ' +
          s +
          ', ' +
          l +
          ', ' +
          section.alpha +
          ' )'
        this._context.save()
        if (this._options.parallaxAmount !== 0) {
          this._context.translate(
            0,
            this._scroll * this._options.parallaxAmount
          )
        }
        this._context.beginPath()
        this._context.moveTo(section.point1.x, section.point1.y)
        this._context.lineTo(section.point2.x, section.point2.y)
        this._context.lineTo(section.point3.x, section.point3.y)
        this._context.fillStyle = c
        this._context.fill()
        if (this._options.strokeSize > 0) {
          this._context.lineWidth = this._options.strokeSize
          this._context.strokeStyle = c
          this._context.lineCap = 'round'
          this._context.stroke()
        }
        this._context.restore()
      }
      return false
    },
    _onDraw: function () {
      for (let i = 0, t = this._ribbons.length; i < t; ++i) {
        if (!this._ribbons[i]) {
          this._ribbons.splice(i, 1)
        }
      }
      this._context.clearRect(0, 0, this._width, this._height)
      for (let a = 0; a < this._ribbons.length; ++a) {
        const ribbon = this._ribbons[a]
        const numSections = ribbon.length
        let numDone = 0
        for (let b = 0; b < numSections; ++b) {
          if (this._drawRibbonSection(ribbon[b])) {
            numDone++
          }
        }
        if (numDone >= numSections) {
          this._ribbons[a] = null
        }
      }
      if (this._ribbons.length < this._options.ribbonCount) {
        this.addRibbon()
      }
      requestAnimationFrame(this._onDraw)
    },
    _onResize: function (e) {
      const screen = screenInfo(e)
      this._width = screen.width
      this._height = screen.height
      if (this._canvas) {
        this._canvas.width = this._width
        this._canvas.height = this._height
        if (this._context) {
          this._context.globalAlpha = this._options.colorAlpha
        }
      }
    },
    _onScroll: function (e) {
      const screen = screenInfo(e)
      this._scroll = screen.scrolly
    }
  }
  return Factory
})

const cn = document.getElementById('fluttering_ribbon')
const mb = cn.getAttribute('mobile')

if (!(mb === 'false' && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))) {
  new Ribbons({
    colorSaturation: '60%',
    colorBrightness: '50%',
    colorAlpha: 0.5,
    colorCycleSpeed: 5,
    verticalPosition: 'random',
    horizontalSpeed: 200,
    ribbonCount: 3,
    strokeSize: 0,
    parallaxAmount: -0.2,
    animateSections: true
  })
}

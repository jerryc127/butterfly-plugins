(function (name, factory) {
  if (typeof window === 'object') {
    window[name] = factory()
  }
})('Ribbons', () => {
  const random = (min, max) => Math.random() * (max - min) + min

  const getScreenInfo = () => ({
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0,
    scrollY: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  })

  const createPoint = (x, y) => ({ x, y })

  const createRibbon = (options, width, height) => {
    const ribbon = []
    const dir = Math.random() > 0.5 ? 'right' : 'left'
    const startX = dir === 'right' ? -200 : width + 200
    const startY = options.verticalPosition === 'random'
      ? random(0, height)
      : options.verticalPosition === 'top'
        ? 200
        : options.verticalPosition === 'bottom'
          ? height - 200
          : height / 2

    let point1 = createPoint(startX, startY)
    let point2 = createPoint(startX, startY)

    for (let i = 0; i < 1000; i++) {
      const moveX = random(-0.2, 1) * options.horizontalSpeed
      const moveY = random(-0.5, 0.5) * (height * 0.25)
      const point3 = createPoint(
        point2.x + (dir === 'right' ? moveX : -moveX),
        point2.y + moveY
      )

      if ((dir === 'right' && point2.x >= width + 200) || (dir === 'left' && point2.x <= -200)) {
        break
      }

      ribbon.push({
        point1: { ...point1 },
        point2: { ...point2 },
        point3,
        color: i * options.colorCycleSpeed,
        delay: i * 4,
        dir,
        alpha: 0,
        phase: 0
      })

      point1 = { ...point2 }
      point2 = { ...point3 }
    }

    return ribbon
  }

  const drawRibbonSection = (ctx, section, options, scroll) => {
    if (section.phase >= 1 && section.alpha <= 0) return true

    if (section.delay <= 0) {
      section.phase += 0.02
      section.alpha = Math.sin(section.phase)
      section.alpha = Math.max(0, Math.min(section.alpha, 1))

      if (options.animateSections) {
        const mod = Math.sin(1 + section.phase * Math.PI / 2) * 0.1
        const xMod = section.dir === 'right' ? mod : -mod
        section.point1.x += xMod
        section.point2.x += xMod
        section.point3.x += xMod
        section.point1.y += mod
        section.point2.y += mod
        section.point3.y += mod
      }
    } else {
      section.delay -= 0.5
    }

    const color = `hsla(${section.color}, ${options.colorSaturation}, ${options.colorBrightness}, ${section.alpha * options.colorAlpha})`

    ctx.save()
    if (options.parallaxAmount !== 0) {
      ctx.translate(0, scroll * options.parallaxAmount)
    }
    ctx.beginPath()
    ctx.moveTo(section.point1.x, section.point1.y)
    ctx.lineTo(section.point2.x, section.point2.y)
    ctx.lineTo(section.point3.x, section.point3.y)
    ctx.fillStyle = color
    ctx.fill()

    if (options.strokeSize > 0) {
      ctx.lineWidth = options.strokeSize
      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    ctx.restore()

    return false
  }

  return (userOptions = {}) => {
    const options = {
      colorSaturation: '80%',
      colorBrightness: '60%',
      colorAlpha: 0.65,
      colorCycleSpeed: 6,
      verticalPosition: 'center',
      horizontalSpeed: 150,
      ribbonCount: 3,
      strokeSize: 0,
      parallaxAmount: -0.5,
      animateSections: true,
      ...userOptions
    }

    let canvas, ctx, width, height, scrollY
    const ribbons = []

    const resizeHandler = () => {
      ({ width, height } = getScreenInfo())
      canvas.width = width
      canvas.height = height
      ctx.globalAlpha = options.colorAlpha
    }

    const scrollHandler = () => {
      ({ scrollY } = getScreenInfo())
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      ribbons.forEach((ribbon, i) => {
        ribbon = ribbon.filter(section => !drawRibbonSection(ctx, section, options, scrollY))
        ribbons[i] = ribbon.length ? ribbon : null
      })

      ribbons.forEach((ribbon, i) => {
        if (!ribbon) {
          ribbons[i] = createRibbon(options, width, height)
        }
      })

      requestAnimationFrame(animate)
    }

    const init = () => {
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d')

      canvas.style.cssText = 'display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;'
      document.body.appendChild(canvas)

      resizeHandler()

      for (let i = 0; i < options.ribbonCount; i++) {
        ribbons.push(createRibbon(options, width, height))
      }

      window.addEventListener('resize', resizeHandler)
      window.addEventListener('scroll', scrollHandler)

      animate()
    }

    init()
  }
})

// Usage
const ribbonContainer = document.getElementById('fluttering_ribbon')
const isMobileDisabled = ribbonContainer.getAttribute('mobile') === 'false'

if (!(isMobileDisabled && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))) {
  Ribbons({
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

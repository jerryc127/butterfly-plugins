const POWERMODE = (() => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const particles = []
  let particlePointer = 0
  let rendering = false

  const initCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999'
    document.body.appendChild(canvas)
  }

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const getRandom = (min, max) => Math.random() * (max - min) + min

  const getColor = (el) => {
    if (POWERMODE.colorful) {
      const hue = getRandom(0, 360)
      return `hsla(${getRandom(hue - 10, hue + 10)}, 100%, ${getRandom(50, 80)}%, 1)`
    }
    return window.getComputedStyle(el).color
  }

  const getCaretCoordinates = (element, position) => {
    const properties = [
      'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust',
      'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration',
      'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
    ]

    const isFirefox = window.mozInnerScreenX != null
    const div = document.createElement('div')
    div.id = 'input-textarea-caret-position-mirror-div'
    document.body.appendChild(div)

    const style = div.style
    const computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle

    style.whiteSpace = 'pre-wrap'
    if (element.nodeName !== 'INPUT') {
      style.wordWrap = 'break-word'
    }

    style.position = 'absolute'
    style.visibility = 'hidden'

    properties.forEach(prop => {
      style[prop] = computed[prop]
    })

    if (isFirefox) {
      if (element.scrollHeight > parseInt(computed.height)) { style.overflowY = 'scroll' }
    } else {
      style.overflow = 'hidden'
    }

    div.textContent = element.value.substring(0, position)
    if (element.nodeName === 'INPUT') {
      div.textContent = div.textContent.replace(/\s/g, '\u00a0')
    }

    const span = document.createElement('span')
    span.textContent = element.value.substring(position) || '.'
    div.appendChild(span)

    const coordinates = {
      top: span.offsetTop + parseInt(computed.borderTopWidth),
      left: span.offsetLeft + parseInt(computed.borderLeftWidth)
    }

    document.body.removeChild(div)

    return coordinates
  }

  const getCaret = () => {
    const el = document.activeElement
    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && ['text', 'email'].includes(el.type))) {
      const { left, top } = el.getBoundingClientRect()
      const offset = getCaretCoordinates(el, el.selectionEnd)
      return { x: offset.left + left, y: offset.top + top, color: getColor(el), element: el }
    }
    const selection = window.getSelection()
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      const startNode = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer
      const { left, top } = range.getBoundingClientRect()
      return { x: left, y: top, color: getColor(startNode), element: startNode }
    }
    return { x: 0, y: 0, color: 'transparent', element: null }
  }

  const createParticle = (x, y, color) => ({
    x,
    y,
    alpha: 1,
    color,
    velocity: { x: -1 + Math.random() * 2, y: -3.5 + Math.random() * 2 }
  })

  const spawnParticles = (caret) => {
    const numParticles = 5 + Math.round(Math.random() * 10)
    for (let i = 0; i < numParticles; i++) {
      particles[particlePointer] = createParticle(caret.x, caret.y, caret.color)
      particlePointer = (particlePointer + 1) % 500
    }
  }

  const shakeScreen = (element) => {
    if (POWERMODE.shake) {
      const intensity = 1 + 2 * Math.random()
      const x = intensity * (Math.random() > 0.5 ? -1 : 1)
      const y = intensity * (Math.random() > 0.5 ? -1 : 1)

      document.body.style.marginLeft = `${x}px`
      document.body.style.marginTop = `${y}px`

      if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
        const originalPosition = element.style.position
        const originalTransition = element.style.transition
        element.style.position = 'relative'
        element.style.transition = 'none'
        element.style.transform = `translate(${x}px, ${y}px)`

        setTimeout(() => {
          element.style.position = originalPosition
          element.style.transition = originalTransition
          element.style.transform = ''
          document.body.style.marginLeft = ''
          document.body.style.marginTop = ''
        }, 75)
      } else {
        setTimeout(() => {
          document.body.style.marginLeft = ''
          document.body.style.marginTop = ''
        }, 75)
      }
    }
  }

  const loop = () => {
    rendering = true
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let hasActiveParticles = false
    const rect = canvas.getBoundingClientRect()

    particles.forEach(particle => {
      if (particle.alpha <= 0.1) return
      particle.velocity.y += 0.075
      particle.x += particle.velocity.x
      particle.y += particle.velocity.y
      particle.alpha *= 0.96
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.fillRect(
        Math.round(particle.x - 1.5) - rect.left,
        Math.round(particle.y - 1.5) - rect.top,
        3, 3
      )
      hasActiveParticles = true
    })

    if (hasActiveParticles) {
      requestAnimationFrame(loop)
    } else {
      rendering = false
    }
  }

  const powerMode = {
    colorful: false,
    shake: true,
    mobile: false,
    init: () => {
      if (!powerMode.mobile && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) return
      initCanvas()
      window.addEventListener('resize', resizeCanvas)
    },
    explode: () => {
      const caret = getCaret()
      spawnParticles(caret)
      shakeScreen(caret.element)
      if (!rendering) requestAnimationFrame(loop)
    }
  }

  return powerMode
})()

// 初始化
POWERMODE.init()

// 使用示例
document.body.addEventListener('input', POWERMODE.explode)

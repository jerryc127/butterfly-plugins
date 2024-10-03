(() => {
  const cn = document.getElementById('canvas_nest')
  const mb = cn.getAttribute('mobile')

  if (mb === 'false' && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
    return
  }

  const getAttribute = (element, attr, defaultValue) => element.getAttribute(attr) || defaultValue

  const createCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${settings.zIndex};opacity:${settings.opacity}`
    document.body.appendChild(canvas)
    return canvas
  }

  const settings = {
    zIndex: getAttribute(cn, 'zIndex', -1),
    opacity: getAttribute(cn, 'opacity', 0.5),
    color: getAttribute(cn, 'color', '0,0,0'),
    count: getAttribute(cn, 'count', 99)
  }

  const canvas = createCanvas()
  const context = canvas.getContext('2d')
  let width, height

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    height = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }

  const particles = []
  const mainParticle = { x: null, y: null, max: 20000 }

  const updateParticles = () => {
    context.clearRect(0, 0, width, height)
    const allParticles = [mainParticle].concat(particles)

    particles.forEach(particle => {
      particle.x += particle.xa
      particle.y += particle.ya
      particle.xa *= particle.x > width || particle.x < 0 ? -1 : 1
      particle.ya *= particle.y > height || particle.y < 0 ? -1 : 1

      context.fillRect(particle.x - 0.5, particle.y - 0.5, 1, 1)

      allParticles.forEach(otherParticle => {
        if (particle !== otherParticle && otherParticle.x !== null && otherParticle.y !== null) {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared < otherParticle.max) {
            if (otherParticle === mainParticle && distanceSquared >= otherParticle.max / 2) {
              particle.x -= 0.03 * dx
              particle.y -= 0.03 * dy
            }
            const ratio = (otherParticle.max - distanceSquared) / otherParticle.max
            context.beginPath()
            context.lineWidth = ratio / 2
            context.strokeStyle = `rgba(${settings.color},${ratio + 0.2})`
            context.moveTo(particle.x, particle.y)
            context.lineTo(otherParticle.x, otherParticle.y)
            context.stroke()
          }
        }
      })
      allParticles.splice(allParticles.indexOf(particle), 1)
    })

    requestAnimationFrame(updateParticles)
  }

  const initParticles = () => {
    for (let i = 0; i < settings.count; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const xa = 2 * Math.random() - 1
      const ya = 2 * Math.random() - 1

      particles.push({
        x,
        y,
        xa,
        ya,
        max: 6000
      })
    }
  }

  resizeCanvas()
  window.onresize = resizeCanvas

  window.onmousemove = event => {
    mainParticle.x = event.clientX
    mainParticle.y = event.clientY
  }

  window.onmouseout = () => {
    mainParticle.x = null
    mainParticle.y = null
  }

  initParticles()
  setTimeout(updateParticles, 100)
})()

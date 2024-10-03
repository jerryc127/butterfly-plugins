/**
 * GitHub: https://github.com/hustcc/ribbon.js
 * Modify by Jerry
 **/

(() => {
  const script = document.getElementById('ribbon')
  const isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)

  if (script.getAttribute('mobile') === 'false' && isMobile) return

  const getAttributeValue = (node, attrName, defaultValue) => Number(node.getAttribute(attrName)) || defaultValue

  const config = {
    zIndex: getAttributeValue(script, 'zIndex', -1),
    alpha: getAttributeValue(script, 'alpha', 0.6),
    size: getAttributeValue(script, 'size', 90),
    clickToRedraw: script.getAttribute('data-click') !== 'false'
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const { devicePixelRatio: dpr = 1 } = window
  const { innerWidth: screenWidth, innerHeight: screenHeight } = window
  const ribbonWidth = config.size

  canvas.width = screenWidth * dpr
  canvas.height = screenHeight * dpr
  ctx.scale(dpr, dpr)
  ctx.globalAlpha = config.alpha

  canvas.style.cssText = `opacity: ${config.alpha}; position: fixed; top: 0; left: 0; z-index: ${config.zIndex}; width: 100%; height: 100%; pointer-events: none;`
  document.body.appendChild(canvas)

  let points = [
    { x: 0, y: screenHeight * 0.7 + ribbonWidth },
    { x: 0, y: screenHeight * 0.7 - ribbonWidth }
  ]
  let angleOffset = 0
  const TWO_PI = Math.PI * 2

  const getRandomYPosition = (baseY) => {
    const newY = baseY + (Math.random() * 2 - 1.1) * ribbonWidth
    return (newY > screenHeight || newY < 0) ? getRandomYPosition(baseY) : newY
  }

  const drawRibbonSegment = (startPoint, endPoint) => {
    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    const nextX = endPoint.x + (Math.random() * 2 - 0.25) * ribbonWidth
    const nextY = getRandomYPosition(endPoint.y)
    ctx.lineTo(nextX, nextY)
    ctx.closePath()
    angleOffset -= TWO_PI / -50
    ctx.fillStyle = '#' + ((Math.cos(angleOffset) * 127 + 128 << 16) |
                           (Math.cos(angleOffset + TWO_PI / 3) * 127 + 128 << 8) |
                           (Math.cos(angleOffset + TWO_PI / 3 * 2) * 127 + 128)).toString(16)
    ctx.fill()
    points[0] = points[1]
    points[1] = { x: nextX, y: nextY }
  }

  const redrawRibbon = () => {
    ctx.clearRect(0, 0, screenWidth, screenHeight)
    points = [
      { x: 0, y: screenHeight * 0.7 + ribbonWidth },
      { x: 0, y: screenHeight * 0.7 - ribbonWidth }
    ]
    while (points[1].x < screenWidth + ribbonWidth) drawRibbonSegment(points[0], points[1])
  }

  if (config.clickToRedraw) {
    document.onclick = redrawRibbon
    document.ontouchstart = redrawRibbon
  }

  redrawRibbon()
})()

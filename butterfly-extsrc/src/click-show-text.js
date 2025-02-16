(() => {
  const $dom = document.getElementById('click-show-text')
  const config = {
    mobile: $dom.getAttribute('data-mobile') || $dom.getAttribute('mobile'),
    text: $dom.getAttribute('data-text') || GLOBAL_CONFIG.ClickShowText.text,
    fontSize: $dom.getAttribute('data-fontsize') || GLOBAL_CONFIG.ClickShowText.fontSize,
    random: $dom.getAttribute('data-random') || GLOBAL_CONFIG.ClickShowText.random
  }

  if (config.mobile === 'false' && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) return

  const randomColor = () => '#' + Array.from({ length: 6 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')

  const textArray = config.text.split(',')
  let textIndex = 0

  document.body.addEventListener('click', e => {
    const $span = document.createElement('span')

    if (config.random === 'true') {
      textIndex = Math.floor(Math.random() * textArray.length)
    } else {
      textIndex = (textIndex + 1) % textArray.length
    }
    $span.textContent = textArray[textIndex]

    const { pageX: x, pageY: y } = e
    const { clientWidth } = document.documentElement

    // 臨時將 span 添加到 body 以獲取其寬度
    $span.style.position = 'absolute'
    $span.style.visibility = 'hidden'
    document.body.appendChild($span)
    const spanWidth = $span.offsetWidth

    // 計算 left 位置，確保不會溢出屏幕左側或右側
    const left = Math.min(Math.max(x - spanWidth / 2, 10), clientWidth - spanWidth - 10)

    $span.style.cssText = `
      z-index: 150;
      top: ${y - 20}px;
      left: ${left}px;
      position: absolute;
      font-weight: bold;
      color: ${randomColor()};
      cursor: default;
      font-size: ${config.fontSize || 'inherit'};
      word-break: break-word;
      visibility: visible;
    `

    const startTime = performance.now()
    const animate = currentTime => {
      const elapsed = currentTime - startTime
      if (elapsed < 600) {
        const progress = elapsed / 600
        $span.style.top = `${y - 20 - progress * 20}px`
        $span.style.opacity = 1 - progress
        requestAnimationFrame(animate)
      } else {
        $span.remove()
      }
    }
    requestAnimationFrame(animate)
  })
})()

(function () {
  const $dom = document.getElementById('click-show-text')
  let config = null
  // old version
  if ($dom.getAttribute('mobile') !== null) {
    config = {
      mobile: $dom.getAttribute('mobile'),
      text: GLOBAL_CONFIG.ClickShowText.text,
      fontSize: GLOBAL_CONFIG.ClickShowText.fontSize,
      random: GLOBAL_CONFIG.ClickShowText.random
    }
  } else {
    // new version
    config = {
      mobile: $dom.getAttribute('data-mobile'),
      text: $dom.getAttribute('data-text'),
      fontSize: $dom.getAttribute('data-fontsize'),
      random: $dom.getAttribute('data-random')
    }
  }

  if (config.mobile === 'false' && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
    return
  }

  const randomColor = function () {
    const colorElements = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f'
    const colorArray = colorElements.split(',')
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += colorArray[Math.floor(Math.random() * 16)]
    }
    return color
  }

  let aIdx = 0

  document.body.addEventListener('click', function (e) {
    const text = config.text.split(',')
    const $span = document.createElement('span')
    if (config.random === 'true') {
      aIdx = Math.floor(Math.random() * text.length)
      $span.textContent = text[aIdx]
    } else {
      $span.textContent = text[aIdx]
      aIdx = (aIdx + 1) % text.length
    }

    const x = e.pageX
    const y = e.pageY
    let top = y - 20

    $span.style.cssText = `
      z-index: 150;
      top: ${top}px;
      left: ${x - 20}px;
      position: absolute;
      font-weight: bold;
      color: ${randomColor()};
      cursor: default;
      font-size: ${config.fontSize || 'inherit'};
      word-break: break-word;
    `
    this.appendChild($span)

    // animation
    const initTime = new Date().getTime()
    let opacityValue = 1

    function animate () {
      top--
      opacityValue = opacityValue - 0.02
      $span.style.top = top + 'px'
      $span.style.opacity = opacityValue
      const newTime = (new Date()).getTime()
      const diff = newTime - initTime
      if (diff < 600) {
        window.requestAnimationFrame(animate)
      } else {
        $span.remove()
      }
    }
    window.requestAnimationFrame(animate)
  })
})()

(() => {
  const script = document.getElementById('click-heart')
  const isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)

  if (script.getAttribute('mobile') === 'false' && isMobile) return

  const hearts = []

  const requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback => setTimeout(callback, 1000 / 60))

  const init = () => {
    const style = document.createElement('style')
    style.textContent = `
      .heart {
        width: 10px;
        height: 10px;
        position: fixed;
        background: #f00;
        z-index: 99999999;
        transform: rotate(45deg);
      }
      .heart:after, .heart:before {
        content: '';
        width: inherit;
        height: inherit;
        background: inherit;
        border-radius: 50%;
        position: absolute;
      }
      .heart:after { top: -5px; }
      .heart:before { left: -5px; }
    `
    document.head.appendChild(style)

    window.addEventListener('click', createHeart)
    gameLoop()
  }

  const gameLoop = () => {
    hearts.forEach((heart, index) => {
      if (heart.alpha <= 0) {
        document.body.removeChild(heart.el)
        hearts.splice(index, 1)
        return
      }

      heart.y--
      heart.scale += 0.004
      heart.alpha -= 0.013
      heart.el.style.cssText = `
        left: ${heart.x}px;
        top: ${heart.y}px;
        opacity: ${heart.alpha};
        transform: scale(${heart.scale}) rotate(45deg);
        background: ${heart.color};
      `
    })
    requestAnimationFrame(gameLoop)
  }

  const createHeart = (event) => {
    const d = document.createElement('div')
    d.className = 'heart'
    hearts.push({
      el: d,
      x: event.clientX - 5,
      y: event.clientY - 5,
      scale: 1,
      alpha: 1,
      color: randomColor()
    })
    document.body.appendChild(d)
  }

  const randomColor = () =>
    `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)})`

  init()
})()

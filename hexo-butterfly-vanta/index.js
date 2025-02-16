'use strict'

const vanta = hexo.config.vanta

const addCss = () => {
  const content = `
    <style>
      #background-effect {
        position: fixed !important;
        top: 0px;
        left: 0px;
        z-index: -1;
        width: 100%;
        height: 100%
      }
    </style>
  `
  return content
}

const addVanta = (hexo) => {
  const { option, effect } = vanta

  const config = Object.assign({
    el: '#background-effect'
  }, option)

  const vantaJs = `https://cdn.jsdelivr.net/npm/vanta/dist/vanta.${effect.toLowerCase()}.min.js`

  let result = '<div id="background-effect"></div>'
  result += '<script src="https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.min.js"></script>'
  result += `<script src="${vantaJs}"></script>`
  result += `<script>VANTA.${effect.toUpperCase()}(${JSON.stringify(config)})</script>`

  return result
}

if (vanta && vanta.enable) {
  hexo.extend.injector.register('head_end', addCss)
  hexo.extend.injector.register('body_end', addVanta(hexo))
}

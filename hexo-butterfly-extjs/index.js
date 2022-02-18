'use strict'

const fs = require('fs-extra')
const path = require('path')

hexo.extend.filter.register('after_generate', function () {
  if (hexo.theme.config.CDN.third_party_provider !== 'local') return

  const src = path.join(hexo.plugin_dir, 'hexo-butterfly-extjs/lib')
  const dest = path.join(hexo.public_dir, 'js/lib')
  fs.copySync(src, dest)
})

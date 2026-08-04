'use strict'

const path = require('path')
const yaml = require('js-yaml')
const { readFileSync, writeFileSync } = require('fs')

const baseFile = path.join(__dirname, 'plugins.yml')
const outputFile = path.join(__dirname, 'new_plugins.yml')

const ignore = new Set(['aplayer_css', 'aplayer_js', 'meting_js'])

const plugins = yaml.load(readFileSync(baseFile, 'utf8'))

Object.keys(plugins).forEach(key => {
  const plugin = plugins[key]

  if (ignore.has(key) || ignore.has(plugin.name) || ignore.has(plugin.other_name)) {
    delete plugins[key]
    return
  }

  const ver = require(path.join(__dirname, 'node_modules', plugin.name, 'package.json')).version
  plugin.version = ver
})

const yamlStr = yaml.dump(plugins, { lineWidth: -1 })
writeFileSync(outputFile, yamlStr, 'utf8')
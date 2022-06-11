'use strict'

const path = require('path')
const yaml = require('js-yaml')
const { readFileSync, writeFileSync } = require('fs')

const plugins = yaml.load(readFileSync(path.join(__dirname, '/plugins.yml')))

Object.keys(plugins).forEach(key => {
  const ver = require(`./node_modules/${plugins[key].name}/package.json`).version
  plugins[key].version = ver
})

const yamlStr = yaml.dump(plugins);
writeFileSync('./plugins.yml', yamlStr, 'utf8');
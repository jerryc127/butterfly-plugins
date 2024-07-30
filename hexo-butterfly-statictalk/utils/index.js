/* eslint-disable no-undef */
const hexoFile = require("hexo-fs");
const path = require("path");
const yaml = require("js-yaml");

// 定义一个函数，用来返回数据
function parseData(config, sourceDir) {
  const yamlContent = yaml.load(
    hexoFile.readFileSync(path.join(sourceDir, "./_data/talk.yml"))
  );
  return {
    content: yamlContent,
    config: config,
  };
}

module.exports = { parseData };

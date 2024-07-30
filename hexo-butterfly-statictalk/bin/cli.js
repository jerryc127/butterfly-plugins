#!/usr/bin/env node
/* eslint-disable no-undef */

const fs = require("fs");
const yaml = require("js-yaml");
const { resolve, join } = require("path");

const runPath = resolve("./");
const talkPath = join(runPath, "source", "_data", "talk.yml");

const talkData = yaml.load(fs.readFileSync(talkPath));

global.originTalkData = [];
global.addedTalkData = [];

talkData.map((item) => {
  if (item.timestamp != null) {
    global.originTalkData.push(item);
  } else {
    const timestampInMilliseconds = Date.now();
    item.timestamp = timestampInMilliseconds;
    global.addedTalkData.push(item);
  }
});

global.addedTalkData.map((item) => {
  global.originTalkData.unshift(item);
});

const yamlData = yaml.dump(global.originTalkData);

fs.writeFile(talkPath, yamlData, (cb) => {
  if (!cb || cb == undefined) {
    console.log("时间戳生成完成！");
  } else {
    throw cb;
  }
});

/* eslint-disable no-undef */
const pug = require("pug");
const path = require("path");
const utils = require(path.join(__dirname, "utils", "index.js"));
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const marked = require("marked");

// 配置 JSDOM
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// 配置 marked
marked.use({
  gfm: true,
  breaks: true,
});

// 注册 Hexo 插件
hexo.extend.generator.register("staticTalk", function () {
  const config = hexo.config.staticTalk || hexo.theme.config.staticTalk;

  // 配置不存在
  if (!config || config === undefined) {
    throw new Error("静态说说配置不存在");
  }

  // 配置未开启
  if (!config.enable) {
    return;
  }

  // 定义一个基本配置（结构体）
  const baseConfig = {
    enable: config.enable || false,
    title: config.title || "",
    avatar: config.avatar || hexo.theme.config.avatar.img || "",
    defaultStyle: config.defaultStyle || true,
    customStyle: config.customStyle || "",
    markdownRender: config.markdownRender || false,
  };

  // 调用 util 获取返回结果
  const utilsReturn = utils.parseData(baseConfig, hexo.source_dir);

  // XSS 过滤并渲染 markdown
  const xssFilter = utilsReturn.content.map((e) => {
    return {
      ...e,
      content: baseConfig.markdownRender
        ? DOMPurify.sanitize(marked.parse(e.content))
        : DOMPurify.sanitize(e.content),
    };
  });

  // 合并数据
  const renderData = {
    ...utilsReturn,
    content: xssFilter,
  };

  // 渲染
  const content = pug.renderFile(
    path.join(__dirname, "./lib/html.pug"),
    renderData
  );

  // 规定生成路径
  const generatePath = config.path || "statictalk";

  // 规定页面标题
  const title = baseConfig.title;

  return {
    path: generatePath + "/index.html",
    data: { title, content },
    layout: ["page", "post"],
  };
});

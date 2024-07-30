## hexo-butterfly-statictalk

给 hexo-theme-butterfly 添加静态说说

### 安装

1. 安装插件
    ```bash
    npm install hexo-butterfly-statictalk
    ```

2. 添加说说内容
    在 `Hexo 根目录/source/_data` 下新建 `talk.yml`

    单行基本格式如下：

    ```yaml
    - content: 我是内容！
      timestamp:
    ```
    多行基本格式如下：

    ```yaml
    - content: |
        静态说说，多行测试
        我是第二行
        我是第三行
      timestamp:
    ```

    在添加完成后执行 `npx hexo-butterfly-statictalk` 或者是 `pnpm/yarn hexo-butterfly-statictalk` 为说说生成时间
    如果是全局安装，可以直接使用 `hexo-butterfly-statictalk`
3. 添加配置信息
    在 **Hexo** 的配置文件 或者 **主题** 的配置文件中添加

    ```yaml
    staticTalk:
      enable:
      title:
      path:
      avatar:
      defaultStyle:
      customStyle:
      markdownRender:
    ```

### 配置解释

|     配置项     |                            默认值                            |         含义         |  类型   |
| :------------: | :----------------------------------------------------------: | :------------------: | :-----: |
|     enable     |                      false（**必选**）                       | 启用 staticTalk 插件 | Boolean |
|     title      |                        空（**可选**）                        |   配置说说页面标题   | String  |
|      path      |                    statictalk（**可选**）                    |   配置说说生成路径   | String  |
|     avatar     | 获取主题 `avatar.img` 配置或空（主题拥有 `avatar.img` 配置时**可选**） |     配置说说头像     | String  |
|  defaultStyle  |                       true（**可选**）                       |   使用插件默认样式   | Boolean |
|  customStyle   |         空（`defaultStyle` 配置为 true 时**可选**）          |    使用自定义样式    | String  |
| markdownRender |                      false（**可选**）                       |  开启 Markdown 渲染  | Boolean |

### 示例配置

```yaml
staticTalk:
  enable: true
  title: 说说
  path: statictalk
  avatar:
  defaultStyle: true
  customStyle:
  markdownRender: true
```

### 鸣谢

- [鹊楠吖~](https://github.com/QNquenan) 编写部分 CSS
- [Lete114/hexo-artitalk-static](https://github.com/Lete114/hexo-artitalk-static) 提供了数据结构和项目灵感
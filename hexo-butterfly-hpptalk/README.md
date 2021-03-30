## hexo-butterfly-hpptalk

給 hexo-theme-butterfly 添加 [hexoplusplus](https://hexoplusplus.js.org/) 説説

### 安裝

1. 安裝插件
    ```bash
    npm install hexo-butterfly-hpptalk
    ```

2. 前期部署
    參考 [hexoplusplus 文檔 - 快速上手](https://hexoplusplus.js.org/start/)

3. 添加配置信息
    在 **Hexo** 的配置文件 或者 **主題**的配置文件中添加

    ```yaml
    # HexoPlusPlus Talk
    # see https://hexoplusplus.js.org
    hpptalk:
      enable: true 
      domain:
      path:
      limit:
      start:
      js:
      css:
      option:
      front_matter:
    ```

    | 參數         | 解釋                                                         |
    | ------------ | ------------------------------------------------------------ |
    | domain       | 【必須】您的 HexoPlusPlus 域名，如 admin.immyw.com           |
    | limit        | 【可選】單次獲取的最多條數（默認 `8`）                       |
    | start        | 【可選】從第幾條開始（默認 `0`）                             |
    | path         | 【可選】hpptalk 的路徑名稱（默認為` hpptalk`，生成的頁面為 hpptalk/index.html） |
    | js           | 【可選】更換 hpptalk 的 JS CDN（默認：`https://cdn.jsdelivr.net/gh/HexoPlusPlus/HexoPlusPlus@latest/talk_user.js`) |
    | css          | 【可選】更換 hpptalk 的 CSS CDN（默認 `https://cdn.jsdelivr.net/gh/HexoPlusPlus/HexoPlusPlus@latest/talk.css`） |
    | option       | 【可選】hpptalk  需要的額外配置                              |
    | front_matter | 【可選】hpptalk 頁面的 front_matter 配置                     |

### 截圖

![image](https://user-images.githubusercontent.com/16351105/107789948-2f851800-6d8d-11eb-8727-e41a608aa661.png)
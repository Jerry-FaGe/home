简体中文 | [English](./README_EN.md)

# Jerry_FaGe の主页

这是 `Jerry-FaGe/home` 仓库维护的个人主页，用于部署 <https://jerryfage.top>。

本仓库基于 [`imsyy/home`](https://github.com/imsyy/home) 二次维护。源仓库已归档，当前仓库仅按个人站点需求继续修复、整理和部署。

![Jerry_FaGe の主页](/screenshots/main.jpg)

## 当前维护内容

- 适配本仓库站点信息、链接、备案和部署路径
- 使用和风天气 GeoAPI + 实时天气 API
- 天气定位优先使用 IPIP 获取粗略城市，再查询和风 LocationID
- 移除 `.env` 跟踪，使用 `.env.example` 和 GitHub Secrets 管理敏感配置
- 清理未使用依赖、未引用资源和临时工具产物
- 保留原项目的主页布局、音乐播放器、壁纸、时光进度条等交互体验

## 功能

- [x] 载入动画
- [x] 站点简介
- [x] Hitokoto 一言
- [x] 日期及时间
- [x] 实时天气
- [x] 时光进度条
- [x] 音乐播放器
- [x] 移动端适配
- [x] PWA 自动更新

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev

# 构建静态资源
pnpm build
```

如果从模板初始化本地环境，请复制环境变量模板：

```bash
cp .env.example .env
```

`.env` 只用于本地，不应提交到仓库。

## 部署

当前正式部署通过 GitHub Actions 的 `.github/workflows/deploy.yml` 完成：

- push 到 `dev` 分支触发构建
- CI 复制 `.env.example` 为 `.env`
- CI 从 GitHub Secrets 注入天气配置
- 构建产物上传为 artifact
- 通过 `appleboy/scp-action` 发布到服务器目录 `/home/Jerry_FaGe/home`

需要配置的 GitHub Secrets：

| Secret              | 用途                  | 是否必需             |
| ------------------- | --------------------- | -------------------- |
| `SERVER_HOST`       | 部署服务器地址        | 是                   |
| `SERVER_USERNAME`   | SSH 用户名            | 是                   |
| `SSH_PRIVATE_KEY`   | SSH 私钥              | 是                   |
| `QWEATHER_API_KEY`  | 和风天气 API Key      | 建议配置             |
| `QWEATHER_API_HOST` | 和风天气专属 API Host | 使用专属 Host 时配置 |

如果缺少 `QWEATHER_API_KEY`，CI 不会阻断构建，但线上天气可能不可用。

## 环境变量

主要配置位于 `.env.example`：

| 变量                         | 说明                                                |
| ---------------------------- | --------------------------------------------------- |
| `VITE_SITE_NAME`             | 站点标题                                            |
| `VITE_SITE_AUTHOR`           | 站点作者                                            |
| `VITE_SITE_KEYWORDS`         | SEO 关键词                                          |
| `VITE_SITE_DES`              | 站点描述                                            |
| `VITE_SITE_URL`              | 站点域名                                            |
| `VITE_SITE_BAIDUTONGJI`      | 百度统计 ID，留空则不注入统计脚本                   |
| `VITE_QWEATHER_KEY`          | 和风天气 API Key，本地开发可填写，CI 用 Secret 注入 |
| `VITE_QWEATHER_GEO_HOST`     | 和风 GeoAPI Host                                    |
| `VITE_QWEATHER_WEATHER_HOST` | 和风实时天气 API Host                               |
| `VITE_SITE_START`            | 建站日期                                            |
| `VITE_SITE_ICP`              | ICP 备案号                                          |
| `VITE_SONG_API`              | Meting API 地址                                     |
| `VITE_SONG_SERVER`           | 歌曲服务器                                          |
| `VITE_SONG_TYPE`             | 播放类型                                            |
| `VITE_SONG_ID`               | 播放 ID                                             |

## 天气

当前天气链路：

1. 请求 `https://myip.ipip.net/json` 获取粗略地区。
2. 使用城市和省份调用和风 GeoAPI 获取 LocationID。
3. 使用 LocationID 调用和风实时天气 API。
4. 如果 IP 粗定位失败，再降级到浏览器 Geolocation。

和风相关配置：

```bash
VITE_QWEATHER_KEY = ""
VITE_QWEATHER_GEO_HOST = ""
VITE_QWEATHER_WEATHER_HOST = ""
```

建议在和风控制台为 Key 配置域名限制，仅允许当前站点域名访问。

## 自定义内容

### 网站链接

修改：

```text
src/assets/siteLinks.json
```

图标来自 `@vicons/fa`，如需新增图标，需要在 `src/components/Links.vue` 中引入并加入 `siteIcon` 映射。

### 社交链接

修改：

```text
src/assets/socialLinks.json
```

### 背景图

本地背景图位于：

```text
public/images/background1.webp ... background10.webp
```

如需增加图片数量，需要同步调整 `src/components/Background.vue` 中的随机范围。

### 音乐

音乐播放器使用 Meting API 数据源，配置位于 `.env`：

```bash
VITE_SONG_API = "https://meting-api-omega.vercel.app/api"
VITE_SONG_SERVER = "netease"
VITE_SONG_TYPE = "playlist"
VITE_SONG_ID = "418849509"
```

## 技术栈

- [Vue](https://cn.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [IconPark](https://iconpark.oceanengine.com/official)
- [xicons](https://xicons.org/)
- [Swiper](https://swiperjs.com/)
- [APlayer](https://aplayer.js.org/)

## 鸣谢

感谢源仓库 [`imsyy/home`](https://github.com/imsyy/home) 提供的主页设计、交互结构和基础实现。本仓库是在该项目基础上的个人维护版本。

同时感谢以下服务和项目：

- [QWeather 和风天气](https://dev.qweather.com/)
- [IPIP](https://www.ipip.net/)
- [Hitokoto 一言](https://hitokoto.cn/)
- [Meting API](https://github.com/xizeyoupan/Meting-API)

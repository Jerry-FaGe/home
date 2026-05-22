English | [简体中文](./README.md)

# Jerry_FaGe Homepage

This is the maintained personal homepage repository for <https://jerryfage.top>.

It is based on [`imsyy/home`](https://github.com/imsyy/home). The upstream repository has been archived, so this repository is now maintained only for this personal site.

![Jerry_FaGe Homepage](/screenshots/main.jpg)

## What This Fork Maintains

- Site metadata, links, ICP record, and deployment paths for this repository
- QWeather GeoAPI and real-time weather integration
- IP-based rough city lookup through IPIP, then QWeather LocationID lookup
- `.env` removed from version control; sensitive values are injected through GitHub Secrets
- Cleanup of unused dependencies, unused assets, and temporary tool output
- Original layout, music player, background switching, time capsule, and mobile experience

## Features

- [x] Loading animation
- [x] Site profile
- [x] Hitokoto quote
- [x] Date and time
- [x] Live weather
- [x] Time capsule
- [x] Music player
- [x] Mobile layout
- [x] PWA auto update

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build static assets
pnpm build
```

Create your local env file from the template:

```bash
cp .env.example .env
```

`.env` is local-only and should not be committed.

## Deployment

Production deployment is handled by `.github/workflows/deploy.yml`:

- Pushes to the `dev` branch trigger the workflow.
- CI copies `.env.example` to `.env`.
- Weather credentials are injected from GitHub Secrets.
- The static build output is uploaded as an artifact.
- `appleboy/scp-action` deploys the build to `/home/Jerry_FaGe/home` on the server.

Required GitHub Secrets:

| Secret              | Purpose                     | Required    |
| ------------------- | --------------------------- | ----------- |
| `SERVER_HOST`       | Deployment server host      | Yes         |
| `SERVER_USERNAME`   | SSH username                | Yes         |
| `SSH_PRIVATE_KEY`   | SSH private key             | Yes         |
| `QWEATHER_API_KEY`  | QWeather API key            | Recommended |
| `QWEATHER_API_HOST` | Dedicated QWeather API host | Optional    |

If `QWEATHER_API_KEY` is missing, CI will continue, but live weather may be unavailable.

## Environment Variables

Main configuration is documented in `.env.example`:

| Variable                     | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `VITE_SITE_NAME`             | Site title                                                    |
| `VITE_SITE_AUTHOR`           | Site author                                                   |
| `VITE_SITE_KEYWORDS`         | SEO keywords                                                  |
| `VITE_SITE_DES`              | Site description                                              |
| `VITE_SITE_URL`              | Site domain                                                   |
| `VITE_SITE_BAIDUTONGJI`      | Baidu Analytics ID; leave empty to disable injection          |
| `VITE_QWEATHER_KEY`          | QWeather API key for local development; CI injects the Secret |
| `VITE_QWEATHER_GEO_HOST`     | QWeather GeoAPI host                                          |
| `VITE_QWEATHER_WEATHER_HOST` | QWeather real-time weather API host                           |
| `VITE_SITE_START`            | Site start date                                               |
| `VITE_SITE_ICP`              | ICP record number                                             |
| `VITE_SONG_API`              | Meting API endpoint                                           |
| `VITE_SONG_SERVER`           | Music provider                                                |
| `VITE_SONG_TYPE`             | Playback type                                                 |
| `VITE_SONG_ID`               | Song or playlist ID                                           |

## Weather

Current weather flow:

1. Fetch rough IP location from `https://myip.ipip.net/json`.
2. Query QWeather GeoAPI with city and province to get LocationID.
3. Query QWeather real-time weather by LocationID.
4. If IP lookup fails, fall back to browser Geolocation.

QWeather configuration:

```bash
VITE_QWEATHER_KEY = ""
VITE_QWEATHER_GEO_HOST = ""
VITE_QWEATHER_WEATHER_HOST = ""
```

It is recommended to restrict the QWeather key to the production domain in the QWeather console.

## Customization

### Site Links

Edit:

```text
src/assets/siteLinks.json
```

Icons come from `@vicons/fa`. To add a new icon, import it in `src/components/Links.vue` and register it in the `siteIcon` map.

### Social Links

Edit:

```text
src/assets/socialLinks.json
```

### Background Images

Local backgrounds are stored as:

```text
public/images/background1.webp ... background10.webp
```

If you add more images, update the random range in `src/components/Background.vue`.

### Music

The music player uses a Meting API endpoint configured in `.env`:

```bash
VITE_SONG_API = "https://meting-api-omega.vercel.app/api"
VITE_SONG_SERVER = "netease"
VITE_SONG_TYPE = "playlist"
VITE_SONG_ID = "418849509"
```

## Tech Stack

- [Vue](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [IconPark](https://iconpark.oceanengine.com/official)
- [xicons](https://xicons.org/)
- [Swiper](https://swiperjs.com/)
- [APlayer](https://aplayer.js.org/)

## Acknowledgements

Thanks to the upstream project [`imsyy/home`](https://github.com/imsyy/home) for the original homepage design, interactions, and implementation. This repository is a personal maintenance fork based on that project.

Thanks also to:

- [QWeather](https://dev.qweather.com/)
- [IPIP](https://www.ipip.net/)
- [Hitokoto](https://hitokoto.cn/)
- [Meting API](https://github.com/xizeyoupan/Meting-API)

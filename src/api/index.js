// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

const normalizeQWeatherHost = (host, fallback) => {
  const value = (host || fallback || "").trim();
  if (!value) {
    return fallback;
  }
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
};

const qweatherApiKey = import.meta.env.VITE_QWEATHER_KEY;
const qweatherWeatherHost = normalizeQWeatherHost(
  import.meta.env.VITE_QWEATHER_WEATHER_HOST,
  "https://devapi.qweather.com",
);
const qweatherGeoHost = normalizeQWeatherHost(
  import.meta.env.VITE_QWEATHER_GEO_HOST,
  "https://geoapi.qweather.com",
);

const getQWeatherHeaders = () => {
  if (!qweatherApiKey) {
    throw new Error("未配置和风天气 API Key");
  }
  return {
    "X-QW-Api-Key": qweatherApiKey,
  };
};

// 根据城市名、LocationID、经纬度或 Adcode 获取地区信息
export const getQWeatherGeo = async (location, latitude, adm) => {
  const queryLocation = latitude === undefined ? location : `${location},${latitude}`;
  const params = new URLSearchParams({ location: queryLocation, number: "1", lang: "zh" });
  if (adm) {
    params.set("adm", adm);
  }

  const res = await fetch(`${qweatherGeoHost}/geo/v2/city/lookup?${params.toString()}`, {
    headers: getQWeatherHeaders(),
  });
  const data = await res.json();
  if (!res.ok || data.code !== "200") {
    throw new Error(data?.error?.detail || data?.code || `和风 GeoAPI 请求失败: ${res.status}`);
  }
  return data;
};

// 获取和风实时天气
export const getQWeatherNow = async (locationId) => {
  const res = await fetch(`${qweatherWeatherHost}/v7/weather/now?location=${locationId}&lang=zh`, {
    headers: getQWeatherHeaders(),
  });
  const data = await res.json();
  if (!res.ok || data.code !== "200") {
    throw new Error(data?.error?.detail || data?.code || `和风天气请求失败: ${res.status}`);
  }
  return data;
};

<template>
  <div class="weather" v-if="weatherData.city && weatherData.weather.weather">
    <span>{{ weatherData.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        !weatherData.weather.winddirection || weatherData.weather.winddirection.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getQWeatherGeo, getQWeatherNow } from "@/api";
import { Error as ErrorIcon } from "@icon-park/vue-next";

// 天气数据
const weatherData = reactive({
  city: null, // 城市
  locationId: null, // 和风天气 LocationID
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

const GEOLOCATION_ERROR_CODE = {
  1: "PERMISSION_DENIED",
  2: "POSITION_UNAVAILABLE",
  3: "TIMEOUT",
};

// 通过浏览器 Geolocation 获取坐标
const getBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("浏览器不支持定位"));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  });

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 优先使用和风 GeoAPI 按访问 IP 定位，避免触发浏览器位置授权
    let geoData;
    try {
      geoData = await getQWeatherGeo("auto:ip");
    } catch (ipErr) {
      console.warn("IP 定位失败，尝试浏览器定位:", ipErr);
      let position;
      try {
        position = await getBrowserPosition();
      } catch (geoErr) {
        console.warn("浏览器定位失败:", {
          code: GEOLOCATION_ERROR_CODE[geoErr.code] || geoErr.code,
          message: geoErr.message,
        });
        throw geoErr;
      }
      const longitude = Number(position.lon).toFixed(2);
      const latitude = Number(position.lat).toFixed(2);
      geoData = await getQWeatherGeo(`${longitude},${latitude}`);
    }

    const location = geoData.location?.[0];
    if (!location?.id) {
      throw new Error("地区查询失败");
    }

    weatherData.city = location.name || location.adm2 || location.adm1 || "未知地区";
    weatherData.locationId = location.id;

    const weatherResult = await getQWeatherNow(weatherData.locationId);
    const now = weatherResult.now;
    if (!now) {
      throw new Error("天气信息获取失败");
    }

    weatherData.weather = {
      weather: now.text,
      temperature: now.temp,
      winddirection: now.windDir,
      windpower: now.windScale,
    };
  } catch (error) {
    console.error("天气信息获取失败:", error);
    onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(ErrorIcon, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  getWeatherData();
});
</script>

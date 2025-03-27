/**
 * 天氣 Dashboard API 整合 - 為 Python 開發者準備
 * 
 * 這個練習整合了天氣 API，展示如何處理天氣數據，
 * 包括處理 API 請求、數據轉換、錯誤處理和 UI 更新。
 * 
 * 注意：實際應用中，您需要從 OpenWeatherMap 或類似服務獲取 API 密鑰。
 * 本例中使用的 API 端點僅用於示範目的。
 */

// ========================
// 配置
// ========================

const WEATHER_API_KEY = 'your_api_key';  // 實際應用中請替換為真實的 API 密鑰
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 模擬 DOM 更新 (在瀏覽器環境中，這些會是真實的 DOM 操作)
const UI = {
  updateCurrentWeather: (data) => {
    console.log('更新當前天氣 UI：', data);
    // 在實際應用中：document.getElementById('temperature').textContent = data.temp;
  },
  
  updateForecast: (data) => {
    console.log('更新天氣預報 UI：', data.slice(0, 2));  // 只顯示前兩天的預報
    // 在實際應用中：使用循環為每個預報日期創建元素
  },
  
  showLoading: () => {
    console.log('顯示載入中...');
    // 在實際應用中：document.getElementById('loading').style.display = 'block';
  },
  
  hideLoading: () => {
    console.log('隱藏載入中...');
    // 在實際應用中：document.getElementById('loading').style.display = 'none';
  },
  
  showError: (message) => {
    console.error('錯誤：', message);
    // 在實際應用中：
    // const errorEl = document.getElementById('error-message');
    // errorEl.textContent = message;
    // errorEl.style.display = 'block';
  }
};

// ========================
// API 服務
// ========================

// 創建天氣 API 服務
const weatherService = {
  // 獲取當前天氣
  getCurrentWeather: async (city) => {
    // 創建帶有超時的請求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10 秒超時
    
    try {
      // 實際應用中，這將是真實的 API 調用
      // const response = await fetch(
      //   `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`,
      //   { signal: controller.signal }
      // );
      
      // 為了演示目的，我們模擬 API 響應
      const response = await simulateWeatherApiCall(city, 'current');
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`找不到城市 "${city}" 的天氣數據`);
        }
        throw new Error(`獲取天氣數據失敗：HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return transformCurrentWeather(data);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('請求超時，請檢查您的網絡連接');
      }
      
      throw error;
    }
  },
  
  // 獲取天氣預報
  getForecast: async (city) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // 實際應用中
      // const response = await fetch(
      //   `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`,
      //   { signal: controller.signal }
      // );
      
      // 模擬 API 響應
      const response = await simulateWeatherApiCall(city, 'forecast');
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`找不到城市 "${city}" 的預報數據`);
        }
        throw new Error(`獲取預報數據失敗：HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return transformForecast(data);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('預報數據請求超時');
      }
      
      throw error;
    }
  },
  
  // 一次獲取當前天氣和預報
  getWeatherData: async (city) => {
    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      
      return {
        current: currentWeather,
        forecast: forecast,
        city: city,
        timestamp: new Date()
      };
    } catch (error) {
      // 重新拋出合併的錯誤
      throw new Error(`無法獲取 ${city} 的完整天氣數據：${error.message}`);
    }
  }
};

// ========================
// 數據轉換函數
// ========================

// 轉換當前天氣數據
function transformCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind: {
      speed: data.wind.speed,
      direction: getWindDirection(data.wind.deg)
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
    lastUpdated: new Date()
  };
}

// 轉換天氣預報數據
function transformForecast(data) {
  // 按日期分組
  const groupedByDay = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(item);
  });
  
  // 將每天的預報數據轉換為每日摘要
  return Object.keys(groupedByDay).map(date => {
    const dayData = groupedByDay[date];
    const temps = dayData.map(item => item.main.temp);
    
    return {
      date: new Date(dayData[0].dt * 1000),
      minTemp: Math.round(Math.min(...temps)),
      maxTemp: Math.round(Math.max(...temps)),
      description: dayData[Math.floor(dayData.length / 2)].weather[0].description,
      icon: dayData[Math.floor(dayData.length / 2)].weather[0].icon,
      hourly: dayData.map(item => ({
        time: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    };
  });
}

// 轉換風向角度為可讀文本
function getWindDirection(degrees) {
  const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
  return directions[Math.round(degrees / 45) % 8];
}

// ========================
// 緩存 (Cache) 支持
// ========================

// 簡單的緩存系統
const weatherCache = {
  data: {}, // city -> { timestamp, data }
  
  set: function(city, data) {
    this.data[city.toLowerCase()] = {
      timestamp: Date.now(),
      data: data
    };
  },
  
  get: function(city) {
    const cacheEntry = this.data[city.toLowerCase()];
    if (!cacheEntry) return null;
    
    // 緩存 30 分鐘 (1800000 毫秒)
    if (Date.now() - cacheEntry.timestamp > 1800000) {
      delete this.data[city.toLowerCase()];
      return null;
    }
    
    return cacheEntry.data;
  },
  
  clear: function() {
    this.data = {};
  }
};

// ========================
// 主應用函數
// ========================

// 加載城市的天氣數據
async function loadWeatherForCity(city, forceRefresh = false) {
  UI.showLoading();
  UI.showError('');
  
  try {
    let weatherData;
    
    // 檢查緩存
    if (!forceRefresh) {
      const cachedData = weatherCache.get(city);
      if (cachedData) {
        console.log(`使用緩存的 ${city} 天氣數據`);
        weatherData = cachedData;
      }
    }
    
    // 如果沒有緩存或強制刷新，則從 API 獲取
    if (!weatherData) {
      weatherData = await weatherService.getWeatherData(city);
      weatherCache.set(city, weatherData);
    }
    
    // 更新 UI
    UI.updateCurrentWeather(weatherData.current);
    UI.updateForecast(weatherData.forecast);
    
    return weatherData;
  } catch (error) {
    UI.showError(error.message);
    console.error('獲取天氣數據時出錯:', error);
    return null;
  } finally {
    UI.hideLoading();
  }
}

// 搜索天氣按鈕的事件處理函數
function handleWeatherSearch(event) {
  // 在實際應用中，這將阻止表單提交
  // event.preventDefault();
  
  const city = 'Taipei'; // 在實際應用中：從輸入框獲取，例如 document.getElementById('city-input').value;
  
  if (!city.trim()) {
    UI.showError('請輸入城市名稱');
    return;
  }
  
  // 重新獲取天氣數據
  loadWeatherForCity(city, true);
}

// ========================
// 模擬 API 調用（僅用於演示）
// ========================

// 模擬 API 響應
function simulateWeatherApiCall(city, type) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (city.toLowerCase() === 'error') {
        resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: () => Promise.resolve({
            message: 'City not found'
          })
        });
        return;
      }
      
      if (type === 'current') {
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            name: city,
            main: {
              temp: 25.5,
              feels_like: 26.2,
              humidity: 65,
              pressure: 1013
            },
            weather: [
              {
                description: '晴時多雲',
                icon: '02d'
              }
            ],
            wind: {
              speed: 3.5,
              deg: 180
            },
            sys: {
              country: 'TW',
              sunrise: Math.floor(Date.now() / 1000) - 21600,
              sunset: Math.floor(Date.now() / 1000) + 21600
            }
          })
        });
      } else if (type === 'forecast') {
        // 創建模擬的 5 天預報數據
        const forecastData = {
          list: []
        };
        
        const now = Date.now();
        for (let i = 0; i < 5; i++) {
          // 為每天添加 4 個時段預報
          for (let h = 0; h < 4; h++) {
            forecastData.list.push({
              dt: Math.floor(now / 1000) + (i * 86400) + (h * 21600),
              main: {
                temp: 22 + Math.random() * 10,
                humidity: 60 + Math.floor(Math.random() * 20)
              },
              weather: [
                {
                  description: ['晴天', '多雲', '小雨', '陰天'][Math.floor(Math.random() * 4)],
                  icon: ['01d', '02d', '03d', '04d', '10d'][Math.floor(Math.random() * 5)]
                }
              ]
            });
          }
        }
        
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(forecastData)
        });
      }
    }, 800);
  });
}

// ========================
// 執行應用程序
// ========================

// 自動加載預設城市的天氣數據
console.log('天氣儀表板應用已啟動');
loadWeatherForCity('Taipei');
console.log('可使用 handleWeatherSearch() 來搜尋其他城市的天氣');
console.log('可使用 loadWeatherForCity("城市名稱", true) 來強制刷新天氣數據');

/**
 * 練習拓展想法：
 * 
 * 1. 添加地理位置檢測 - 使用瀏覽器的 geolocation API 獲取用戶位置
 * 2. 添加多城市支持 - 允許用戶保存多個城市並切換
 * 3. 實現更多緩存策略 - 如離線支持，使用 localStorage
 * 4. 添加溫度單位轉換 - 在攝氏度和華氏度之間切換
 * 5. 使用 AbortController 實現取消舊的請求
 * 6. 添加圖表顯示溫度趨勢
 * 7. 錯誤重試機制 - 自動重試失敗的請求
 */

// 匯出供模塊使用
export {
  loadWeatherForCity,
  handleWeatherSearch,
  weatherService,
  weatherCache
}; 
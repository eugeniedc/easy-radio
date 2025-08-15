import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Easy Radio'
      },
      channels: {
        radio1: 'RTHK Radio 1'
      },
      player: {
        play: 'Play',
        pause: 'Pause',
        stop: 'Stop',
        mute: 'Mute',
        unmute: 'Unmute',
        volume: 'Volume',
        error: 'Error playing stream',
        retry: 'Retry',
        loading: 'Loading...'
      },
      ui: {
        language: 'Language',
        english: 'English',
        chinese: 'Chinese'
      }
    }
  },
  zh: {
    translation: {
      app: {
        title: '易收音機'
      },
      channels: {
        radio1: 'RTHK 第一台'
      },
      player: {
        play: '播放',
        pause: '暫停',
        stop: '停止',
        mute: '靜音',
        unmute: '取消靜音',
        volume: '音量',
        error: '播放流錯誤',
        retry: '重試',
        loading: '載入中...'
      },
      ui: {
        language: '語言',
        english: 'English',
        chinese: '中文'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // Default to Chinese
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
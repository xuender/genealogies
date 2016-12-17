import { Injectable } from '@angular/core';
import { Clipboard, NativeAudio, Vibration, GoogleAnalytics } from 'ionic-native';
import { Platform } from 'ionic-angular';
/**
 * 反馈服务
 */
@Injectable()
export class BackService {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      try {
        GoogleAnalytics.startTrackerWithId('UA-64143538-11');
      } catch (error) {
        console.error('GoogleAnalytics: ' + error);
      }
      NativeAudio.preloadSimple('touch', 'assets/audio/touch.mp3');
    });
  }
  // 粘贴
  paste(): Promise<string> {
    return Clipboard.paste();
  }
  // 复制
  copy(str: string) {
    try {
      Clipboard.copy(str);
    } catch (error) {
      console.error('copy', error);
    }
  }
  // 触摸
  touch() {
    try {
      NativeAudio.play('touch');
    } catch (error) {
      console.debug('touch', error);
    }
  }
  hold() {
    try {
      Vibration.vibrate(10);
    } catch (error) {
      console.debug('hold', error);
    }
  }
  trackView(name: string) {
    this.platform.ready().then(() => {
      GoogleAnalytics.trackView(name);
      this.touch();
    });
  }
  trackAction(category: string, action: string) {
    this.platform.ready().then(() => {
      GoogleAnalytics.trackEvent(category, action);
    });
  }
  trackEvent(category: string, action: string, label: string, value: number) {
    this.platform.ready().then(() => {
      GoogleAnalytics.trackEvent(category, action, label, value);
    });
  }
}

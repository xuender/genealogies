import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Clipboard, NativeAudio, Vibration, GoogleAnalytics } from 'ionic-native';

import { StorageService } from './storage-service';

@Injectable()
export class BackService {
	private _vibration: boolean;
	private _audio: boolean;
	private isInit: boolean;

	public get vibration(): boolean {
		return this._vibration;
	}
	public set vibration(v: boolean) {
		this._vibration = v;
		this.storageService.setItem('vibration', v);
	}

	public get audio(): boolean {
		return this._audio;
	}
	public set audio(v: boolean) {
		this._audio = v;
		this.storageService.setItem('audio', v);
	}

	constructor(
		private platform: Platform,
		private storageService: StorageService
	) {
		this.isInit = false;
		this._audio = this.storageService.getItem('audio', true);
		this._vibration = this.storageService.getItem('vibration', true);
		this.platform.ready().then(() => {
			try {
				GoogleAnalytics.startTrackerWithId('UA-64143538-11');
			} catch (error) {
				console.error('GoogleAnalytics: ' + error);
			}
			NativeAudio.preloadSimple('touch', 'assets/audio/touch.mp3')
			.then(() => this.isInit = true);
		});
	}

	paste(): Promise<string> {
		return Clipboard.paste();
	}

	copy(str: string) {
		try {
			Clipboard.copy(str);
		} catch (error) {
			console.error('copy', error);
		}
	}

	touch() {
		try {
			if (this.isPlay()) {
				NativeAudio.play('touch');
			}
		} catch (error) {
			console.error('touch', error);
		}
	}

	private isPlay(): boolean {
		return this.isInit && this.audio;
	}

	hold() {
		try {
			if (this.vibration) {
				Vibration.vibrate(20);
			}
		} catch (error) {
			console.error('hold', error);
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

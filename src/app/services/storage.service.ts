import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Save a mood with today's date as key
  async saveMood(date: string, data: { mood: number, note: string }) {
    await this._storage?.set(date, data);
  }

  // Get all saved moods
  async getAllMoods() {
    const keys = await this._storage?.keys();
    const moods: any[] = [];

    for (const key of keys || []) {
      const entry = await this._storage?.get(key);
      if (entry) moods.push({ date: key, ...entry });
    }

    return moods;
  }

  // Get mood for a specific day
  async getMood(date: string) {
    return await this._storage?.get(date);
  }
}

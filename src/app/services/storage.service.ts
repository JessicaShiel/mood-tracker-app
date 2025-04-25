import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }
  
  private initPromise: Promise<void>;
  
  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ready() {
    if (this.initPromise) await this.initPromise;
  }

  // Save a mood with today's date as key
async saveMood(date: string, data: { mood: number, note: string }) {
  await this.ready();
  await this._storage?.set(date, data);
}

async getAllMoods() {
  await this.ready();
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
    await this.ready();
    return await this._storage?.get(date);
  }

    // Delete a specific mood by its date key
    async deleteMood(date: string) {
      await this.ready();
      await this._storage?.remove(date);
    }
}

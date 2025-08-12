import fs from 'fs-extra';
import path from 'path';

interface Settings {
  spotifyClientId?: string;
  spotifyClientSecret?: string;
}

const SETTINGS_FILE = path.join(__dirname, '../../../data/settings.json');

export class SettingsManager {
  static async getSettings(): Promise<Settings> {
    try {
      if (await fs.pathExists(SETTINGS_FILE)) {
        return await fs.readJson(SETTINGS_FILE);
      }
      return {};
    } catch (error) {
      console.error('Error reading settings:', error);
      return {};
    }
  }

  static async saveSettings(settings: Settings): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(SETTINGS_FILE));
      await fs.writeJson(SETTINGS_FILE, settings, { spaces: 2 });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...updates };
    await this.saveSettings(newSettings);
    return newSettings;
  }
}

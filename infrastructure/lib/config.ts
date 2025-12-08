export class Config {
  static get(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (!value && !defaultValue) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue || '';
  }
}

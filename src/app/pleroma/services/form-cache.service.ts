import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormCacheService {
  private cache: { [key: string]: any } = {};

  // Guardar datos en el caché
  setCache(key: string, data: any): void {
    this.cache[key] = data;
  }

  // Recuperar datos del caché
  getCache(key: string): any | null {
    return this.cache[key] || null;
  }

  // Limpiar datos del caché
  clearCache(key: string): void {
    delete this.cache[key];
  }
}

// src/utils/geocoding/nominatim-service.ts
import axios from 'axios';

interface AddressInput {
  address: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  houseNumber: string;
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

interface NominatimResponse {
  lat?: string;
  lon?: string;
  display_name?: string;
}

export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeocodingError';
  }
}

class RequestQueue {
  private queue: Array<{
    task: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private isProcessing = false;
  private readonly delayMs: number = 1100;

  public enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { task, resolve, reject } = this.queue.shift()!;

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        this.isProcessing = false;
        this.processQueue();
      }, this.delayMs);
    }
  }
}

const requestQueue = new RequestQueue();

async function tryGeocode(query: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;

    const response = await axios.get<NominatimResponse[]>(url, {
      headers: {
        'User-Agent': 'AgendaSaude/1.0 (https://agenda-saude-beta.vercel.app)',
      },
      timeout: 10000
    });

    if (response.data?.[0]?.lat && response.data[0].lon) {
      const lat = parseFloat(response.data[0].lat);
      const lon = parseFloat(response.data[0].lon);

      if (!isNaN(lat) && !isNaN(lon)) {
        return { latitude: lat, longitude: lon };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function geocodeAddress(address: AddressInput): Promise<GeocodingResult> {
  return requestQueue.enqueue(async () => {
    const queries = [
      `${address.address}, ${address.houseNumber}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.cep}`,
      `${address.address}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.cep}`,
      `${address.address}, ${address.city}, ${address.state}, ${address.cep}`,
      address.cep,
      `${address.city}, ${address.state}`,
      address.city
    ].filter(q => q && q.trim());

    for (const query of queries) {
      const result = await tryGeocode(query);
      if (result) {
        return result;
      }
    }

    throw new GeocodingError('Não foi possível encontrar coordenadas para o endereço');
  });
}

export async function geocodeAddressWithFallbacks(address: AddressInput): Promise<GeocodingResult> {
  return geocodeAddress(address);
}
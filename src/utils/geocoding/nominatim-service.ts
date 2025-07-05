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
  error?: string;
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

export async function geocodeAddress(address: AddressInput): Promise<GeocodingResult> {
  return requestQueue.enqueue(() => performGeocode(address));
}

async function performGeocode(address: AddressInput): Promise<GeocodingResult> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const fullAddress = formatAddress(address);

      const encodedAddress = encodeURIComponent(fullAddress);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=1`;

      const response = await axios.get<NominatimResponse[]>(url, {
        headers: {
          'User-Agent': 'AgendaSaude/1.0 (https://agenda-saude-beta.vercel.app)',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        timeout: 10000 // 10 segundos de timeout
      });

      if (response.data && response.data.length > 0 && response.data[0].lat && response.data[0].lon) {
        const result = {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon)
        };

        return result;
      }

      throw new GeocodingError('Não foi possível encontrar coordenadas para o endereço fornecido');
    } catch (error) {
      retries++;

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          const waitTime = 2000 * retries;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }

      if (retries >= maxRetries) {
        if (error instanceof GeocodingError) {
          throw error;
        }
        throw new GeocodingError(`Erro na geocodificação após ${maxRetries} tentativas: ${(error as Error).message}`);
      }

      const waitTime = 1000 * retries;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new GeocodingError('Número máximo de tentativas excedido');
}

function formatAddress(address: AddressInput): string {
  const formatted = `${address.address}, ${address.houseNumber}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.cep}, Brasil`;
  return formatted;
}

export async function geocodeAddressWithFallbacks(address: AddressInput): Promise<GeocodingResult> {
  try {
    return await geocodeAddress(address);
  } catch (error) {

    try {
      return await requestQueue.enqueue(async () => {
        const simplifiedAddress = `${address.address}, ${address.city}, ${address.state}, Brasil`;

        const encodedAddress = encodeURIComponent(simplifiedAddress);
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

        const response = await axios.get<NominatimResponse[]>(url, {
          headers: { 'User-Agent': 'AgendaSaude/1.0 (https://agenda-saude-beta.vercel.app)' },
          timeout: 10000
        });

        if (response.data && response.data.length > 0 && response.data[0].lat && response.data[0].lon) {
          const result = {
            latitude: parseFloat(response.data[0].lat),
            longitude: parseFloat(response.data[0].lon)
          };
          return result;
        }

        throw new GeocodingError('Não foi possível encontrar coordenadas mesmo com formato simplificado');
      });
    } catch (secondError) {
      throw error;
    }
  }
}
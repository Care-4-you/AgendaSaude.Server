import axios from 'axios';

interface StructuredAddress {
  address?: string;
  cep?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  houseNumber?: string;
}

type AddressInput = string | StructuredAddress;

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

interface NominatimRow {
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

/* -------------------------
   Simple rate-limiter queue
   (1 request por ~1.1s => polite with Nominatim)
   ------------------------- */
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = false;
  private readonly delayMs = 1100;

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const res = await task();
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length) {
      const job = this.queue.shift()!;
      await job();
      await new Promise(r => setTimeout(r, this.delayMs));
    }
    this.running = false;
  }
}

const requestQueue = new RequestQueue();

/* -------------------------
   Helpers: CEP normalization + ViaCEP lookup
   ------------------------- */
function normalizeCep(raw?: string): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D+/g, '');
  if (digits.length !== 8) return null;
  return digits;
}

async function fetchViaCep(cep: string): Promise<Partial<StructuredAddress> | null> {
  try {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const { data } = await axios.get(url, { timeout: 5000 });
    if (data && !data.erro) {
      return {
        address: data.logradouro || undefined,
        neighborhood: data.bairro || undefined,
        city: data.localidade || undefined,
        state: data.uf || undefined,
        cep
      };
    }
    return null;
  } catch {
    return null;
  }
}

/* -------------------------
   Nominatim structured search (muito mais preciso que q=free-text)
   ------------------------- */
async function nominatimStructuredSearch(params: Record<string, string | undefined>): Promise<GeocodingResult | null> {
  const url = 'https://nominatim.openstreetmap.org/search';
  const axiosParams = {
    ...params,
    format: 'jsonv2',
    addressdetails: 1,
    limit: 1,
    countrycodes: 'br'
  };

  try {
    const { data } = await axios.get<NominatimRow[]>(url, {
      params: axiosParams,
      headers: {
        'User-Agent': 'AgendaSaude/1.0 (https://agenda-saude-beta.vercel.app)',
        'Accept-Language': 'pt-BR'
      },
      timeout: 10000
    });

    if (Array.isArray(data) && data[0] && data[0].lat && data[0].lon) {
      const lat = parseFloat(data[0].lat!);
      const lon = parseFloat(data[0].lon!);
      if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
    }
    return null;
  } catch {
    return null;
  }
}

/* Free-text fallback (último recurso) */
async function nominatimFreeText(q: string): Promise<GeocodingResult | null> {
  const url = 'https://nominatim.openstreetmap.org/search';
  try {
    const { data } = await axios.get<NominatimRow[]>(url, {
      params: {
        q: q,
        format: 'jsonv2',
        limit: 1,
        addressdetails: 1,
        countrycodes: 'br'
      },
      headers: {
        'User-Agent': 'AgendaSaude/1.0 (https://agenda-saude-beta.vercel.app)',
        'Accept-Language': 'pt-BR'
      },
      timeout: 10000
    });

    if (Array.isArray(data) && data[0] && data[0].lat && data[0].lon) {
      const lat = parseFloat(data[0].lat!);
      const lon = parseFloat(data[0].lon!);
      if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
    }
    return null;
  } catch {
    return null;
  }
}

/* -------------------------
   Construção de tentativas (mais precisas primeiro)
   ------------------------- */
function buildStructuredParamsFromStructured(addr: StructuredAddress, viaCep?: Partial<StructuredAddress>) {
  // prioriza valores vindos de structuredAddress, senão viaCep
  const street = (addr.address || viaCep?.address || '').trim() || undefined;
  const neighborhood = (addr.neighborhood || viaCep?.neighborhood || '').trim() || undefined;
  const city = (addr.city || viaCep?.city || '').trim() || undefined;
  const state = (addr.state || viaCep?.state || '').trim() || undefined;
  const postalcode = normalizeCep(addr.cep || viaCep?.cep || '') || undefined;
  const houseNumber = (addr.houseNumber || '').trim();

  // streetParam: "Rua ABC, 123" (Nominatim espera número junto ao street para posicionar corretamente)
  const streetParam = street && houseNumber ? `${street}, ${houseNumber}` : street;

  return { streetParam, neighborhood, city, state, postalcode };
}

/* -------------------------
   Função principal: tenta várias estratégias
   ------------------------- */
export async function geocodeAddress(address: AddressInput): Promise<GeocodingResult> {
  return requestQueue.enqueue(async () => {
    // validação básica
    if (!address || (typeof address === 'string' && !address.trim())) {
      throw new GeocodingError('Endereço não pode estar vazio');
    }
    if (typeof address === 'object' && Object.values(address).every(v => !v || !String(v).trim())) {
      throw new GeocodingError('Pelo menos um campo do endereço deve ser preenchido');
    }

    // 1) Caso address seja string -> tenta free-text + versão com ", Brasil"
    if (typeof address === 'string') {
      const raw = address.trim();
      const tries = [raw];
      if (!/brasil|brazil/i.test(raw)) tries.push(`${raw}, Brasil`);

      // se string parece com CEP (apenas dígitos ou formato) -> normaliza e tenta ViaCEP + structured
      const maybeCep = normalizeCep(raw);
      if (maybeCep) {
        const viaCep = await fetchViaCep(maybeCep);
        if (viaCep) {
          const params = {
            street: viaCep.address,
            city: viaCep.city,
            state: viaCep.state,
            postalcode: maybeCep,
            country: 'Brasil'
          };
          const result = await nominatimStructuredSearch(params);
          if (result) return result;
        }
      }

      for (const q of tries) {
        const r = await nominatimFreeText(q);
        if (r) return r;
      }

      throw new GeocodingError('Não foi possível encontrar coordenadas para o endereço (string).');
    }

    // 2) Caso seja StructuredAddress => tenta ViaCEP (se CEP), depois busca estruturada precisa
    const structured = address as StructuredAddress;
    let viaCepInfo: Partial<StructuredAddress> | undefined;
    const cepNorm = normalizeCep(structured.cep);
    if (cepNorm) {
      viaCepInfo = await fetchViaCep(cepNorm) || undefined;
      // sobrescreve cep normalizado
      structured.cep = cepNorm;
    }

    const { streetParam, neighborhood, city, state, postalcode } = buildStructuredParamsFromStructured(structured, viaCepInfo);

    // tentativa A: busca estruturada com rua + número + cidade + estado + postalcode
    if (streetParam || city || state || postalcode) {
      const paramsA: Record<string, string | undefined> = {
        street: streetParam,
        city: city,
        state: state,
        postalcode: postalcode,
        country: 'Brasil'
      };
      const resA = await nominatimStructuredSearch(paramsA);
      if (resA) return resA;
    }

    // tentativa B: menos campos (sem postalcode)
    if (streetParam || city || state) {
      const paramsB: Record<string, string | undefined> = {
        street: streetParam,
        city: city,
        state: state,
        country: 'Brasil'
      };
      const resB = await nominatimStructuredSearch(paramsB);
      if (resB) return resB;
    }

    // tentativa C: apenas cep + número (alguns bairros/ceps são bem definidos)
    if (postalcode) {
      const free = structured.houseNumber ? `${postalcode}, ${structured.houseNumber}, Brasil` : `${postalcode}, Brasil`;
      const resC = await nominatimFreeText(free);
      if (resC) return resC;
    }

    // tentativa D: fallback para free-text combinando campos
    const freeParts = [
      streetParam,
      neighborhood,
      city && state ? `${city}, ${state}` : city || state,
      postalcode ? postalcode : undefined,
      'Brasil'
    ].filter(Boolean).join(', ');
    if (freeParts) {
      const resD = await nominatimFreeText(freeParts);
      if (resD) return resD;
    }

    throw new GeocodingError('Não foi possível encontrar coordenadas para o endereço (estruturado).');
  });
}

export async function geocodeAddressWithFallbacks(address: AddressInput): Promise<GeocodingResult> {
  return geocodeAddress(address);
}

export async function geocodeString(addressString: string): Promise<GeocodingResult> {
  return geocodeAddress(addressString);
}

export async function geocodeStructured(structuredAddress: StructuredAddress): Promise<GeocodingResult> {
  return geocodeAddress(structuredAddress);
}

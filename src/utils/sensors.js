export const demoAddresses = [
  "Rua das Acácias, 120 · Belo Horizonte",
  "Praça Sete, 99 · Belo Horizonte",
  "Rua Flor de Lis, 45 · Nova Lima",
  "Av. do Contorno, 3050 · Belo Horizonte"
];

export const defaultSnapshot = {
  bpm: 76,
  spo2: 97,
  temp: 25.4,
  accel: 1.02,
  fallEvent: false,
  timestamp: new Date(Date.now() - 120000),
  address: demoAddresses[0]
};

export const historySeed = [
  {
    timestamp: new Date(Date.now() - 15 * 60000),
    batimentos: 78,
    spo2: 97,
    temperaturaAmbiente: 25.2,
    quedaDetectada: false
  },
  {
    timestamp: new Date(Date.now() - 45 * 60000),
    batimentos: 81,
    spo2: 96,
    temperaturaAmbiente: 25.8,
    quedaDetectada: false
  },
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    batimentos: 75,
    spo2: 98,
    temperaturaAmbiente: 24.9,
    quedaDetectada: false
  }
];

export const normalizePayload = (payload = {}) => {
  const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();
  return {
    bpm: Number(payload.batimentos ?? payload.heartRate ?? payload.bpm ?? payload.hr),
    spo2: Number(payload.spo2 ?? payload.oxigenio ?? payload.saturacao ?? payload.spo2Percent ?? payload.oximeter),
    temp: Number(payload.temperaturaAmbiente ?? payload.temperatura ?? payload.temperatureAmbient ?? payload.temp),
    accel: Number(payload.aceleracao ?? payload.acceleration ?? payload.accel),
    fallEvent: Boolean(payload.quedaDetectada ?? payload.queda ?? payload.fallDetected ?? payload.fallEvent),
    address: payload.endereco ?? payload.address ?? payload.gps?.endereco ?? payload.locationLabel ?? null,
    lat: Number(payload.latitude ?? payload.gps?.lat),
    lng: Number(payload.longitude ?? payload.gps?.lng),
    timestamp,
    raw: payload
  };
};

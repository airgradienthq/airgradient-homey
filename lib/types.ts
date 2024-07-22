export interface AirQualityDataType {
  serialno: string;
  wifi: number;
  pm01: number;
  pm02: number;
  pm10: number;
  pm02Compensated: number;
  rco2: number;
  pm003Count: number;
  atmp: number;
  atmpCompensated: number;
  rhum: number;
  rhumCompensated: number;
  tvocIndex: number;
  tvocRaw: number;
  noxIndex: number;
  noxRaw: number;
  boot: number;
  bootCount: number;
  ledMode: string;
  firmware: string;
  model: string;

  isOpenAirOutdoor(): boolean;
  isONEIndoor(): boolean;
  isDIY(): boolean;
  getModelName(): string;
}

export class AirQualityData implements AirQualityDataType {
  serialno: string;
  wifi: number;
  pm01: number;
  pm02: number;
  pm10: number;
  pm02Compensated: number;
  rco2: number;
  pm003Count: number;
  atmp: number;
  atmpCompensated: number;
  rhum: number;
  rhumCompensated: number;
  tvocIndex: number;
  tvocRaw: number;
  noxIndex: number;
  noxRaw: number;
  boot: number;
  bootCount: number;
  ledMode: string;
  firmware: string;
  model: string;

  constructor(data: Partial<AirQualityDataType>) {
    this.serialno = data.serialno || '';
    this.wifi = data.wifi || 0;
    this.pm01 = data.pm01 || 0;
    this.pm02 = data.pm02 || 0;
    this.pm10 = data.pm10 || 0;
    this.pm02Compensated = data.pm02Compensated || 0;
    this.rco2 = data.rco2 || 0;
    this.pm003Count = data.pm003Count || 0;
    this.atmp = data.atmp || 0;
    this.atmpCompensated = data.atmpCompensated || 0;
    this.rhum = data.rhum || 0;
    this.rhumCompensated = data.rhumCompensated || 0;
    this.tvocIndex = data.tvocIndex || 0;
    this.tvocRaw = data.tvocRaw || 0;
    this.noxIndex = data.noxIndex || 0;
    this.noxRaw = data.noxRaw || 0;
    this.boot = data.boot || 0;
    this.bootCount = data.bootCount || 0;
    this.ledMode = data.ledMode || '';
    this.firmware = data.firmware || '';
    this.model = data.model || '';
  }

  isOpenAirOutdoor(): boolean {
    return this.model.startsWith('O-1PST');
  }

  isONEIndoor(): boolean {
    return this.model.startsWith('I-9PSL');
  }

  isDIY(): boolean {
    return this.model.includes('DIY');
  }

  getModelName(): string {
    if (this.isOpenAirOutdoor()) return 'AirGradient Open Air';
    if (this.isONEIndoor()) return 'AirGradient ONE';
    if (this.isDIY()) return 'AirGradient DIY';
    return 'unknown';
  }
}

export interface Configuration {
  country: string;
  model?: string;  // Optional as it is only available in GET
  pmStandard: 'ugm3' | 'us-aqi';
  ledBarMode: 'co2' | 'pm' | 'off';
  displayBrightness: number;
  ledBarBrightness: number;
  abcDays: number;
  mqttBrokerUrl: string;
  temperatureUnit: 'c' | 'C' | 'f' | 'F';
  configurationControl: 'both' | 'local' | 'cloud';
  postDataToAirGradient: boolean;
  co2CalibrationRequested: boolean;
  ledBarTestRequested: boolean;
  noxLearningOffset: number;
  tvocLearningOffset: number;
  offlineMode: boolean;
}

export type LogFunction = (message?: any, ...optionalParams: any[]) => void;
export interface AirQualityDataType {
  status: AirGradientConnectStatus;
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

  isOutdoor(): boolean;
  isIndoor(): boolean;
  getModelName(): string;
}


export enum AirGradientConnectStatus {
  SUCCESS,
  FAILED_UKNOWN,
  UNREACHABLE
}


export class AirQualityData implements AirQualityDataType {
  status: AirGradientConnectStatus;
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
    this.status = data.status || AirGradientConnectStatus.FAILED_UKNOWN;
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

  isOutdoor(): boolean {
    return this.model.startsWith('O-');
  }

  isIndoor(): boolean {
    return this.model.startsWith('I-');
  }

  getModelName(): string {
    if (this.isOutdoor()) return 'Open Air Outdoor';
    if (this.isIndoor()) return 'ONE Indoor';
    return 'unknown';
  }
}

export interface Configuration {
  status: AirGradientConnectStatus;
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
  noxLearningOffset: number;
  tvocLearningOffset: number;
  offlineMode: boolean;
}

export class DeviceConfig implements Configuration {
  status: AirGradientConnectStatus;
  country: string;
  pmStandard: 'ugm3' | 'us-aqi';
  ledBarMode: 'co2' | 'pm' | 'off';
  abcDays: number;
  tvocLearningOffset: number;
  noxLearningOffset: number;
  mqttBrokerUrl: string;
  temperatureUnit: 'c' | 'C' | 'f' | 'F';
  configurationControl: 'both' | 'local' | 'cloud';
  postDataToAirGradient: boolean;
  ledBarBrightness: number;
  displayBrightness: number;
  offlineMode: boolean;
  model: string;

  constructor(data: Partial<Configuration>) {
    this.status = data.status || AirGradientConnectStatus.FAILED_UKNOWN;
    this.country = data.country || '';
    this.pmStandard = data.pmStandard || 'ugm3';
    this.ledBarMode = data.ledBarMode || 'off';
    this.abcDays = data.abcDays || 0;
    this.tvocLearningOffset = data.tvocLearningOffset || 0;
    this.noxLearningOffset = data.noxLearningOffset || 0;
    this.mqttBrokerUrl = data.mqttBrokerUrl || '';
    this.temperatureUnit = data.temperatureUnit || 'c';
    this.configurationControl = data.configurationControl || 'both';
    this.postDataToAirGradient = data.postDataToAirGradient ?? false;
    this.ledBarBrightness = data.ledBarBrightness || 0;
    this.displayBrightness = data.displayBrightness || 0;
    this.offlineMode = data.offlineMode ?? false;
    this.model = data.model || '';
  }
}

export type LogFunction = (message?: any, ...optionalParams: any[]) => void;
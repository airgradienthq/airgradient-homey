export interface AirQualityData {
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
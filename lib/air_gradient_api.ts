
import axios, { AxiosInstance } from 'axios';
import { AirGradientConnectStatus, AirQualityData, DeviceConfig, LogFunction } from './types';
import { AxiosError } from 'axios';

export default class AirGradient {

    static OK = 'OK';

    log!: LogFunction;
    enableDebug!: boolean;
    ipAddress!: string;


    constructor(ipAddress: string, log = console.log, enableDebug = false) {
        this.ipAddress = ipAddress;
        this.log = log;
        this.enableDebug = enableDebug;
    }

    private async createHttp(ipAddress: string): Promise<AxiosInstance> {
        try {
            return axios.create({
                baseURL: `http://${ipAddress}`,
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Charset': 'utf-8',
                    Accept: 'application/json',
                    'User-Agent': 'AirGradient HomeyApp'
                }
            });
        } catch (error) {
            this.log(JSON.stringify(error));
            throw new Error(`${error}`);
        }
    }

    /**
     * Returns a AirQualityData if the ipaddress provided is a AirGradient device 
     * by requesting the JSON from 'http://{ipaddress}/measures/current' otherwise 'null'
     */
    async getAirQualityData(): Promise<AirQualityData> {
        if (this.enableDebug) this.log(`getAirQualityData: ${this.ipAddress}`);
        try {
            const http = await this.createHttp(this.ipAddress);
            const response = await http.get(`/measures/current`);
            if (response && response.data) {
                const airQualityData: AirQualityData = new AirQualityData(response.data);
                airQualityData.status = AirGradientConnectStatus.SUCCESS;
                if (this.enableDebug) this.log(`AirQualityData: ${JSON.stringify(airQualityData)}`);
                return airQualityData;
            }
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('EHOSTUNREACH')) {
                 return new AirQualityData({status: AirGradientConnectStatus.UNREACHABLE});
            } else {
                // Handle other types of errors
                this.log('Unknown Error:', error);
            }
        }
        return new AirQualityData({});
    }

    /**
     * Returns a DeviceConfig if the ipaddress provided is a AirGradient device 
     * by requesting the JSON from 'http://{ipaddress}/config' otherwise 'null'
     */
    async getDeviceConfig(): Promise<DeviceConfig> {
        if (this.enableDebug) this.log(`getAirQualityData: ${this.ipAddress}`);
        try {
            const http = await this.createHttp(this.ipAddress);
            const response = await http.get(`/config`);
            if (response && response.data) {
                const deviceConfig: DeviceConfig = new DeviceConfig(response.data);
                deviceConfig.status = AirGradientConnectStatus.SUCCESS;
                if (this.enableDebug) this.log(`DeviceConfig: ${JSON.stringify(deviceConfig)}`);
                return deviceConfig;
            }
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('EHOSTUNREACH')) {
                 return new DeviceConfig({status: AirGradientConnectStatus.UNREACHABLE});
            } else {
                // Handle other types of errors
                this.log('Unknown Error:', error);
            }
        }
        return new DeviceConfig({});
    }

    async updateConfig(payload: any) {
        if (this.enableDebug) this.log(`updateConfig: ${this.ipAddress} >> ${JSON.stringify(payload)}`);
        try {
            const http = await this.createHttp(this.ipAddress);
            const response = await http.put(`/config`, payload);
            if (response && this.enableDebug) this.log(`response: ${JSON.stringify(response.status)}`);
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('EHOSTUNREACH')) {
                 return;
            } else {
                // Handle other types of errors
                this.log('Unknown Error:', error);
            }
        }
    }

    // co2CalibrationRequested: boolean;
    // ledBarTestRequested: boolean;
}
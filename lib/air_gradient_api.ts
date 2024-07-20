
import axios, { AxiosInstance } from 'axios';
import { AirQualityData, LogFunction } from './types';

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
    async getAirQualityData(): Promise<AirQualityData | null> {
        if (this.enableDebug) this.log(`getAirQualityData: ${this.ipAddress}`);
        try {
            const http = await this.createHttp(this.ipAddress);
            const response = await http.get(`/measures/current`);
            if (response && response.data) {
                const airQualityData: AirQualityData = new AirQualityData(response.data);
                if (this.enableDebug) this.log(`AirQualityData: ${JSON.stringify(airQualityData)}`);
                return airQualityData;
            }
        } catch (e) {
            this.log(e);
        }
        return null;
    }
}
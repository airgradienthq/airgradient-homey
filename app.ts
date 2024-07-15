'use strict';

import Homey from 'homey';
import axios, { AxiosInstance } from 'axios';
import { AirQualityData } from './types'

export default class AirGradientApp extends Homey.App {


  private async createHttp(address: string): Promise<AxiosInstance> {
    try {
      return axios.create({
        baseURL: address,
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Charset': 'utf-8',
          Accept: 'application/json',
          'User-Agent': 'HomeyApp'
        }
      });
    } catch (error) {
      this.log(JSON.stringify(error));
      throw new Error(`${error}`);
    }
  }

  async onInit() {
    this.log('AirGradientApp has been initialized');
  }

  /**
   * Returns true if the ipaddress provided is AirGradientOne
   * by requesting the JSON from 'http://{ipaddress}/measures/current'
   * and comparing that model === 'I-9PSL'
   */
  async isAirGradientOne(address: string): Promise<boolean> {

    try {
      const http = await this.createHttp(address);
      const response = await http.get(`/measures/current`);
      if (response && response.data) {
        const airQualityData: AirQualityData = response.data;
        return airQualityData.model === 'I-9PSL';
      }
    } catch (e) {
    }
    return false;
  }

}

module.exports = AirGradientApp;

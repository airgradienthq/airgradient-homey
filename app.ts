'use strict';

import Homey from 'homey';

export default class AirGradientApp extends Homey.App {


  async onInit() {
    this.log('AirGradientApp has been initialized');
  }
}

module.exports = AirGradientApp;

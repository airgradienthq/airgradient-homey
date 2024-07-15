import Homey from 'homey';

class OutdoorDriver extends Homey.Driver {

  async onInit() {
    this.log('OutdoorDriver has been initialized');
  }

  async onPairListDevices() {
    return [
    ];
  }

}

module.exports = OutdoorDriver;

import Homey from 'homey';

class IndoorDriver extends Homey.Driver {

  async onInit() {
    this.log('IndoorDriver has been initialized');
  }

  async onPairListDevices() {
    return [
    ];
  }

}

module.exports = IndoorDriver;

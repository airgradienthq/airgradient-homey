import Homey from 'homey';
import SharedDevice from '../../lib/shared_device'

class IndoorDevice extends SharedDevice {

  async onInit() {
    super.onInit();
    this.log('IndoorDevice has been initialized');
  }

}

module.exports = IndoorDevice;

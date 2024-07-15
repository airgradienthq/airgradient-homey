import Homey from 'homey';

class IndoorDevice extends Homey.Device {

  async onInit() {
    this.log('IndoorDevice has been initialized');
  }

  async onSettings({oldSettings,newSettings,changedKeys,}: {
    oldSettings: { [key: string]: boolean | string | number | undefined | null };
    newSettings: { [key: string]: boolean | string | number | undefined | null };
    changedKeys: string[];
  }): Promise<string | void> {
    this.log("IndoorDevice settings where changed");
  }

}

module.exports = IndoorDevice;

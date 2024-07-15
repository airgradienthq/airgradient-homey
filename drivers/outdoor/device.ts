import Homey from 'homey';

class OutdoorDevice extends Homey.Device {

  async onInit() {
    this.log('OutdoorDevice has been initialized');
  }

  async onSettings({oldSettings,newSettings,changedKeys,}: {
    oldSettings: { [key: string]: boolean | string | number | undefined | null };
    newSettings: { [key: string]: boolean | string | number | undefined | null };
    changedKeys: string[];
  }): Promise<string | void> {
    this.log("OutdoorDevice settings where changed");
  }

}

module.exports = OutdoorDevice;

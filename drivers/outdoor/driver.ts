import Homey from 'homey';
import AirGradientApp from '../../app'

class OutdoorDriver extends Homey.Driver {
  app!: AirGradientApp

  async onInit() {
    this.log('OutdoorDriver has been initialized');
    this.app = this.homey.app as AirGradientApp;
  }

  async onPairListDevices() {
    const discoveryStrategy = this.homey.discovery.getStrategy("airgradient");
    const discoveryResults = discoveryStrategy.getDiscoveryResults();
    const devices = await Promise.all(
      Object.values(discoveryResults).map(async (result) => {
        const mdnsResult = result as Homey.DiscoveryResultMDNSSD;
        const isAirGradientOne = await this.app.isAirGradientOne(mdnsResult.address);
        if (!isAirGradientOne) {
          return {
            name: mdnsResult.name,
            data: {
              id: mdnsResult.id,
            },
            settings: {
              ipaddress: mdnsResult.address,
            },
          };
        }
        return null;
      })
    );

    const filteredDevices = devices.filter(device => device !== null);
    return filteredDevices;
  }
}

module.exports = OutdoorDriver;

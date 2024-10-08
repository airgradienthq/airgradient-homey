import Homey from 'homey';
import PairSession from 'homey/lib/PairSession';
import AirGradient from './air_gradient_api';
import { AirGradientConnectStatus } from './types';
import AirGradientApp from '../app'

export default class SharedDriver extends Homey.Driver {
    app!: AirGradientApp

    async onInit() {
        this.app = this.homey.app as AirGradientApp;
    }

    async onPairListDevices(): Promise<any[]> {
        return [];
    }

    async createOnlyValidAirGradientDevice(ipAddress: string, outdoorOnly: boolean): Promise<any | null> {
        const air = new AirGradient(ipAddress, this.log, true);
        const response = await air.getAirQualityData();
        if (response !== null && response.isOutdoor() === outdoorOnly && response.status === AirGradientConnectStatus.SUCCESS) {
            return {
                name: response.getModelName(),
                data: {
                    id: response.serialno
                },
                settings: {
                    ipAddress: ipAddress,
                    serialno: response.serialno,
                    firmware: response.firmware,
                    model: response.model
                }
            };
        }
        return null;
    }

    async onSharedPair(session: PairSession, outdoorOnly: boolean) {

        session.setHandler('list_devices', async (data) => {
            const discoveryStrategy = this.homey.discovery.getStrategy("airgradient");
            const discoveryResults = discoveryStrategy.getDiscoveryResults();
            try {
                // get already paired devices and remove them from discoveryResults 
                const drivers: { [x: string]: Homey.Driver; } = this.homey.drivers.getDrivers();
                for (const driver in drivers) {
                    const exsitingDevices: Homey.Device[] = drivers[driver].getDevices();
                    for (const exsitingDevice of exsitingDevices) {                    
                        delete discoveryResults[`airgradient_${exsitingDevice.getData().id}`];
                    }
                }

                // filter devices object with discovered devices 
                const devices = await Promise.all(
                    Object.values(discoveryResults).map(async (result) => {
                        const mdnsResult = result as Homey.DiscoveryResultMDNSSD;
                        this.log(`mdnsResult: ${JSON.stringify(mdnsResult)}`);
                        const device = await this.createOnlyValidAirGradientDevice(mdnsResult.address, outdoorOnly);
                        return device;
                    })
                );
                this.log(`devices: ${JSON.stringify(devices)}`);
                const filteredDevices = devices.filter(device => device !== null);

                // return the devices if there are unpaired devices or else show the manual device_ip view  
                if (filteredDevices.length > 0) {
                    return filteredDevices;
                } else {
                    session.showView('device_ip');
                }
            } catch (error) {
                this.error(error);
            }
        });

        session.setHandler("check_details", async (data) => {
            this.log('check_details data=', data);
            return await this.createOnlyValidAirGradientDevice(data.ipAddress, outdoorOnly);
        });
    }
}

module.exports = SharedDriver;

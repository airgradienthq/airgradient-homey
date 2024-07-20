import Homey from 'homey';
import AirGradient from './air_gradient_api';
import { AirQualityData } from './types';

export default class SharedDevice extends Homey.Device {
    private refreshInterval: NodeJS.Timeout | null = null;

    async onInit() {
        this.log("Device Init: " + this.getName() + " with pollingInterval: " + this.getSetting('pollingInterval') + " and ipAddress " + this.getSetting('ipAddress'));

        this.homey.setTimeout(() => {
            this.startPolling();
        },1000);
    }

    async onSettings({ oldSettings, newSettings, changedKeys, }: {
        oldSettings: { [key: string]: boolean | string | number | undefined | null };
        newSettings: { [key: string]: boolean | string | number | undefined | null };
        changedKeys: string[];
    }): Promise<string | void> {
        if (changedKeys.includes("ipAddress") || changedKeys.includes("pollingInterval")) {
            this.startPolling();
        }
        this.updateCapabilities();
    }

    /* start polling on interval */
    async startPolling() {
        const pollingInterval = this.getSetting('pollingInterval') || 60000;
        this.updateCapabilities();
        try {
            this.homey.clearInterval(this.refreshInterval);
            this.refreshInterval = this.homey.setInterval(async () => {
                this.updateCapabilities();
            }, pollingInterval);
        } catch (error) {

        }
    }

    async updateCapabilities() {
        const air = new AirGradient(this.getSetting('ipAddress'), this.log, true);
        const aqd = await air.getAirQualityData();
        if (aqd == null) return;

        this.setSettings({'firmware':aqd.firmware});

        this.setCapabilityValue('measure_pm1', aqd.pm01);
        this.setCapabilityValue('measure_pm10', aqd.pm10);
        this.setCapabilityValue('measure_pm25', aqd.pm02);
        this.setCapabilityValue('measure_co2', aqd.rco2);
        this.setCapabilityValue('measure_pm03_cnt', aqd.pm003Count);
        let temp = aqd.atmp;
        let humid = aqd.rhum;
        if (aqd.isOpenAirOutdoor()) {
            if (this.getSetting('temperature_uses_corrected')) temp = aqd.atmpCompensated;
            if (this.getSetting('humidity_uses_corrected')) humid = aqd.rhumCompensated;
        }
        this.setCapabilityValue('measure_temperature', temp);
        this.setCapabilityValue('measure_humidity', humid);
        this.setCapabilityValue('measure_voc', aqd.tvocRaw);
        this.setCapabilityValue('measure_voc_idx', aqd.tvocIndex);
        this.setCapabilityValue('measure_nox', aqd.noxRaw);
        this.setCapabilityValue('measure_nox_idx', aqd.noxIndex);
    }

    onDeleted(): void {
        this.log("Device " + this.getName() + " deleted!");
        try {
            this.homey.clearInterval(this.refreshInterval);
        } catch (error) {

        }
    }
}

module.exports = SharedDevice;

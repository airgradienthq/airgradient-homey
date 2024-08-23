import Homey from 'homey';
import AirGradient from './air_gradient_api';
import { AirQualityData, AirGradientConnectStatus } from './types';

export default class SharedDevice extends Homey.Device {
    static enableDebug = true;
    private refreshInterval: NodeJS.Timeout | null = null;

    async onInit() {
        this.log("Device Init: " + this.getName() + " with pollingInterval: " + this.getSetting('pollingInterval') + " and ipAddress " + this.getSetting('ipAddress'));

        this.setSettings({ co2CalibrationRequested: false });
        
    }
    
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    onDiscoveryResult(discoveryResult: any) {
        return discoveryResult?.txt?.serialno === this.getData().id;
    }

    async onDiscoveryAvailable(discoveryResult: any) {
        this.setSettings({'ipAddress':discoveryResult?.address});
        this.setAvailable();
        this.homey.clearInterval(this.refreshInterval);
        this.homey.setTimeout(() => {
            this.startPolling();
        }, this.getRandomNumber(750,1750));
    }

    onDiscoveryAddressChanged(discoveryResult: any) {
        this.log(`onDiscoveryAddressChanged(discoveryResult:${JSON.stringify(discoveryResult)}`);
    }

    onDiscoveryLastSeenChanged(discoveryResult: any) {
        this.log(`onDiscoveryLastSeenChanged(discoveryResult:${JSON.stringify(discoveryResult)}`);
    }

    async onSettings({ oldSettings, newSettings, changedKeys, }: {
        oldSettings: { [key: string]: boolean | string | number | undefined | null };
        newSettings: { [key: string]: boolean | string | number | undefined | null };
        changedKeys: string[];
    }): Promise<string | void> {

        if (changedKeys.includes("postDataToAirGradient")) {
            const air = new AirGradient(this.getSetting('ipAddress'), this.log, SharedDevice.enableDebug);
            air.updateConfig({ postDataToAirGradient: newSettings['postDataToAirGradient'] });
            return;
        }

        if (changedKeys.includes("co2CalibrationRequested")) {
            if (!oldSettings['co2CalibrationRequested'] && newSettings['co2CalibrationRequested']) {
                const air = new AirGradient(this.getSetting('ipAddress'), this.log, SharedDevice.enableDebug);
                air.updateConfig({ co2CalibrationRequested: true });
                this.homey.setTimeout(() => {
                    this.setSettings({ co2CalibrationRequested: false });
                }, 1000);
                return;
            }
        }

        this.setAvailable();
        this.homey.clearInterval(this.refreshInterval);
        this.homey.setTimeout(() => {
            this.startPolling();
        }, 1000);
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


    async safeUpdateCapabilityValue(key: string, value: any) {
        if (this.hasCapability(key)) {
            if (typeof value !== 'undefined' && value !== null) {
                await this.setCapabilityValue(key, value);
            } else {
                this.log(`value for capability '${key}' is undefined or null`);
            }
        } else {
            this.log(`missing capability: '${key}'`);
        }
    }

    async updateCapabilities() {
        const air = new AirGradient(this.getSetting('ipAddress'), this.log, SharedDevice.enableDebug);
        const aqd = await air.getAirQualityData();
        if (aqd.status == AirGradientConnectStatus.FAILED_UKNOWN) return;


        if (aqd.status == AirGradientConnectStatus.UNREACHABLE) {
            this.setUnavailable(`Device is not reachable at ${this.getSetting('ipAddress')}`);
            return;            
        }

        this.setAvailable();
        const config = await air.getDeviceConfig();

        await this.setSettings({ 'firmware': aqd.firmware });
        await this.setSettings({ 'postDataToAirGradient': config?.postDataToAirGradient });

        await this.safeUpdateCapabilityValue('measure_pm1', aqd.pm01);
        await this.safeUpdateCapabilityValue('measure_pm10', aqd.pm10);
        await this.safeUpdateCapabilityValue('measure_co2', aqd.rco2);
        await this.safeUpdateCapabilityValue('measure_pm03_cnt', aqd.pm003Count);
        let pm02 = aqd.pm02;
        if (aqd.isIndoor() && this.getSetting('pm02_uses_corrected')) {
            pm02 = this.calculatePM25(aqd.pm02, aqd.rhum);
        }
        await this.safeUpdateCapabilityValue('measure_pm25', pm02);
        await this.safeUpdateCapabilityValue('measure_temperature', aqd.atmp);
        await this.safeUpdateCapabilityValue('measure_humidity', aqd.rhum);
        await this.safeUpdateCapabilityValue('measure_voc', aqd.tvocRaw);
        await this.safeUpdateCapabilityValue('measure_voc_idx', aqd.tvocIndex);
        await this.safeUpdateCapabilityValue('measure_nox', aqd.noxRaw);
        await this.safeUpdateCapabilityValue('measure_nox_idx', aqd.noxIndex);
    }

    onDeleted(): void {
        this.log("Device " + this.getName() + " deleted!");
        try {
            this.homey.clearInterval(this.refreshInterval);
        } catch (error) {

        }
    }

    calculatePM25(raw: number, rhum: number) {
        let result = 0;

        if ((raw || raw === 0) && (rhum === undefined || rhum === null)) {
            return raw;
        }
        if (raw < 30) {
            // AGraw < 30:
            // PM2.5 = [0.524 x AGraw] – [0.0862 x RH] + 5.75
            result = (0.524 * raw) - (0.0862 * rhum) + 5.75;
        } else if (raw < 50) {
            // 30 ≤ AGraw < 50:
            // PM2.5 = [0.786 x (AGraw/20 - 3/2) + 0.524 x (1 - (AGraw/20 - 3/2))] x AGraw – [0.0862 x RH] + 5.75
            result = (0.786 * (raw / 20 - 3 / 2) + 0.524 * (1 - (raw / 20 - 3 / 2))) * raw - (0.0862 * rhum) + 5.75;
        } else if (raw < 210) {
            // 50 ≤ AGraw < 210:
            // PM2.5 = [0.786 x AGraw] – [0.0862 x RH] + 5.75
            result = (0.786 * raw) - (0.0862 * rhum) + 5.75;
        } else if (raw < 260) {
            // 210 ≤ AGraw < 260:
            // PM2.5 = [0.69 x (AGraw/50 – 21/5) + 0.786 x (1 - (AGraw/50 – 21/5))] x AGraw – [0.0862 x RH x (1 - (AGraw/50 – 21/5))] + [2.966 x (AGraw/50 –21/5)] + [5.75 x (1 - (AGraw/50 – 21/5))] + [8.84 x (10-4) x AGraw^2 x (AGraw/50 – 21/5)]
            result = (0.69 * (raw / 50 - 21 / 5) + 0.786 * (1 - (raw / 50 - 21 / 5))) * raw
                - (0.0862 * rhum * (1 - (raw / 50 - 21 / 5)))
                + (2.966 * (raw / 50 - 21 / 5))
                + (5.75 * (1 - (raw / 50 - 21 / 5)))
                + (8.84 * 0.0001 * Math.pow(raw, 2) * (raw / 50 - 21 / 5));
        } else {
            // 260 ≤ AGraw:
            // PM2.5 = 2.966 + [0.69 x AGraw] + [8.84 x 10^-4 x AGraw^2]
            result = 2.966 + (0.69 * raw) + (8.84 * 0.0001 * Math.pow(raw, 2));
        }

        return Number(result.toFixed(1));
    }
}

module.exports = SharedDevice;

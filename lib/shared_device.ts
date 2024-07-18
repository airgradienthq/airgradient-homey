import Homey from 'homey';

export default class SharedDevice extends Homey.Device {
    refreshInterval!: NodeJS.Timeout;

    async onInit() {
        this.log("Device Init: " + this.getName() + " with capabilities: " + this.getCapabilities().toString() + " and model " + this.getSetting('model'));
    }

    async onSettings({ oldSettings, newSettings, changedKeys, }: {
        oldSettings: { [key: string]: boolean | string | number | undefined | null };
        newSettings: { [key: string]: boolean | string | number | undefined | null };
        changedKeys: string[];
    }): Promise<string | void> {
        if (changedKeys.includes("ipaddress") || changedKeys.includes("polling_interval")) {
            this.refreshDevice();
        }
    }

    /* refresh device values on polling interval */
    async refreshDevice() {
        try {
            this.homey.clearInterval(this.refreshInterval);
            this.refreshInterval = this.homey.setInterval(() => {
                // todo poll for values
            }, this.homey.settings.get("polling_interval"));
        } catch (error) {

        }
    }
}

module.exports = SharedDevice;

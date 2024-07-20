
import PairSession from 'homey/lib/PairSession';
import SharedDriver from '../../lib/shared_driver'

class OutdoorDriver extends SharedDriver {

  async onInit() {
    super.onInit();
    this.log('OutdoorDriver has been initialized');
  }

  async onPair(session: PairSession) {
    return super.onSharedPair(session,true);
  }
}

module.exports = OutdoorDriver;

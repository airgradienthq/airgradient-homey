import PairSession from 'homey/lib/PairSession';
import SharedDriver from '../../lib/shared_driver'

class IndoorDriver extends SharedDriver {

  async onInit() {
    super.onInit();
    this.log('IndoorDriver has been initialized');
  }

  async onPair(session: PairSession) {
    return super.onSharedPair(session,false);
  }
}

module.exports = IndoorDriver;

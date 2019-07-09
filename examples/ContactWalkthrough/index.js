const { Wallet, EVENTS } = require('@dashevo/wallet-lib');
const DAPIClient = require('@dashevo/dapi-client');
const DashpayDpa = require('../../index.js');
const onAccountReady = require('./onAccountReady');

const seeds = [
  '18.237.69.61',
  '18.236.234.255',
].map(ip => ({ service: `${ip}:3000` }));
const transport = new DAPIClient({
  seeds,
  timeout: 30000,
  retries: 15,
});

const dashpayDpa = new DashpayDpa();

const startWallet = async () => {
  const wallet = new Wallet({
    mnemonic: 'consider timber segment strategy never clay more lock civil artefact bar nuclear',
    transport,
    // offlineMode: true,
    allowSensitiveOperations: true,
    plugins: [dashpayDpa],
  });

  const account = wallet.getAccount({ index: 0 });
  account.events.on(EVENTS.GENERATED_ADDRESS, () => { console.log('GENERATED_ADDRESS'); });
  account.events.on(EVENTS.BALANCE_CHANGED, (info) => { console.log('Balance Changed', info, info.delta); });
  account.events.on(EVENTS.UNCONFIRMED_BALANCE_CHANGED, (info) => { console.log('UNCONFIRMED_BALANCE_CHANGED', info); });
  account.events.on(EVENTS.READY, onAccountReady.bind(null, account));
  account.events.on(EVENTS.BLOCKHEIGHT_CHANGED, info => console.log('BLOCKHEIGHT_CHANGED:', info));
  account.events.on(EVENTS.BLOCK, info => console.log('BLOCK:', info));
  account.events.on(EVENTS.PREFETCHED, () => { console.log(EVENTS.PREFETCHED); });
  account.events.on(EVENTS.DISCOVERY_STARTED, () => console.log(EVENTS.PREFETCHED));
};
startWallet();

const { Wallet, EVENTS } = require('../../../dash-wallet-lib');
const DAPIClient = require('@dashevo/dapi-client');
const DashpayDap = require('../../index.js');
const onAccountReady = require('./onAccountReady');

const seeds = [
  // '18.237.69.61',
  // '18.236.234.255',
  // '34.222.93.218',
  '18.237.69.61'
].map(ip => ({ service: `${ip}:3000` }));
const transport = new DAPIClient({
  seeds,
  timeout: 20000,
  retries: 15,
});

const dashpayDap = new DashpayDap();

const startWallet = async () => {
  const wallet = new Wallet({
    mnemonic: 'enter immune soap path ship access album exist surface surround erase digital',
    // mnemonic: 'pistol drama blue timber now reunion carry hand august explain father west',
    transport,
    // offlineMode: true,
    allowSensitiveOperations: true,
    plugins: [dashpayDap],
  });
  const account = wallet.getAccount({ index: 0 });
  console.log(account.getUnusedAddress());
  console.log(wallet.exportWallet());
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

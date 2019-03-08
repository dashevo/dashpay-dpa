// const { Wallet, EVENTS } = require('@dashevo/wallet-lib');
const { Wallet, EVENTS } = require('../../../dash-wallet-lib');
const DAPIClient = require('@dashevo/dapi-client');
const DashpayDap = require('../../index.js');
const onAccountReady = require('./onAccountReady');

const transport = new DAPIClient({
  seeds: [{ ip: '54.187.113.35', port: 3000 }],
  timeout: 20000,
  retries: 5,
});

const startWallet = async () => {
  const wallet = new Wallet({
    // mnemonic: 'box machine exotic aerobic empty delay cruise salute stand slam truth airport',
    mnemonic: 'seat indoor shoe senior funny eye million trap mention van slab few',
    transport,
    // offlineMode: true,
    allowSensitiveOperations: true,
    plugins: [DashpayDap],
  });

  // console.log(account.getUnusedAddress())
  // console.log(new Wallet({}))
  const account = wallet.getAccount();
  // wallet.
  // console.log(account.getUnusedAddress());

  // console.log(wallet.)
  account.events.on(EVENTS.GENERATED_ADDRESS, (info) => { console.log('GENERATED_ADDRESS'); });
  account.events.on(EVENTS.BALANCE_CHANGED, (info) => { console.log('Balance Changed', info, info.delta); });
  account.events.on(EVENTS.UNCONFIRMED_BALANCE_CHANGED, (info) => { console.log('UNCONFIRMED_BALANCE_CHANGED', info); });
  account.events.on(EVENTS.READY, onAccountReady.bind(null, account));
  account.events.on(EVENTS.BLOCKHEIGHT_CHANGED, info => console.log('BLOCKHEIGHT_CHANGED:', info));
  account.events.on(EVENTS.PREFETCHED, () => { console.log(EVENTS.PREFETCHED); });
  account.events.on(EVENTS.DISCOVERY_STARTED, () => console.log(EVENTS.PREFETCHED));
};
startWallet();

const { Wallet, EVENTS } = require('@dashevo/wallet-lib');
const DAPIClient = require('@dashevo/dapi-client');
const DashpayDap = require('../../index.js');
const onAccountReady = require('./onAccountReady');

const transport = new DAPIClient({
  seeds: [{ ip: '54.187.113.35', port: 3000 }],
});

const startWallet = async () => {
  const wallet = new Wallet({
    mnemonic: 'box machine exotic aerobic empty delay cruise salute stand slam truth airport',
    transport,
    // offlineMode: true,
    allowSensitiveOperations: true,
    plugins: [DashpayDap],
  });
  const account = wallet.getAccount();

  account.events.on(EVENTS.GENERATED_ADDRESS, (info) => { console.log('GENERATED_ADDRESS'); });
  account.events.on(EVENTS.BALANCE_CHANGED, (info) => { console.log('Balance Changed', info, info.delta); });
  account.events.on(EVENTS.UNCONFIRMED_BALANCE_CHANGED, (info) => { console.log('UNCONFIRMED_BALANCE_CHANGED', info); });
  account.events.on(EVENTS.READY, onAccountReady.bind(null, account));
  account.events.on(EVENTS.BLOCKHEIGHT_CHANGED, info => console.log('BLOCKHEIGHT_CHANGED:', info));
  account.events.on(EVENTS.PREFETCHED, () => { console.log(EVENTS.PREFETCHED); });
  account.events.on(EVENTS.DISCOVERY_STARTED, () => console.log(EVENTS.PREFETCHED));
};
startWallet();

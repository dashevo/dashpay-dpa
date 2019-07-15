## DashPay DPA interface

## Get DashpayDPA instance

`const dpd = account.getDPA('dashpaydpa');`

## Get your BUser signing key

`dpd.getBUserSigningPrivateKey()`

## Prepare a state transition 

`prepareStateTransition(object, buser, privKey)`

## Broadcast a transition

`dpd.broadcastTransition(rawTransaction, rawTransactionPacket)`


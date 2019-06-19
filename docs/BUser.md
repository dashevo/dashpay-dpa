## BUser

### Create an BUser instance
```
    const buser = dpd.buser.create('myavailableusername');
```

### Get a BUser from network

Identifier can either be a username or a regTxId.
```
    const dashPayTeamBUser = dpd.buser.get('dashpayteam');
```

### Register a BUser

```
   dashPayTeamBUser.own(dpd.getBUserSigningPrivateKey());
   await dashPayTeamBUser.synchronize();
   await dashPayTeamBUser.register()
```

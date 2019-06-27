## Profile

#### Register a Profile

```
   const profileOpts = {
     avatar: 'https://api.adorable.io/avatars/285/dashpayteam@adorable.png',
     about: 'Here is a good place to put some stuff about yourself',
   }
   const profile = dpd.profile.create(profileOpts)
   profile.setOwner(dashPayTeamBUser);
   await profile.register();
```

#### Get a Profile

```
const profile = dpd.profile.get(identifier);
```

#### Get all Profile

```
const profile = dpd.profile.getAll();
```

#### Get all profile of a BUser

```
const blockchainUsername = 'dashpaydap_example_profile_walkthrough'
const profiles = dpp.profile.getByBUsername(blockchainUsername);
```

#### Get all profile of a BUserID

```
const userId = '...'
const profiles = dpp.profile.getByUserId(userId);
```



#### Get all profile of a DisplayName
TODO

```
const userId = 'example'
const profiles = dpp.profile.getByDisplayName();
```

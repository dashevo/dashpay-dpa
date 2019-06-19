## Profile

#### Register a Profile

```
   const profileOpts = {
     avatar: 'https://api.adorable.io/avatars/285/dashpayteam@adorable.png',
     bio: 'Here is a good place to put some stuff about yourself',
   }
   const profile = dpd.profile.create(profileOpts)
   profile.setOwner(dashPayTeamBUser);
   await profile.register();
```

#### Get a Profile

```
const profile = dpd.profile.get(identifier);
```

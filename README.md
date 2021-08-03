# Index Bot 5
Based on [Index Bot 4](https://github.com/KaceCottam/IndexBot4), but now uses threads and javascript!

## Usage Information
```console
# get correct npm packages
$ npm install --production

# start the bot (no autorestart after crash)
$ npm start

# start the bot (with autorestart after crash)
$ ./runForever.sh

# migrate from indexbot4 roles.db to indexbot5 roles.db
$ ./migrate.sh <oldroles.db> <guildid you want to migrate>
```

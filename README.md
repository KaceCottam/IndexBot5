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

## Migrating from Indexbot4
You will need `npm` and `sqlite3` to run the [following script](./migrate_from_curl.sh).

```console
# from inside your indexbot4 directory, this creates an indexbot5 directory and populates it automatically.
$ curl https://raw.githubusercontent.com/KaceCottam/IndexBot5/master/migrate_from_curl.sh | bash
```

#!/usr/bin/bash
[ ! -f ./roles.db ] && echo "This is not an indexbot4 directory!" && exit 1
git clone https://github.com/KaceCottam/IndexBot5 -o IndexBot5
cp ./roles.db IndexBot5/old_roles.db -v
source ./.env
cd IndexBot5
npm install --production
cp ./default_config.json ./config.json
node -e "var a=require('./config.json');a.TOKEN='$BOT_TOKEN';require('fs').writeFileSync('./config.json',JSON.stringify(a,null,4))"
for gid in $(sqlite3 old_roles.db .tables | sed -e 's/guild_//g'); do
    ./migrate.sh old_roles.db $gid
done

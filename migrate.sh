#!/usr/bin/bash
test -f config.json || exec ./.run.sh
fromDB=$1
guildid=$2
if [[ -z "$fromDB" ]]; then echo "Input the path of your indexbot4 database file!"; exit 1; fi
if [[ -z "$guildid" ]]; then echo "Input the guild id you want to migrate! (You can run 'sqlite3 $fromDB .tables' to see guild ids easily!)"; exit 1; fi
if [[ ! -f $fromDB ]]; then echo "$fromDB doesn't exist!"; exit 1; fi
toDB=$(node -e 'console.log(require("./config.json").ROLES_DB)')
node -e "require('./api').migrateGuild('$fromDB', '$toDB', '$guildid').then(() => console.log('Done!')).catch(err => console.error('error! ', err));"
tmp=$(mktemp)
node -e "var a=require('./config.json');a.GUILD_IDS.push($guildid);require('fs').writeFileSync('$tmp', JSON.stringify(a, null, 4), 'utf8', err=>err && console.log(err))"
[[ $! -eq 0 ]] && mv $tmp ./config.json || (rm $tmp; echo "config update failed, do this manually!")

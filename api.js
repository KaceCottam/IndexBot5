const initSqlJs = require('sql.js')
const fs = require('fs')

const migrateGuild = async (fromDBPath, toDBPath, guildid) => {
    const SQL = await initSqlJs()
    const fromDB = new SQL.Database(fromDBPath)
    const toDB = makeApi(toDBPath)
    fromDB.each(`SELECT * FROM guild_${guildid}`, (err, row) => {
        if (err) throw err
        toDB.addRoles(guildid, row.roleid, row.userid)
        console.log(`Migrated GID:${guildid}|RID:${row.roleid}|UID:${row.userid}`)
    })
}

const makeApi = async path => {
    const SQL = await initSqlJs()
    const db = fs.existsSync(path)
        ? new SQL.Database(fs.readFileSync(path))
        : new SQL.Database().run("CREATE TABLE roles (guildid TEXT, roleid TEXT, userid TEXT, UNIQUE(roleid, userid))")
    return {
        commit: path => {
            const data = db.export()
            const buffer = Buffer.from(data)
            fs.writeFileSync(path, buffer)
        },
        addRoles: (guildid, roleid, userid) => db.run("INSERT INTO roles VALUES(?, ?, ?)", [guildid, roleid, userid]),
        listUsers: (guildid, roleid) => {
            try {
                return db.exec("SELECT userid FROM roles WHERE guildid = ? AND roleid = ?", [guildid, roleid])[0].values.flat()
            } catch (err) {
                return []
            }
        },
        removeUserFromRole: (guildid, roleid, userid) => db.run("DELETE FROM roles WHERE guildid = ? AND roleid = ? AND userid = ?", [guildid, roleid, userid]),
        listRoles: (guildid, userid) => {
            try {
                return db.exec("SELECT roleid FROM roles WHERE guildid = ? AND userid = ?", [guildid, userid])[0].values.flat()
            } catch (err) {
                return []
            }
        },
        listAllRoles: guildid => {
            try {
                return db.exec("SELECT roleid FROM roles WHERE guildid = ?", [guildid])[0].values.flat()
            } catch (err) {
                return []
            }
        },
        removeRole: (guildid, roleid) => db.run("DELETE FROM roles WHERE guildid = ? AND roleid = ?", [guildid, roleid]),
        removeGuild: guildid => db.run("DELETE FROM roles WHERE guildid = ?", [guildid])
    }
}

module.exports = {
    makeApi,
    migrateGuild
}

const fs = require('fs');
const { report } = require('process');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository{
    async create(attrs) {
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buffer.toString('hex')}.${salt}`
        };

        records.push(record);
        await this.writeAll(records);

        return record;
    }
    
    async comparePasswords(saved, supplied) {
        // saved -> password from database, supplied -> password from user login
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuff = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuff.toString('hex');
    }
}

module.exports = new UserRepository('users.json');
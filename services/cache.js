const mongoose = require('mongoose');
const util = require('util');
const redis = require('redis');

const exec = mongoose.Query.prototype.exec;
const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

mongoose.Query.prototype.exec = async function () {
    console.log('I am about to run a query');

    console.log(this.getQuery());

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.collation.name
    }));

    const cacheValue = await client.get(key);

    if (cacheValue) {
        return JSON.parse(cacheValue);
    }

    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    return result;
}
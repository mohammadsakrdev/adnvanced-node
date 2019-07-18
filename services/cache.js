const mongoose = require('mongoose');
const util = require('util');
const redis = require('redis');

const exec = mongoose.Query.prototype.exec;
const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || 'default');
    return this;
}

mongoose.Query.prototype.exec = async function () {
    console.log('I am about to run a query');

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    console.log(this.getQuery());

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.collection.name
    }));

    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(d);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}
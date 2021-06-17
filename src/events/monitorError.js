const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'monitorError'
        })
    }

    run(_, monitor, error) {
        this.client.emit('wtf', `[MONITOR] ${monitor.name} | ${error ? error.message : 'Unknown Error'}`);
    }
}
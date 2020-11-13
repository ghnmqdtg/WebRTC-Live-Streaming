const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        // hour: minutes, am or pm
        time: moment().format('h:mm a')
    }
}

// export
module.exports = formatMessage;
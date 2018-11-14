const queryStrings = require('query-string');

const web = require('../../../webClient');

const snoozeSelection = (req, res) => {
    const body = queryStrings.parse(req.body.toString());
    console.log('Received snoozeSelection body', body);
    const payload = JSON.parse(body.payload);

    const {
        actions: [action],
        channel: { id: channel },
        message_ts: ts
    } = payload;

    const { name } = action;

    console.log("​snoozeSelection -> name", name);

    switch(name) {
        case 'snooze_until': {
            const { selected_options: [{ value }] } = action;
            web.chat.update({
                channel,
                ts,
                text: 'Snooze *Notifications* for how long?',
                attachments: [{
                    attachment_type: 'default',
                    callback_id: 'snooze_selection',
                    title: 'Notifications',
                    text : `Muted until: *${value}*`,
                    color: "#3AA3E3",
                    actions: [{
                        name: 'snooze_update',
                        value: 'snooze_update',
                        text: 'Change',
                        type: 'button'
                    }]
                }]
            }).catch(console.error);
            break;
        }
        case 'snooze_update': {
            web.chat.update({
                channel,
                ts,
                attachments: [{
                    text: 'Snooze *Notifications* for how long?',
                    color: '#3AA3E3',
                    attachment_type: 'default',
                    callback_id: 'snooze_selection',
                    actions: [{
                        name: 'snooze_until',
                        text: 'Snooze until...',
                        type: 'select',
                        options: [{
                            text: 'Tomorrow',
                            value: 'Tomorrow'
                        }, {
                            text: 'Next Week',
                            value: 'Next Week'
                        }, {
                            text: 'Next Month',
                            value: 'Next Month'
                        }]
                    }]
                }]
            });
            break;
        }
        default:
    }
}

module.exports = snoozeSelection;
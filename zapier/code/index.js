const authentication = require('./authentication');
const createEventCreate = require('./creates/create_event.js');
const createTaskCreate = require('./creates/create_task.js');
const createNotificationCreate = require('./creates/create_notification.js');
const createContactCreate = require('./creates/create_contact.js');
const createDocumentCreate = require('./creates/create_document.js');
const updateCurrencyRateCreate = require('./creates/update_currency_rate.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  creates: {
    [createEventCreate.key]: createEventCreate,
    [createTaskCreate.key]: createTaskCreate,
    [createNotificationCreate.key]: createNotificationCreate,
    [createContactCreate.key]: createContactCreate,
    [createDocumentCreate.key]: createDocumentCreate,
    [updateCurrencyRateCreate.key]: updateCurrencyRateCreate,
  },
  authentication: authentication,
};

const perform = async (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/index.php/agendaevents`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      DOLAPIKEY: bundle.authData.api_key,
    },
    body: JSON.stringify({
      type_id: '6',
      userownerid: bundle.authData.id,
      label: bundle.inputData.label,
      datep: Date.parse(new Date()) / 1000,
      datef: Date.parse(new Date()) / 1000,
    }),
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    return { id: results };
  });
};

module.exports = {
  operation: {
    inputFields: [
      {
        key: 'label',
        label: 'Notification content',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { id: 44 },
    outputFields: [{ key: 'id', label: 'ID of the event created' }],
    perform: perform,
  },
  key: 'create_notification',
  noun: 'Notification',
  display: {
    label: 'Create a Notification',
    description: 'Add an notification event in the Dolibarr calendar',
    hidden: false,
    important: false,
  },
};

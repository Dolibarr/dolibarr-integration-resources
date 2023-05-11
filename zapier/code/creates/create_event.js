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
      type_id: '50',
      userownerid: bundle.authData.id,
      label: bundle.inputData.label,
      datep: Date.parse(bundle.inputData.datep) / 1000,
      datef: Date.parse(bundle.inputData.datef) / 1000,
      location: bundle.inputData.location,
      note_private: bundle.inputData.note_private,
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
        label: 'Event name',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'datep',
        label: 'Start date',
        type: 'datetime',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'datef',
        label: 'End date',
        type: 'datetime',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'location',
        label: 'Location',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'note_private',
        label: 'Description',
        type: 'text',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { id: 86 },
    outputFields: [{ key: 'id', label: 'ID of the event created' }],
    perform: perform,
  },
  key: 'create_event',
  noun: 'Event',
  display: {
    label: 'Create an Event',
    description: 'Add an event in the Dolibarr calendar',
    hidden: false,
    important: true,
  },
};

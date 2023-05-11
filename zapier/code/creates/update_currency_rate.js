const perform = async (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/index.php/multicurrencies/${bundle.inputData.id}/rates`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      DOLAPIKEY: bundle.authData.api_key,
    },
    body: JSON.stringify({
      rate: bundle.inputData.rate,
    }),
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    return { id: results };
  });
};

module.exports = {
  key: 'update_currency_rate',
  noun: 'Rate',
  display: {
    label: 'Update a Currency Rate',
    description:
      'Updates the rate of a currency in the Dolibarr multicurrency module',
    hidden: false,
    important: false,
  },
  operation: {
    inputFields: [
      {
        key: 'id',
        label: 'Currency Id',
        type: 'integer',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'rate',
        label: 'Rate',
        type: 'number',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: {
      id: {
        id: '2',
        code: 'USD',
        name: 'Dollar Americain',
        rate: { id: 18, rate: '0.86', date_sync: 1683373656 },
      },
    },
    outputFields: [
      { key: 'id__id', label: 'Id of the currency whose rate was updated' },
      { key: 'id__code', label: 'Code of the currency whose rate was updated' },
      { key: 'id__name', label: 'Name of the currency whose rate was updated' },
      { key: 'id__rate__id', label: 'New rate ID', type: 'integer' },
      { key: 'id__rate__rate', label: 'New rate value' },
      {
        key: 'id__rate__date_sync',
        label: 'Rate update timestamp',
        type: 'integer',
      },
    ],
    perform: perform,
  },
};

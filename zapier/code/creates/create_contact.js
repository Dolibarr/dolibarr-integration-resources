const perform = async (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/index.php/contacts`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      DOLAPIKEY: bundle.authData.api_key,
    },
    body: JSON.stringify({
      lastname: bundle.inputData.lastname,
      firstname: bundle.inputData.firstname,
      email: bundle.inputData.email,
      phone: bundle.inputData.phone,
      phone_perso: bundle.inputData.phone_perso,
      phone_mobile: bundle.inputData.phone_mobile,
      fax: bundle.inputData.fax,
      poste: bundle.inputData.poste,
      birthday: bundle.inputData.birthday,
      address: bundle.inputData.address,
      zip: bundle.inputData.zip,
      town: bundle.inputData.town,
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
        key: 'lastname',
        label: 'Lastname',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'firstname',
        label: 'Firstname',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'email',
        label: 'Email',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'phone',
        label: 'Professional phone',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'phone_perso',
        label: 'Personal phone',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'phone_mobile',
        label: 'Mobile phone',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'fax',
        label: 'Fax number',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'poste',
        label: 'Position/function',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'birthday',
        label: 'Birthday',
        type: 'datetime',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'address',
        label: 'Address',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'zip',
        label: 'Zip Code',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'town',
        label: 'Town',
        type: 'string',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    sample: { id: 3 },
    outputFields: [{ key: 'id', label: 'ID of the contact created' }],
    perform: perform,
  },
  key: 'create_contact',
  noun: 'Contact',
  display: {
    label: 'Create a Contact',
    description: 'Add a contact in the third party module of Dolibarr',
    hidden: false,
    important: true,
  },
};

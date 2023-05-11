const testAuth = async (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/index.php/users/info`,
    method: 'GET',
    headers: {
      DOLAPIKEY: bundle.authData.api_key,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    return results;
  });
};

module.exports = {
  type: 'session',
  test: testAuth,
  fields: [
    {
      computed: false,
      key: 'host',
      required: true,
      label: 'Instance URL',
      type: 'string',
      helpText:
        'Specify the base address of the Dolibarr instance, it must not have "/" at the end and must start with https://.\n\nExample: https://dolibarr.my-server.org or https://my-server.org/dolibarr',
    },
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'password',
      helpText:
        'Specify the API key associated with the Dolibarr account to use through the integration.',
    },
  ],
  sessionConfig: {
    perform: {
      source:
        "const options = {\n  url: `${bundle.authData.host}/api/index.php/users/info`,\n  method: 'GET',\n  headers: {\n    'DOLAPIKEY': bundle.authData.api_key\n  }\n}\n\nreturn z.request(options)\n  .then((response) => {\n    response.throwForStatus();\n    const results = response.json;\n\n    return {\n      'id': results.id,\n      'firstname': results.firstname,\n      'lastname': results.lastname,\n    };\n  });",
    },
  },
  connectionLabel:
    '{{bundle.authData.firstname}} {{bundle.authData.lastname}} ({{bundle.authData.host}})',
};

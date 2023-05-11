const perform = async (z, bundle) => {
  const overwriteifexistsValue = bundle.inputData.overwriteifexists ? 1 : 0;
  const createdirifnotexistsValue = bundle.inputData.createdirifnotexists
    ? 1
    : 0;
  const fileencodingValue = bundle.inputData.fileencoding ? 'base64' : '';

  const options = {
    url: `${bundle.authData.host}/api/index.php/documents/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      DOLAPIKEY: bundle.authData.api_key,
    },
    body: JSON.stringify({
      filename: bundle.inputData.filename,
      modulepart: bundle.inputData.modulepart,
      ref: bundle.inputData.ref,
      filecontent: bundle.inputData.filecontent,
      fileencoding: fileencodingValue,
      overwriteifexists: overwriteifexistsValue,
      createdirifnotexists: createdirifnotexistsValue,
    }),
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    return {
      id: results,
      overwriteifexists: overwriteifexistsValue,
      createdirifnotexists: createdirifnotexistsValue,
      fileencoding: fileencodingValue,
    };
  });
};

module.exports = {
  operation: {
    inputFields: [
      {
        key: 'filename',
        label: 'File Name',
        type: 'string',
        helpText: "Name of file to create ('FA1705-0123.txt')",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'modulepart',
        label: 'Module name',
        type: 'string',
        helpText:
          "Name of module or area concerned by file upload ('product', 'service', 'invoice', 'proposal', 'project', 'project_task', 'supplier_invoice', 'expensereport', 'member', ...)",
        choices: [
          { sample: 'Agenda', value: 'agenda', label: 'Agenda' },
          {
            sample: 'Expense Report',
            value: 'expensereport',
            label: 'Expense Report',
          },
          { sample: 'Invoice', value: 'invoice', label: 'Invoice' },
          { sample: 'Member', value: 'member', label: 'Member' },
          { sample: 'Order', value: 'order', label: 'Order' },
          { sample: 'Product', value: 'product', label: 'Product' },
          { sample: 'Project', value: 'project', label: 'Project' },
          { sample: 'Proposal', value: 'proposal', label: 'Proposal' },
          {
            sample: 'Supplier Invoice',
            value: 'supplier_invoice',
            label: 'Supplier Invoice',
          },
          {
            sample: 'Supplier Order',
            value: 'supplier_order',
            label: 'Supplier Order',
          },
          { sample: 'Task', value: 'task', label: 'Task' },
        ],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'ref',
        label: 'Reference',
        type: 'string',
        helpText:
          'Reference of object (This will define subdir automatically and store submited file into it) ,',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'filecontent',
        label: 'File Content',
        type: 'string',
        helpText:
          'File content (string with file content. An empty file will be created if this param',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'fileencoding',
        label: 'File Encoding',
        type: 'boolean',
        helpText: "File encoding (''=no encoding, 'base64'=Base 64)",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'overwriteifexists',
        label: 'Overwrite File if It Already Exists ?',
        type: 'boolean',
        helpText: 'Overwrite file if exists (1 by default)',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'createdirifnotexists',
        label: 'Create Subdirectories if Necessary ?',
        type: 'boolean',
        helpText: "Create subdirectories if the doesn't exists (1 by default)",
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    perform: perform,
  },
  key: 'create_document',
  noun: 'Document',
  display: {
    label: 'Create a Document',
    description:
      'Upload a document in Dolibarr and link it to a module resource',
    hidden: false,
    important: true,
  },
};

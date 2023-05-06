const perform = async (z, bundle) => {
  const options = {
    url: `${bundle.authData.host}/api/index.php/tasks`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      DOLAPIKEY: bundle.authData.api_key,
    },
    body: JSON.stringify({
      ref: bundle.inputData.ref,
      label: bundle.inputData.label,
      date_start: bundle.inputData.date_start,
      time_start: bundle.inputData.time_start,
      fk_project: bundle.inputData.fk_project,
      note: bundle.inputData.note,
    }),
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return { id: results };
  });
};

module.exports = {
  operation: {
    inputFields: [
      {
        key: 'ref',
        label: 'Task reference',
        type: 'string',
        helpText: 'The reference or identifier for the task',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'fk_project',
        label: 'Project ID',
        type: 'integer',
        helpText: 'The ID of the project to which the task belongs',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'label',
        label: 'Task label',
        type: 'string',
        helpText: 'The name or title of the task',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'note',
        label: 'Task note',
        type: 'string',
        helpText: 'Additional details or information about the task',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'date_start_time',
        label: 'Task start date',
        type: 'datetime',
        helpText: 'The planned start date for the task',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
    perform: perform,
    outputFields: [{ key: 'id', label: 'ID', type: 'integer' }],
    sample: { id: 60 },
  },
  key: 'create_task',
  noun: 'Task',
  display: {
    label: 'Create a Project Task',
    description: 'Add a task for a given Dolibarr project',
    hidden: false,
    important: false,
  },
};

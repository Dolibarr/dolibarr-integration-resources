import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createDocument',
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},

		options: [
			{
				name: 'Create a Document',
				value: 'createDocument',
				action: 'Create a document',
				routing: {
					request: {
						method: 'POST',
						url: '/documents/upload',
					},
				},
			},
		],
	},
];

export const documentFields: INodeProperties[] = [
	{
		displayName: 'File Name',
		name: 'filename',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocument'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'filename',
			},
		},
	},
	{
		displayName: 'Module Name',
		name: 'modulepart',
		type: 'options',
		default: 'agenda',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocument'],
			},
		},
		options: [
			{
				name: 'Agenda',
				value: 'agenda',
			},
			{
				name: 'Expense Report',
				value: 'expensereport',
			},
			{
				name: 'Invoice',
				value: 'invoice',
			},
			{
				name: 'Member',
				value: 'member',
			},
			{
				name: 'Order',
				value: 'order',
			},
			{
				name: 'Product',
				value: 'product',
			},
			{
				name: 'Project',
				value: 'project',
			},
			{
				name: 'Proposal',
				value: 'proposal',
			},
			{
				name: 'Supplier Invoice',
				value: 'supplier_invoice',
			},
			{
				name: 'Supplier Order',
				value: 'supplier_order',
			},
			{
				name: 'Task',
				value: 'task',
			},
			// Needs to be updated whenever new module supports are added
		],
		routing: {
			send: {
				type: 'body',
				property: 'modulepart',
			},
		},
	},
	{
		displayName: 'Reference',
		name: 'ref',
		type: 'string', // should become drop down menu in future
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocument'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ref',
			},
		},
		description:
			'Reference of the object to which the document is attached (might be called ID or ref)',
	},
	{
		displayName: 'File Content',
		name: 'filecontent',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 7,
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocument'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'filecontent',
			},
		},
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocument'],
			},
		},
		options: [
			{
				displayName: 'File Encoding',
				name: 'fileencoding',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						body: {
							createdirifnoexists: '={{$value === true ? "base64" : ""}}',
						},
					},
				},
			},
			{
				displayName: 'Overwrite File if It Already Exists ?',
				name: 'overwriteifexists',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						body: {
							overwriteifexists: '={{$value === true ? 1 : 0}}',
						},
					},
				},
			},
			{
				displayName: 'Create Subdirectories if Necessary ?',
				name: 'createdirifnoexists',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						body: {
							createdirifnoexists: '={{$value === true ? 1 : 0}}',
						},
					},
				},
			},

		]
	},

];

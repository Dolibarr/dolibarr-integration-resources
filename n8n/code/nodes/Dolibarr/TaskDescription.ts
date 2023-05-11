import type { INodeProperties } from 'n8n-workflow';
import { formatDateStart, formatDateEnd } from './GenericFunctions';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createTask',
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},

		options: [
			{
				name: 'Create Task',
				value: 'createTask',
				action: 'Create a task',
				routing: {
					request: {
						method: 'POST',
						url: '/tasks',
					},
				},
			},
		],
	},
];

export const taskFields: INodeProperties[] = [
	{
		displayName: 'Task Reference',
		name: 'ref',
		type: 'string',
		default: '',
		description: 'A Task Reference that is not already used in the project',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ref',
			},
		},
	},
	{
		displayName: 'Project ID',
		name: 'fk_project',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The ID of the project to which the task belongs',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a project...',
				typeOptions: {
					searchListMethod: 'projectSearch',
					searchable: true,
					searchFilterRequired: false,
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'fk_project',
			},
		},
	},
	// {
	// 	displayName: 'Project ID',
	// 	name: 'fk_project',
	// 	type: 'number',
	// 	default: 1,
	// 	required: true,
	// 	placeholder: 'The ID of the project to which the task belongs',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['task'],
	// 			operation: ['createTask'],
	// 		},
	// 	},
	// 	routing: {
	// 		send: {
	// 			type: 'body',
	// 			property: 'fk_project',
	// 		},
	// 	},
	// },
	{
		displayName: 'Task Name',
		name: 'label',
		type: 'string',
		default: '',
		placeholder: 'Name of the Task',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'label',
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		placeholder: 'Description of the Task',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'description',
			},
		},
	},
	{
		displayName: 'Starting Date',
		name: 'date_start',
		type: 'dateTime',
		default: '',
		placeholder: 'Starting Date of the Task',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		routing: {
			request: {
				body: {
					date_start: '={{$value}}',
				},
			},
			send: {
				preSend: [formatDateStart],
			},
		},
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createTask'],
			},
		},
		options: [
			{
				displayName: 'Ending Date',
				name: 'date_end',
				type: 'dateTime',
				default: '',
				placeholder: 'Ending Time of the Task',
				routing: {
					request: {
						body: {
							date_end: '={{$value}}',
						},
					},
					send: {
						preSend: [formatDateEnd],
					},
				},
			},
		],
	},
];

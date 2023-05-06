import type { INodeProperties } from 'n8n-workflow';
import { setUserOwnerId, formatDateF, formatDateP } from './GenericFunctions';

export const agendaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createEvent',
		displayOptions: {
			show: {
				resource: ['agenda'],
			},
		},

		options: [
			{
				name: 'Create Event',
				value: 'createEvent',
				action: 'Create an event',
				routing: {
					request: {
						method: 'POST',
						url: '/agendaevents',
					},
				},
			},
		],
	},
];

export const agendaFields: INodeProperties[] = [
	{
		displayName: 'Event Name',
		name: 'label',
		type: 'string',
		default: '',
		placeholder: 'Name of the event',
		required: true,
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
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
		name: 'note',
		type: 'string',
		default: '',
		placeholder: 'Description of the event',
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'note',
			},
		},
	},
	{
		displayName: 'Event Creator',
		name: 'userownerid',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			send: {
				preSend: [setUserOwnerId],
			},
		},
	},
	{
		displayName: 'Event Type',
		name: 'type_code',
		type: 'options',
		default: 'AC_INT',
		placeholder: 'Type of event',
		required: true,
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		options: [
			{
				name: 'Intervention on Site',
				value: 'AC_INT',
			},
			{
				name: 'Meetings',
				value: 'AC_RDV',
			},
			{
				name: 'Reception of Email',
				value: 'AC_EMAIL_IN',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'type_code',
			},
		},
	},
	{
		displayName: 'Beginning Date of Event',
		name: 'start_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			request: {
				body: {
					datep: '={{$value}}',
				},
			},
			send: {
				preSend: [formatDateP],
			},
		},
	},
	{
		displayName: 'End Date of Event',
		name: 'end_date',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			request: {
				body: {
					datef: '={{$value}}',
				},
			},
			send: {
				preSend: [formatDateF],
			},
		},
	},
	{
		displayName: 'Email From',
		name: 'email_from',
		type: 'string',
		default: '',
		placeholder: 'Email From',
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'email_from',
			},
		},
	},
	{
		displayName: 'Email Subject',
		name: 'email_subject',
		type: 'string',
		default: '',
		placeholder: 'Email Subject',
		displayOptions: {
			show: {
				resource: ['agenda'],
				operation: ['createEvent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'email_subject',
			},
		},
	},
];

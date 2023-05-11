import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { agendaFields, agendaOperations } from './AgendaDescription';
import { taskFields, taskOperations } from './TaskDescription';
import { documentFields, documentOperations } from './DocumentDescription';
import { projectSearch } from './GenericFunctions';

export class Dolibarr implements INodeType {
	description: INodeTypeDescription = {
		// General parameters of node
		displayName: 'Dolibarr',
		name: 'dolibarr',
		icon: 'file:dolibarr_logo.svg',
		group: [],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Add data to Dolibarr',
		defaults: {
			name: 'Dolibarr',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'dolibarrApi',
				required: true,
			},
		],
		requestDefaults: {
			returnFullResponse: true,
			baseURL: '={{$credentials.baseUrl}}/api/index.php',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

		properties: [
			// what can you do with the node
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Agenda',
						value: 'agenda',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'agenda',
			},

			...agendaOperations,
			...documentOperations,
			...taskOperations,

			...agendaFields,
			...taskFields,
			...documentFields,
		],
	};

	methods = {
		listSearch: {
			projectSearch,
		},
	};
}

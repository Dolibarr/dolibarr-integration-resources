import type {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class DolibarrApi implements ICredentialType {
	name = 'dolibarrApi';

	displayName = 'Dolibarr API';

	/* Once there is a proper page explaining how to get an API key, insert link below */
	// documentationUrl =
	// 	'https://wiki.dolibarr.org/index.php?title=Module_Web_Services_API_REST_(developer)';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'https://yourdolibarrurl',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			required: true,
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				DOLAPIKEY: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}/api/index.php',
			url: '/users/info',
			method: 'GET',
		},
	};
}

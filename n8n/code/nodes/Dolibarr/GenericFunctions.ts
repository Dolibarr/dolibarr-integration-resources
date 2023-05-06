import {
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IHookFunctions,
	IExecuteFunctions,
	IDataObject,
	JsonObject,
	GenericValue,
	INodeListSearchResult,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';

export async function apiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IExecuteSingleFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object,
	query?: IDataObject,
): Promise<any> {
	query = query || {};
	const returnData: IDataObject[] = [];
	let nextCursor: string | undefined = undefined;
	let responseData;

	do {
		query.cursor = nextCursor;
		query.limit = 100;
		responseData = await apiRequest.call(this, method, endpoint, body, query);
		returnData.push.apply(returnData, responseData.data as IDataObject[]);
		nextCursor = responseData.nextCursor as string | undefined;
	} while (nextCursor);
	return returnData;
}

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IExecuteSingleFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | GenericValue | GenericValue[] = {},
	query: IDataObject = {},
): Promise<any> {
	query = query || {};

	type DolibarrApiCredentials = {
		apiKey: string;
		baseUrl: string;
	};

	const credentials = (await this.getCredentials('dolibarrApi')) as DolibarrApiCredentials;

	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `${credentials.baseUrl}/api/index.php/${endpoint}`,
		headers: {
			'content-type': 'application/json',
		},
	};

	try {
		return this.helpers.httpRequestWithAuthentication.call(this, 'dolibarrApi', options);
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function setUserOwnerId(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const responseData = await apiRequest.call(this, 'GET', 'users/info');
	if (requestOptions.body != undefined) {
		Object.assign(requestOptions.body, { userownerid: responseData.id });
	}
	return requestOptions;
}

interface DolibarrProjectItem {
	id: string;
	title: string;
}

export async function projectSearch(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const query: string[] = [];
	if (filter) {
		query.push(`title contains '${filter.replace("'", "\\'")}'`);
	}

	/* TODO: add support for search */
	const res = await apiRequest.call(this, 'GET', 'projects');

	return {
		results: res.map((item: DolibarrProjectItem) => ({
			name: item.title,
			value: item.id,
		})),
		paginationToken: res.nextPageToken,
	};
}

/* Duplication of code which is not good. Unfortunately, we have no way to pass other arguments to a
function. This makes it really hard to factorize code */

export async function formatDateP(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as IDataObject;
	let jsDate = new Date(body.datep as string);
	Object.assign(body, { datep: jsDate.getTime() / 1000 });

	return requestOptions;
}

export async function formatDateF(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as IDataObject;
	let jsDate = new Date(body.datef as string);
	Object.assign(body, { datef: jsDate.getTime() / 1000 });

	return requestOptions;
}

export async function formatDateStart(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as IDataObject;
	let jsDate = new Date(body.date_start as string);
	Object.assign(body, { date_start: jsDate.getTime() / 1000 });

	return requestOptions;
}

export async function formatDateEnd(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as IDataObject;
	let jsDate = new Date(body.date_end as string);
	Object.assign(body, { date_end: jsDate.getTime() / 1000 });

	return requestOptions;
}

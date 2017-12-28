import fetch from 'node-fetch';
import xmlAsJSON from './xml-as-json';

// return a plex-ified fetch promise
export default function (url, init) {
	// assign plex defaults to the fetch init
	const hydratedInit = Object.assign({}, init, {
		method: Object(init).method || 'GET',
		headers: Object.assign({
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
			'X-Plex-Product': 'PlexFetch',
			'X-Plex-Version': '1.0.0',
			'X-Plex-Client-Identifier': '3bbcee75-cecc-5b56-8031-b6641c1ed1f1'
		}, Object(init).headers)
	});

	// fetch the url
	return fetch(url, hydratedInit).then(
		// return a successful response as an object or text
		response => /^[23]\d{2}$/.test(response.status) ?
			response.text().then(
				text => {
					try {
						// conditionally return json as an object
						const json = JSON.parse(text);

						return json.MediaContainer || json;
					} catch (jsonerror) {
						try {
							// conditionally return xml as an object
							const xmljson = xmlAsJSON(text);

							return xmljson.MediaContainer || xmljson;
						} catch (xmlerror) {
							// conditionally return text
							return text || null;
						}
					}
				}
			)
		// otherwise throw using the status
		: Promise.reject({
			status: response.status,
			statusText: response.statusText
		})
	)
}

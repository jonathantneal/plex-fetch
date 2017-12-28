import fetch from './lib/fetch';

export default class PlexFetch {
	static defaultServerURL = 'http://127.0.0.1:32400';
	static defaultSigninURL = 'https://plex.tv/users/sign_in.json';

	constructor(opts) {
		this.connect(opts);
	}

	/* connect to a plex media server
	/* ====================================================================== */

	connect(opts) {
		// server and signin urls (conditionally removing the trailing slash)
		const serverURL = String(Object(opts).serverURL || PlexFetch.defaultServerURL).replace(/\/$/, '');
		const signinURL = String(Object(opts).signinURL || PlexFetch.defaultSigninURL).replace(/\/$/, '');

		// encoded username and password
		const username = encodeURIComponent(Object(opts).username || '');
		const password = encodeURIComponent(Object(opts).password || '');

		// function promising a connection
		const promise = () => fetch(signinURL, {
			method: 'POST',
			body: `user[login]=${username}&user[password]=${password}`
		}).then(
			data => ({
				serverURL,
				user: Object(Object(data).user)
			})
		);

		// conditionally update the connection promise
		this.promise = username && password ?
			promise()
		: this.promise ?
			this.promise.catch(
				() => promise()
			)
		: promise();

		return this.promise;
	}

	/* fetch things to and from a plex media server
	/* ====================================================================== */

	fetch(path, init) {
		// path with a conditionally prepended starting slash
		const slashedPath = String(path).replace(/^\/?/, '/');

		return this.connect().then(
			// query the server with options and the user authentication token
			({ serverURL, user }) => fetch(
				`${serverURL}${slashedPath}`,
				Object.assign({}, init, {
					headers: Object.assign({
						'X-Plex-Token': user.authToken
					}, Object(init).headers)
				})
			)
		);
	}

	/* fetch using GET (and conditionally a filter query)
	/* ====================================================================== */

	get(path, filters) {
		// range combinators matcher
		const rangeAndValueMatch = /^(=|<=|>=|!=)?(.+)$/;

		// encoded filters joined into a query
		const pathWithFilters = `${path}?${Object.keys(Object(filters)).map(
			key => {
				// extracted range (=, <=, etc.) and value (foo, bar, etc.)
				const [, range = '=', value = filters[key] ] = String(filters[key]).match(rangeAndValueMatch) || [];

				// encoded key and value
				const encodedKey = encodeURIComponent(key);
				const encodedValue = encodeURIComponent(value);

				return `${encodedKey}${range}${encodedValue}`;
			}
		).join('&')}`;

		return this.fetch(pathWithFilters);
	}

	/* fetch using PUT (and conditionally a value query)
	/* ====================================================================== */

	put(path, values) {
		// typed keysmatcher (x.value, y.locked, etc.)
		const keyAndTypeMatch = /^(.+?)(\.[^\.]+)?$/;

		// encoded values joined into a query
		const pathWithValues = `${path}?${Object.keys(Object(values)).map(
			key => {
				// extracted key (x, y, etc.) and type (.value, .locked, etc.)
				const [, matchedKey = key, type = '.value'] = key.match(keyAndTypeMatch) || [];

				// encoded key and value
				const encodedKey = encodeURIComponent(matchedKey);
				const encodedValue = encodeURIComponent(values[key]);

				return `${encodedKey}${type}=${encodedValue}`
			}
		).join('&')}`;

		return this.fetch(pathWithValues, { method: 'PUT' });
	}

	/* fetch using DELETE
	/* ====================================================================== */

	delete(path) {
		return this.fetch(path, { method: 'DELETE' });
	}
}

# Plex Fetch [<img src="https://jonathantneal.github.io/plex-fetch/plex-fetch.svg" alt="JavaScript Logo" width="90" height="90" align="right">][Plex Fetch]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Follow on Twitter][twt-img]][twt-url]

[Plex Fetch] lets you fetch information to and from a [Plex Media Server] using
its Web API.

```sh
npm install plex-fetch --save-dev
```

## Usage

Creating a new [Plex Fetch] instance connects to a [Plex Media Server] if you
provide a username and password.

```js
const plex = new PlexFetch({
  username: 'some_user',
  password: 'some_password'
})
```

You can connect to non-local servers, too.

```js
const plex = new PlexFetch({
  username: 'some_user',
  password: 'some_password',
  serverURL: 'http://127.0.0.1:32400' // <- this is the default URL
})
```

And, if necessary, you can login with an alternative server.

```js
const plex = new PlexFetch({
  username: 'some_user',
  password: 'some_password',
  signinURL: 'https://plex.tv/users/sign_in.json' // <- this is the default URL
})
```

### connect

```
connect( options = { username, password, serverURL, signinURL } )
```

The **connect** method connects or reconnects to a [Plex Media Server] if you
have not yet successfully logged in. It returns a Promise of the Plex user’s
credentials and authentication token.

```js
plex.connect() // promises Object { authToken: '', ... }
```

### fetch

```
fetch( path = "", init = { method, headers, body, ... } )
```

The **fetch** method fetches things to and from a [Plex Media Server]. It
returns a Promise of the JSON response.

It requires 1 argument, which is the **path** you are fetching. It allows a
second argument, which is the **options** you wish to apply to the request.

```js
plex.fetch('library/metadata/905') // promises Object { MetaData: [], ... }
```

Options are forwarded directly to the request, and include
[all of the available custom settings] available to a native fetch request.

```js
plex.fetch('library/metadata/905', {
  method: 'GET', // <- this is the default method
  headers: {
    'Accept': 'application/json', // <- this is the default accept header
    'X-Plex-Token': '...', // <- this is automatically sent for you
  }
})
```

### get

```
get( path = "" [ , filters = { ... } ] )
```

The **get** method gets from a [Plex Media Server], conditionally using filters
from an object.

It requires 1 argument, which is the **path** you are fetching. It allows a
second argument, which is the **filters** object you are using. It returns a
Promise of the JSON response.

```js
plex.get('library/metadata/905') // promises Object { MetaData: [], ... }
```

```js
plex.get('library/sections/2/all', {
  year: 1861,
  year: '=1861', // <- this is the same as writing 1861
  year: '>=2001' // <- other filter ranges are also supported
})
```

### put

```
put( path = "" [ , values = { ... } ] )
```

The **put** method puts to a [Plex Media Server], conditionally using values
from an object.

It requires 1 argument, which is the **path** you are fetching. It allows a
second argument, which is the **values** object you are using. It returns a
Promise of the JSON response.

```js
plex.put('library/metadata/905?year.value=1861')
```

```js
plex.put('library/metadata/905', {
  year: 1861,
  'year.value': 1861, // <- this is the same as writing year
  'year.locked': 1 // <- other value types are also supported
})
```

### delete

```
delete( path = "" )
```

The **delete** method deletes from a [Plex Media Server].

It takes only 1 argument — the **path** you are deleting from. It returns a
Promise of the JSON response.

```js
plex.delete('library/metadata/905')
```

[cli-url]: https://travis-ci.org/jonathantneal/plex-fetch
[cli-img]: https://img.shields.io/travis/jonathantneal/plex-fetch.svg
[npm-url]: https://www.npmjs.com/package/plex-fetch
[npm-img]: https://img.shields.io/npm/v/plex-fetch.svg
[twt-img]: https://img.shields.io/twitter/follow/jon_neal.svg
[twt-url]: https://twitter.com/jon_neal
[win-url]: https://ci.appveyor.com/project/jonathantneal/plex-fetch
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/plex-fetch.svg

[all of the available custom settings]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
[Plex Fetch]: https://github.com/jonathantneal/plex-fetch
[Plex Media Server]: https://www.plex.tv/

import React from 'react';
import PropTypes from 'prop-types';
import Storage from '@nti/web-storage';
import {Hooks} from '@nti/web-commons';

const SuccessKey = 'google-auth-success';
const FailureKey = 'google-auth-failure';
const HandleMessage = {
	[SuccessKey]: true,
	[FailureKey]: true
};

const getScopesId = scopes => scopes.join('-');
const Scopes = {};

function parseHash (hash) {
	hash = hash.replace(/^#/, '');

	const parts = hash.split('&');

	return parts.reduce((acc, part) => {
		const [name, value] = part.split('=');

		return {
			...acc,
			[name]: value
		};
	}, {});
}

function getRedirectURL (success) {
	if (!global.location) { return ''; }

	return `${global.location.origin}/app/post-query-params/${success ? SuccessKey : FailureKey}`;
}

function getAuthLink (scopes) {
	const base = `${global.location.origin}/dataserver2/google.oauth.authorize`;
	const url = new URL(base);

	url.searchParams.set('success', getRedirectURL(true));
	url.searchParams.set('failure', getRedirectURL(false));
	url.searchParams.set('scope', (scopes ?? []).join(' '));

	return url.toString();	
}

function usePostMessage (onMessage) {
	React.useEffect(() => {
		global.addEventListener?.('message', onMessage);

		return () => {
			global.removeEventListener?.('message', onMessage);
		};
	}, [onMessage]);
}


function useAccessToken (scopes) {
	const forceUpdate = Hooks.useForceUpdate();

	const scopesId = getScopesId(scopes);
	const active = Scopes[scopesId] = Scopes[scopesId] || ({token: null, error: null, windowActive: false});

	usePostMessage((e) => {
		const {data: eventData} = e;
		const {data, hash} = eventData || {};

		if (!data || !HandleMessage[data.key]) { return; }

		const hashData = parseHash(hash);

		if (data.key === SuccessKey) {
			active.token = Storage.encodeExpiryValue(
				hashData['access_token'],
				Date.now() + (parseInt(hashData['expires_in'], 10) * 1000)
			);
			forceUpdate();
		} else if (data.key === FailureKey) {
			active.error = hashData.error;
			forceUpdate();
		}
	});

	React.useEffect(() => {
		if (!active.token && !active.error && !active.windowActive) {
			active.windowActive = true;

			const link = getAuthLink(scopes);
			global.open?.(link, 'google-auth-window', 'menubar=no,titlebar=no,toolbar=no,width=800,height=600');
		}
	}, [active]);

	return {
		token: Storage.decodeExpiryValue(active.token),
		error: active.error
	};
}


GoogleAuth.propTypes = {
	onAuthorized: PropTypes.func,
	onFailure: PropTypes.func,
	scopes: PropTypes.array
};
export default function GoogleAuth ({onAuthorized, onFailure, scopes}) {
	const {token, error} = useAccessToken(scopes);

	React.useEffect(() => {
		if (token) { onAuthorized(token); }
		else if (error) { onFailure(error); }
	}, [token, error, onAuthorized, onFailure]);

	return null;
}
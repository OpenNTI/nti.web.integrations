import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { getService, ExternalLibraryManager } from '@nti/web-client';
import Storage from '@nti/web-storage';
import { Loading } from '@nti/web-commons';
import { useForceUpdate } from '@nti/web-core';

const GAPISource = 'https://apis.google.com/js/api.js';

const SuccessKey = 'google-auth-success';
const FailureKey = 'google-auth-failure';
const HandleMessage = {
	[SuccessKey]: true,
	[FailureKey]: true,
};

const getScopesId = scopes => scopes.join('-');
const Scopes = {};

function getGoogleAPIKeys() {
	if (getGoogleAPIKeys.cache) {
		return getGoogleAPIKeys.cache;
	}

	const resolve = async () => {
		const service = await getService();
		const keys = await service.getUserWorkspace().fetchLink('GoogleAPIKey');

		return keys;
	};

	getGoogleAPIKeys.cache = getGoogleAPIKeys.cache || resolve();

	return getGoogleAPIKeys.cache;
}

function parseHash(hash) {
	hash = hash.replace(/^#/, '');

	const parts = hash.split('&');

	return parts.reduce((acc, part) => {
		const [name, value] = part.split('=');

		return {
			...acc,
			[name]: value,
		};
	}, {});
}

function getRedirectURL(success) {
	if (!global.location) {
		return '';
	}

	return `${global.location.origin}/app/post-query-params/${
		success ? SuccessKey : FailureKey
	}`;
}

async function getAuthLink(scopes) {
	const apiKeys = await getGoogleAPIKeys();
	const authLink = apiKeys.getAuthLink(global.location.origin);
	const url = new URL(authLink);

	url.searchParams.set('success', getRedirectURL(true));
	url.searchParams.set('failure', getRedirectURL(false));
	url.searchParams.set('scope', (scopes ?? []).join(' '));

	return url.toString();
}

function usePostMessage(onMessage) {
	React.useEffect(() => {
		global.addEventListener?.('message', onMessage);

		return () => {
			global.removeEventListener?.('message', onMessage);
		};
	}, [onMessage]);
}

function useAccessToken(scopes, { onCancel }) {
	const forceUpdate = useForceUpdate();

	const scopesId = getScopesId(scopes);
	const active = (Scopes[scopesId] = Scopes[scopesId] || {
		token: null,
		error: null,
		windowActive: false,
		windowPoll: null,
	});

	usePostMessage(e => {
		const { data: eventData } = e;
		const { data, hash } = eventData || {};

		if (!data || !HandleMessage[data.key]) {
			return;
		}

		const hashData = parseHash(hash);
		const cleanupWindow = () => {
			active.windowActive = false;
			active.canceled = false;
			active.portal = null;
			clearInterval(active.windowPoll);
		};

		if (data.key === SuccessKey) {
			cleanupWindow();
			active.token = Storage.encodeExpiryValue(
				hashData['access_token'],
				Date.now() + parseInt(hashData['expires_in'], 10) * 1000
			);
			forceUpdate();
		} else if (data.key === FailureKey) {
			cleanupWindow();
			active.error = hashData.error;
			forceUpdate();
		}
	});

	React.useEffect(() => {
		const maybeShowWindow = async () => {
			if (!active.token && !active.error && !active.windowActive) {
				try {
					const win = global.open?.(
						'javascript:',
						'google-auth-window',
						'menubar=no,titlebar=no,toolbar=no,width=800,height=600'
					);

					const container = win.document.createElement('div');
					win.document.body.appendChild(container);

					active.portal = ReactDOM.createPortal(
						<AuthWindow scopes={scopes} popup={win} />,
						container
					);

					active.windowActive = true;
					clearInterval(active.windowPoll);
					active.windowPoll = setInterval(() => {
						if (win.closed) {
							active.windowActive = false;
							active.portal = null;
							clearInterval(active.windowPoll);

							if (!active.token && !active.error) {
								onCancel?.();
							}
						}
					}, 500);

					forceUpdate();
				} catch (e) {
					active.windowActive = false;
					active.canceled = false;
					active.portal = null;
					clearInterval(active.windowPoll);

					active.error = e;
					forceUpdate();
				}
			}
		};

		maybeShowWindow();
	}, [active]);

	return {
		token: Storage.decodeExpiryValue(active.token),
		error: active.error,
		canceled: active.canceled,
		portal: active.portal ?? null,
	};
}

GoogleAuth.getGoogleAPIKeys = getGoogleAPIKeys;
GoogleAuth.getGoogleAPI = async () => {
	await ExternalLibraryManager.injectScript(GAPISource, 'gapi');
	return global.gapi;
};
GoogleAuth.propTypes = {
	onAuthorized: PropTypes.func,
	onFailure: PropTypes.func,
	onCancel: PropTypes.func,
	scopes: PropTypes.array,
};
export default function GoogleAuth({
	onAuthorized,
	onFailure,
	onCancel,
	scopes,
}) {
	const { token, error, portal } = useAccessToken(scopes, { onCancel });

	React.useEffect(() => {
		if (token) {
			onAuthorized?.(token);
		} else if (error) {
			onFailure?.(error);
		}
	}, [token, error, onAuthorized, onFailure]);

	return portal;
}

AuthWindow.propTypes = {
	scopes: PropTypes.any,
	popup: PropTypes.object,
};
function AuthWindow({ scopes, popup }) {
	React.useEffect(() => {
		let unmounted = false;

		const resolveRedirect = async () => {
			const link = await getAuthLink(scopes);

			if (!unmounted) {
				popup.location.href = link;
			}
		};

		resolveRedirect().catch(() => {
			// eslint-disable-next-line no-console
			console.error('No redirect configured', scopes);
		});
		return () => (unmounted = true);
	}, []);

	return <Loading.Spinner.Large />;
}

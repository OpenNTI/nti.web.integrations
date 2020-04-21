import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('integrations.services.components.connect-window-launcher.Link', {
	unknownError: 'Unable to connect. Try again.'
});

const MessageKey = 'service-authorization';

function buildConnectURL (service) {
	const {name} = service;

	const getReturn = (success) => {
		if (!global.location) { return ''; }

		return `${global.location.origin}/app/post-query-params/${MessageKey}?success=${success ? 1 : 0}&service=${name}`;
	};

	return service.getConnectLink({success: getReturn(true), failure: getReturn(false)});
}

ConnectWindowLinkLauncher.propTypes = {
	service: PropTypes.shape({
		name: PropTypes.string.isRequired,
		getConnectLink: PropTypes.func.isRequired,
		sync: PropTypes.func.isRequired
	}).isRequired,
	onConnecting: PropTypes.func,
	onConnect: PropTypes.func,
	onError: PropTypes.func
};
export default function ConnectWindowLinkLauncher ({service, onConnecting = () => {}, onConnect = () => {}, onError = () => {}, ...otherProps}) {
	const authWindow = React.useRef(null);

	React.useEffect(() => {
		if (!global.addEventListener) { return; }

		const onMessage = (e) => {
			const {data} = e?.data || {};

			if (!data || data.key !== MessageKey) { return; }

			const {params} = data;

			if (params.service !== service.name) { return; }

			if (params.success === '1') {
				service.sync();
				onConnect();
			} else if (params.success === '0') {
				service.sync();
				onError(new Error(t('unknownError')));
			}
		};

		global.addEventListener('message', onMessage);

		return () => {
			global.removeEventListener('message', onMessage);
		};
	}, [service]);

	const onClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		onConnecting();

		const link = buildConnectURL(service);

		if (link && typeof window !== undefined) {
			authWindow.current = window.open(link, 'authorization-window', 'menubar=no,titlebar=no,toolbar=no,width=800,height=600');
		}
	};

	return (
		<a {...otherProps} onClick={onClick} />
	);
}
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import { ReturnParams } from '../../../utils';

const t = scoped(
	'integrations.services.components.connect-window-launcher.Link',
	{
		unknownError: 'Unable to connect. Try again.',
	}
);

function buildConnectURL(service) {
	const { name } = service;

	const getReturn = success => {
		if (!global.location) {
			return '';
		}

		return ReturnParams.addToURL(global.location.href, {
			service: name,
			success: success ? 1 : 0,
		});
	};

	return service.getConnectLink({
		success: getReturn(true),
		failure: getReturn(false),
	});
}

ConnectWindowLinkLauncher.propTypes = {
	service: PropTypes.shape({
		name: PropTypes.string.isRequired,
		getConnectLink: PropTypes.func.isRequired,
		sync: PropTypes.func.isRequired,
	}).isRequired,
	onConnect: PropTypes.func,
	onError: PropTypes.func,
};
export default function ConnectWindowLinkLauncher({
	service,
	onConnect = () => {},
	onError = () => {},
	...otherProps
}) {
	useEffect(() => {
		const params = ReturnParams.get();
		const success = params?.get('success');

		if (success === '1') {
			onConnect();
		} else if (success === '0') {
			onError(new Error(t('unknownError')));
		}
	}, []);

	return <a {...otherProps} href={buildConnectURL(service)} />;
}

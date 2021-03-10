// import React from 'react';
import PropTypes from 'prop-types';

import { Hooks } from '@nti/web-commons';

import { findCredlyIntegration } from '../utils';

const { useResolver } = Hooks;
const { isResolved } = useResolver;

IfCredlyIsConnected.propTypes = {
	context: PropTypes.object,

	children: PropTypes.any,
	fallback: PropTypes.any,

	canConnect: PropTypes.bool,
};
export default function IfCredlyIsConnected({
	context,
	children,
	fallback = null,
	canConnect: showOnCanConnect,
}) {
	const resolver = useResolver(() => findCredlyIntegration(context), [
		context,
	]);
	const integration = isResolved(resolver) ? resolver : null;

	const connected = integration?.isConnected();
	const canConnect = showOnCanConnect && integration?.canConnect();

	if (!connected && !canConnect) {
		return fallback;
	}

	return children;
}

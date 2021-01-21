import React from 'react';
import PropTypes from 'prop-types';
import {Hooks} from '@nti/web-commons';

import {findIntegration} from '../../../utils';
import {Handles} from '../Constants';

const {useResolver} = Hooks;
const {isResolved} = useResolver;

IfCredlyIsConnected.propTypes = {
	context: PropTypes.object,

	children: PropTypes.any,
	fallback: PropTypes.any,

	canConnect: PropTypes.bool
};
export default function IfCredlyIsConnected ({context, children, fallback = null, canConnect:showOnCanConnect}) {
	const resolver = useResolver(() => findIntegration(i => Handles[i.MimeType], context), [context]);
	const integration = isResolved(resolver) ? resolver : null;

	const connected = integration?.isConnected();
	const canConnect = integration?.canConnect();

	if (!connected || (showOnCanConnect && canConnect)) { return fallback; }

	return children;
}

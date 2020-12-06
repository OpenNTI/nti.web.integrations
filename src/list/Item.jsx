import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Text, Image, Button} from '@nti/web-commons';

import {getLogoFor, getNameFor}  from '../services';

import styles from './Styles.css';

const t = scoped('integrations.list.Item', {
	connected: 'Connected',
	connect: 'Connect',
	upgrade: 'Upgrade',
	enabled: 'Enabled'
});

function getActionText (service) {
	if (service.isConnected()) {
		return service.canDisconnect() ? t('connected') : t('enabled');
	} else if (service.canConnect()) {
		return t('connect');
	} else if (!service.comingSoon) {
		return t('upgrade');
	}

	return '';
}


IntegrationListItem.propTypes = {
	service: PropTypes.shape({
		isEnabled: PropTypes.func,
		isConnected: PropTypes.func,
		canConnect: PropTypes.func,
		canDisconnect: PropTypes.func
	}),
	onClick: PropTypes.func
};
export default function IntegrationListItem ({service, onClick}) {
	const logo = getLogoFor(service);
	const name = getNameFor(service);

	const connected = service.isConnected();
	const actionable = service.canConnect() || service.canDisconnect();

	return (
		<Button plain className={cx(styles.integration, {[styles.connected]: connected, [styles.actionable]: actionable})} onClick={actionable ? onClick : null}>
			<div className={styles.logo}>
				<Image src={logo} alt={`${name} logo`} />
			</div>
			<Text.Base className={styles.name}>{name}</Text.Base>
			<div className={styles.status}>
				<Text.Base>{getActionText(service)}</Text.Base>
				{connected && (<span className={styles.connectedIndicator} />)}
			</div>
		</Button>
	);
}

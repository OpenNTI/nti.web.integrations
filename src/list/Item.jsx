import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Text} from '@nti/web-commons';

import {getLogoFor, getNameFor} from '../services';

import Styles from './Styles.css';
import Lock from './assets/lock.svg';

const cx = classnames.bind(Styles);
const t = scoped('integrations.list.Item', {
	connected: 'Connected',
	connect: 'Connect',
	upgrade: 'Upgrade'
});

const getActionText = (service) => {
	if (service.isConnected()) { return t('connected'); }
	if (service.canConnect()) { return t('connect'); }

	return t('upgrade');
};

IntegrationItem.propTypes = {
	service: PropTypes.shape({
		isEnabled: PropTypes.func,
		isConnected: PropTypes.func
	}),
	onClick: PropTypes.func
};
export default function IntegrationItem ({service, onClick}) {
	const logo = getLogoFor(service);
	const name = getNameFor(service);

	const enabled = service.isEnabled();
	const connected = service.isConnected();

	return (
		<a className={cx('nti-integration', {disabled: !enabled})} role="button" onClick={onClick}>
			<div className={cx('logo')}>
				<img src={logo} alt={`${name} logo`} />
			</div>
			<div className={cx('name-container')}>
				<Text.Base className={cx('name')}>{name}</Text.Base>
				{!enabled && (
					<img className={cx('lock')} src={Lock} />
				)}
			</div>
			<div className={cx('status')}>
				{connected && (<span className={cx('connected-indicator')} />)}
				<Text.Base>
					{getActionText(service)}
				</Text.Base>
			</div>
		</a>
	);
}
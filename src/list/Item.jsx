import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Text} from '@nti/web-commons';

import {getLogoFor, getNameFor} from '../services';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.list.Item', {
	connected: 'Connected',
	connect: 'Connect'
});

IntegrationItem.propTypes = {
	service: PropTypes.shape({
		isEnabled: PropTypes.func,
		isConnected: PropTypes.func
	})
};
export default function IntegrationItem ({service}) {
	const logo = getLogoFor(service);
	const name = getNameFor(service);

	const enabled = service.isEnabled();
	const connected = true;//service.isConnected();

	return (
		<div className={cx('nti-integration', {disabled: enabled})}>
			<div className={cx('logo')}>
				<img src={logo} alt={`${name} logo`} />
			</div>
			<Text.Base className={cx('name')}>{name}</Text.Base>
			<div className={cx('status')}>
				{connected && (<span className={cx('connected-indicator')} />)}
				<Text.Base>
					{connected ? t('connected') : t('connect')}
				</Text.Base>
			</div>
		</div>
	);
}
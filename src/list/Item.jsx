import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Text, Image } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import { getLogoFor, getNameFor } from '../services';

import styles from './Styles.css';

const t = scoped('integrations.list.Item', {
	connected: 'Connected',
	connect: 'Connect',
	upgrade: 'Upgrade',
	enabled: 'Enabled',
	earlyAccess: 'Request Early Access',
});

const Actions = [
	{
		handles: s => s.isConnected() && s.canDisconnect(),
		actionable: true,
		clickable: true,
		label: t('connected'),
	},
	{
		handles: s => s.isConnected() && s.hasInfo?.(),
		clickable: true,
		label: t('enabled'),
	},
	{
		handles: s => s.isConnected(),
		label: t('enabled'),
	},
	{
		handles: s => s.canConnect(),
		actionable: true,
		clickable: true,
		label: t('connect'),
	},
	{
		handles: s => !s.comingSoon,
		label: t('upgrade'),
		actionable: true,
		getProps: s => ({
			href: `mailto:sales@nextthought.com?subject=${encodeURIComponent(
				getNameFor(s)
			)}%20Upgrade`,
		}),
	},
	{
		handles: s => s.earlyAccess,
		label: t('earlyAccess'),
		actionable: true,
		getProps: s => ({
			href: `mailto:sales@nextthought.com?subject=${encodeURIComponent(
				getNameFor(s)
			)}%20Early%20Access`,
		}),
	},
	{
		handles: () => true,
		label: '',
	},
];

IntegrationListItem.propTypes = {
	service: PropTypes.shape({
		isEnabled: PropTypes.func,
		isConnected: PropTypes.func,
		canConnect: PropTypes.func,
		canDisconnect: PropTypes.func,
	}),
	onClick: PropTypes.func,
};
export default function IntegrationListItem({ service, onClick }) {
	const logo = getLogoFor(service);
	const name = getNameFor(service);

	const connected = service.isConnected();
	const { actionable, clickable, label, getProps } = Actions.find(a =>
		a.handles(service)
	);
	const extraProps = getProps?.(service) ?? {};

	return (
		<Button
			plain
			className={cx(styles.integration, {
				[styles.connected]: connected,
				[styles.actionable]: actionable,
			})}
			onClick={clickable ? onClick : null}
			{...extraProps}
		>
			<div className={styles.logo}>
				<Image src={logo} alt={`${name} logo`} />
			</div>
			<Text.Base className={styles.name}>{name}</Text.Base>
			<div className={styles.status}>
				<Text.Base>{label}</Text.Base>
				{connected && <span className={styles.connectedIndicator} />}
			</div>
		</Button>
	);
}

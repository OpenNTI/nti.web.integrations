import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Text, HOC, Button } from '@nti/web-commons';

import { Organization } from '../components';

import Styles from './Disconnect.css';

const { Variant } = HOC;

const t = scoped('integrations.services.credly.window.Disconnect', {
	connectedTo: 'Connected To:',
	orgId: 'Organization Id: ',
	authToken: 'Authorization Token: ',
	disconnect: 'Disconnect',
});

const Label = Variant(Text, { className: Styles.label });
const Value = Variant(Text, { className: Styles.value });
const LabelValue = Variant('div', { className: Styles.labelValue });

CredlyAcclaimDisconnectForm.propTypes = {
	service: PropTypes.shape({
		organization: PropTypes.object,
		authorizationToken: PropTypes.string,
		disconnect: PropTypes.func,
		canDisconnect: PropTypes.func,
	}),
};
export default function CredlyAcclaimDisconnectForm({ service }) {
	const disconnect = React.useCallback(() => service.disconnect(), [service]);

	return (
		<div className={Styles.disconnect}>
			<Label className={Styles.connectedTo}>{t('connectedTo')}</Label>
			<Organization
				className={Styles.orgCard}
				organization={service.organization}
			/>
			<LabelValue>
				<Label>{t('orgId')}</Label>
				<Value>{service.organization.organizationId}</Value>
			</LabelValue>
			<LabelValue>
				<Label>{t('authToken')}</Label>
				<Value>{service.authorizationToken}</Value>
			</LabelValue>
			{service.canDisconnect() && (
				<Button
					className={Styles.disconnectButton}
					onClick={disconnect}
					destructive
					rounded
				>
					{t('disconnect')}
				</Button>
			)}
		</div>
	);
}

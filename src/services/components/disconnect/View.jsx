import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Loading, Text, Errors, Button} from '@nti/web-commons';

import Styles from './View.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.services.components.disconnect', {
	account: 'Account: ',
	disconnect: 'Disconnect'
});

DisconnectService.propTypes = {
	service: PropTypes.shape({
		disconnect: PropTypes.func.isRequired,
		canDisconnect: PropTypes.func.isRequired,
		getAccountName: PropTypes.func
	}),
	title: PropTypes.string,
	accountLabel: PropTypes.string,
	link: PropTypes.string
};
export default function DisconnectService ({service, title, accountLabel, link}) {
	const [disconnecting, setDisconnecting] = React.useState(false);
	const [error, setError] = React.useState(null);

	const accountName = service?.getAccountName?.();

	const disconnect = async () => {
		setDisconnecting(true);

		try {
			await service.disconnect();
		} catch (e) {
			setError(e);
		} finally {
			setDisconnecting(false);
		}
	};

	return (
		<div className={cx('disconnect-service-view')}>
			<Loading.Placeholder loading={disconnecting} delay={0} fallback={<Loading.Spinner.Large />}>
				{title && (<Text.Base className={cx('title')}>{title}</Text.Base>)}
				{accountName && (
					<div className={cx('account-name')}>
						<Text.Base className={cx('label')}>
							{accountLabel || t('account')}
						</Text.Base>
						<Text.Base className={cx('account')}>
							{accountName}
						</Text.Base>
					</div>
				)}
				{service.canDisconnect() && (
					<Button onClick={disconnect} className={cx('disconnect')} rounded>
						{link || t('disconnect')}
					</Button>
				)}
				<Errors.Message error={error} />
			</Loading.Placeholder>
		</div>
	);
}
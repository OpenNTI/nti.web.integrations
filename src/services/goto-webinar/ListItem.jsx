// import React from 'react';
// import PropTypes from 'prop-types';
// import cx from 'classnames';
// import {scoped} from '@nti/lib-locale';
// import {Prompt, Flyout} from '@nti/web-commons';

// import Registry from '../ListItemRegistry';

// import {HANDLES} from './Constants';
// import ConnectLink from './ConnectLink';

// const t = scoped('integrations.services.goto-webinar.ListItem', {
// 	title: 'GoToWebinar',
// 	description: {
// 		notConnected: 'Connect an account to get started.',
// 		connected: 'Your account is connected!'
// 	},
// 	connect: 'Connect',
// 	connectError: 'Unable to connect. Try again.',
// 	disconnect: 'Disconnect',
// 	disconnectError: 'Unable to disconnect.',
// 	disconnectMessage: 'Disconnecting your GoToWebinar account will permanently remove webinars from all of your courses.'
// });

// function handles (service) {
// 	return HANDLES[service.MimeType];
// }

// export default
// @Registry.register(handles)
// class GotoWebinarListItem extends React.Component {
// 	static propTypes = {
// 		integration: PropTypes.shape({
// 			accountName: PropTypes.string,
// 			getLink: PropTypes.func.isRequired,
// 			isConnected: PropTypes.func.isRequired,
// 			disconnect: PropTypes.func.isRequired
// 		}).isRequired
// 	}

// 	state = {}

// 	onConnectError = () => {
// 		this.setState({
// 			connectError: true
// 		});
// 	}

// 	onDisconnect = async () => {
// 		try {
// 			await Prompt.areYouSure(t('disconnectMessage'));
// 		} catch (e) {
// 			return;
// 		}

// 		try {
// 			const {integration} = this.props;

// 			await integration.disconnect();
// 		} catch (e) {
// 			Prompt.alert((e && e.message) || t('disconnectError'));
// 		}
// 	}

// 	render () {
// 		const {integration} = this.props;

// 		return (
// 			<div className="nti-integrations-goto-webinar-list-item">
// 				<div className="meta">
// 					<div className="title">
// 						{t('title')}
// 					</div>
// 					<div className="description">
// 						{integration.isConnected() ? t('description.connected') : t('description.notConnected')}
// 					</div>
// 				</div>
// 				{integration.isConnected() && this.renderDisconnect()}
// 				{!integration.isConnected() && this.renderConnect()}
// 			</div>
// 		);
// 	}

// 	renderConnect () {
// 		const {integration} = this.props;
// 		const {connectError} = this.state;

// 		return (
// 			<ConnectLink integration={integration} className={cx('connect', {error: connectError})} onError={this.onConnectError}>
// 				{connectError ? t('connectError') : t('connect')}
// 			</ConnectLink>
// 		);
// 	}

// 	renderDisconnect () {
// 		const {integration} = this.props;

// 		const trigger = (
// 			<div className="account-name">
// 				<span>{integration.accountName}</span>
// 				<i className="icon-chevron-down" />
// 			</div>
// 		);

// 		return (
// 			<Flyout.Triggered
// 				trigger={trigger}
// 				arrow
// 				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
// 				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
// 			>
// 				<div className="nti-integratins-goto-webinar-list-item-flyout">
// 					<a className="disconnect" onClick={this.onDisconnect}>
// 						{t('disconnect')}
// 					</a>
// 				</div>
// 			</Flyout.Triggered>
// 		);
// 	}
// }

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Prompt, Flyout} from '@nti/web-commons';

import Registry from '../ListItemRegistry';

const t = scoped('integrations.services.goto-webinar.ListItem', {
	title: 'GoToWebinar',
	description: 'Offer webinars in your course and generate reports.',
	connect: 'Connect',
	connectError: 'Unable to connect. Try again.',
	disconnect: 'Disconnect',
	disconnectMessage: 'Disconnecting your GoToWebinar account will permanently remove webinars from all of your courses.'
});

const MESSAGE_KEY = 'goto-webinar-authorization';

function buildRedirectURL (success) {
	if (!global.location) { return ''; }

	return `${global.location.origin}/app/post-query-params/${MESSAGE_KEY}?success=${success ? 1 : 0}`;
}

const HANDLES = {
	'application/vnd.nextthought.integration.gotowebinarauthorizedintegration': true,
	'application/vnd.nextthought.integration.gotowebinarintegration': true
};

function handles (service) {
	return HANDLES[service.MimeType];
}

@Registry.register(handles)
export default class GotoWebinarListItem extends React.Component {
	static propTypes = {
		integration: PropTypes.shape({
			getLink: PropTypes.func.isRequired,
			isConnected: PropTypes.func.isRequired,
			disconnect: PropTypes.func.isRequired
		}).isRequired
	}


	state = {}


	componentDidMount () {
		if (global.addEventListener) {
			global.addEventListener('message', this.onMessage);

			this.unsubscribeFromWindow = () => {
				global.removeEventListener('message', this.onMessage);
				delete this.unsubscribeFromWindow;
			};
		}

	}


	componentWillUnmount () {
		if (this.unsubscribeFromWindow) {
			this.unsubscribeFromWindow();
		}
	}


	onMessage = (e) => {
		const {data:eventData} = e;
		const {data} = eventData || {};

		if (!data || data.key !== MESSAGE_KEY) { return; }

		const {params} = data;

		if (params.success === '1') {
			const {integration} = this.props;

			integration.sync();
		} else if (params.success === '0') {
			this.setState({
				connectError: true
			});
		}
	}


	onConnect = () => {
		const {integration} = this.props;
		const link = integration.getLink('authorize.webinar', {success: buildRedirectURL(true), failure: buildRedirectURL(false)});

		if (link && typeof window !== undefined) {
			window.open(link, 'authorization-window', 'menubar=no,titlebar=no,toolbar=no,width=800,height=600');
		}
	}

	onDisconnect = async () => {
		try {
			await Prompt.areYouSure(t('disconnectMessage'));

			const {integration} = this.props;

			integration.disconnect();
		} catch (e) {
			//No need to handle this
		}
	}

	render () {
		const {integration} = this.props;

		return (
			<div className="nti-integrations-goto-webinar-list-item">
				<div className="meta">
					<div className="title">
						{t('title')}
					</div>
					<div className="description">
						{t('description')}
					</div>
				</div>
				{integration.isConnected() && this.renderDisconnect()}
				{!integration.isConnected() && this.renderConnect()}
			</div>
		);
	}


	renderConnect () {
		const {connectError} = this.state;

		return (
			<a className={cx('connect', {error: connectError})} onClick={this.onConnect}>
				{connectError ? t('connectError') : t('connect')}
			</a>
		);
	}


	renderDisconnect () {
		const {integration} = this.props;

		const trigger = (
			<div className="account-name">
				<span>{integration.accountName}</span>
				<i className="icon-chevron-down" />
			</div>
		);

		return (
			<Flyout.Triggered
				trigger={trigger}
				arrow
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
			>
				<div className="nti-integratins-goto-webinar-list-item-flyout">
					<a className="disconnect" onClick={this.onDisconnect}>
						{t('disconnect')}
					</a>
				</div>
			</Flyout.Triggered>
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt} from '@nti/web-commons';

import Registry from '../ListItemRegistry';

const t = scoped('integrations.services.goto-webinar.ListItem', {
	title: 'GoToWebinar',
	description: 'Offer webinars in your course and generate reports.',
	connect: 'Connect',
	disconnect: 'Disconnect',
	disconnectMessage: 'Disconnecting your GoToWebinar account will permanently remove webinars from all of your courses.'
});

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


	onConnect = () => {
		const {integration} = this.props;
		const link = integration.getLink('authorize.webinar', {success: 'http://www.google.com', failure: 'http://www.google.com'});

		if (link && typeof window !== undefined) {
			window.open(link, 'authorization-window', 'menubar=no');
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
		return (
			<a className="connect" onClick={this.onConnect}>
				{t('connect')}
			</a>
		);
	}


	renderDisconnect () {
		return (
			<a className="disconnect" onClick={this.onDisconnect}>
				{t('disconnect')}
			</a>
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Registry from '../ListItemRegistry';

const t = scoped('integrations.services.goto-webinar.ListItem', {
	title: 'GoToWebinar',
	description: 'Offer webinars in your course and generate reports.',
	connect: 'Connect'
});


function handles (service) {
	return service.MimeType === 'application/vnd.nextthought.integration.gotowebinarintegration';
}

@Registry.register(handles)
export default class GotoWebinarListItem extends React.Component {
	static propTypes = {
		integration: PropTypes.shape({
			getLink: PropTypes.func.isRequired
		}).isRequired
	}


	onConnect = () => {
		const {integration} = this.props;
		const link = integration.getLink('authorize.webinar', {success: 'www.google.com'});

		if (link && typeof window !== undefined) {
			window.open(link, 'authorization-window', 'menubar=no');
		}
	}

	render () {
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
				<a className="connect" onClick={this.onConnect}>
					{t('connect')}
				</a>
			</div>
		);
	}
}

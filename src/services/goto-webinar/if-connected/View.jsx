import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import ConnectLink from '../ConnectLink';

import Store from './Store';

const t = scoped('integrations.services.goto-webinar.if-connected.View', {
	title: 'A GoToWebinar account is not connected yet.',
	description: {
		canNotConnect: 'Please contact your site administrator for assistance. Administrators can connect integrations on the Advanced tab of the Site Administration view.',
		canConnect: 'Connecting a GoToWebinar account will allow authors to add webinars to any course. Managing integrations can be found in the Site Administration view.'
	},
	error: 'GoToWebinar is not configured for this site, please contact support.',
	connect: 'Connect',
	connectError: 'Unable to connect. Try again.'
});

const propMap = {
	loading: 'loading',
	integration: 'integration',
	connected: 'connected',
	canConnect: 'canConnect',
	error: 'error'
};

@Store.connect(propMap)
export default class GotoWebinarIsConnected extends React.Component {
	static propTypes = {
		context: PropTypes.object,
		className: PropTypes.string,
		children: PropTypes.any,

		store: PropTypes.shape({
			load: PropTypes.func
		}),
		loading: PropTypes.bool,
		integration: PropTypes.object,
		connected: PropTypes.bool,
		canConnect: PropTypes.bool,
		error: PropTypes.object
	}


	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		const {context, store} = this.props;

		store.unload(context);
	}


	componentDidUpdate (prevProps) {
		const {context} = this.props;
		const {context:prevContext} = prevProps;

		if (context !== prevContext) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {context, store} = props;

		store.load(context);
	}


	onConnectError = () => {
		this.setState({
			connectError: true
		});
	}


	render () {
		const {loading, error, connected, className} = this.props;

		return (
			<div className={cx('nti-integrations-goto-webinar-if-connected', className, {connected})}>
				{loading && (<Loading.Mask />)}
				{!loading && error && this.renderError()}
				{!loading && !error && this.renderContent()}
			</div>
		);
	}


	renderError () {
		return (
			<div className="error">
				{t('error')}
			</div>
		);
	}


	renderContent () {
		const {connected, canConnect, integration, children} = this.props;
		const {connectError} = this.state;

		if (!integration) { return null; }

		if (connected) { return children; }

		return (
			<div className="content">
				<div className="title">{t('title')}</div>
				<div className="description">
					{canConnect ? t('description.canConnect') : t('description.canNotConnect')}
				</div>
				{canConnect && (
					<div className="connect-container">
						<ConnectLink
							integration={integration}
							className={cx('connect-link', {error: connectError})}
							onError={this.onConnectError}
						>
							{connectError ? t('connectError') : t('connect')}
						</ConnectLink>
					</div>
				)}
			</div>
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';

const MESSAGE_KEY = 'goto-webinar-authorization';

function buildRedirectURL(success) {
	if (!global.location) {
		return '';
	}

	return `${
		global.location.origin
	}/app/post-query-params/${MESSAGE_KEY}?success=${success ? 1 : 0}`;
}

export default class GotoWebinarConnectLink extends React.Component {
	static propTypes = {
		integration: PropTypes.shape({
			getLink: PropTypes.func.isRequired,
			sync: PropTypes.func.isRequired,
		}).isRequired,
		onConnect: PropTypes.func,
		onError: PropTypes.func,
	};

	componentDidMount() {
		if (global.addEventListener) {
			global.addEventListener('message', this.onMessage);

			this.unsubscribeFromWindow = () => {
				global.removeEventListener('message', this.onMessage);
				delete this.unsubscribeFromWindow;
			};
		}
	}

	componentWillUnmount() {
		if (this.unsubscribeFromWindow) {
			this.unsubscribeFromWindow();
		}
	}

	onMessage = e => {
		const { data: eventData } = e;
		const { data } = eventData || {};

		if (!data || data.key !== MESSAGE_KEY) {
			return;
		}

		const { onConnect, onError } = this.props;
		const { params } = data;

		if (params.success === '1') {
			const { integration } = this.props;

			integration.sync();

			if (onConnect) {
				onConnect();
			}
		} else if (params.success === '0') {
			if (onError) {
				onError();
			}
		}
	};

	onConnect = () => {
		const { integration } = this.props;
		const link = integration.getLink('authorize.webinar', {
			success: buildRedirectURL(true),
			failure: buildRedirectURL(false),
		});

		if (link && typeof window !== undefined) {
			window.open(
				link,
				'authorization-window',
				'menubar=no,titlebar=no,toolbar=no,width=800,height=600'
			);
		}
	};

	render() {
		const props = { ...this.props };

		delete props.integration;
		delete props.onConnect;
		delete props.onError;

		return <a {...props} onClick={this.onConnect} />;
	}
}

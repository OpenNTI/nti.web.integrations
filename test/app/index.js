import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {GotoWebinar, List} from '../../src';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};


class Test extends React.Component {
	static childContextTypes = {
		router: PropTypes.object
	}


	getChildContext () {
		return {
			router: {
				baseroute: '/',
				route: {},
				getRouteFor: (webinar) => {
					return () => {
						alert(`Navigated to ${webinar.subject}`);
					};
				},
				history: {
					push: () => {},
					replace: () => {},
					createHref: () => {}
				}
			}
		};
	}


	render () {
		return (
			<div>
				<GotoWebinar.IfConnected>
					<div>Connected!</div>
				</GotoWebinar.IfConnected>
				<List />
			</div>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);

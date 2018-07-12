import React from 'react';
import ReactDOM from 'react-dom';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

import {GotoWebinar} from '../../src';

ReactDOM.render(
	<GotoWebinar.UpcomingWebinars />,
	document.getElementById('content')
);

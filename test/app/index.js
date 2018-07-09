import React from 'react';
import ReactDOM from 'react-dom';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

import {List} from '../../src';

ReactDOM.render(
	<List />,
	document.getElementById('content')
);

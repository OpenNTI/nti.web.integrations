import React from 'react';
import PropTypes from 'prop-types';
import {Prompts} from '@nti/web-commons';

export default class Registration extends React.Component {

	static propTypes = {
		item: PropTypes.object
	}

	render () {
		return (
			<Prompts.Dialog>
				<div />
			</Prompts.Dialog>
		);
	}
}

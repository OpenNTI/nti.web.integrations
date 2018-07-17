import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from '@nti/web-commons';

export default class Registration extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = { loading: true }



	render () {
		const {props: {onBeforeDismiss}, state: {loading}} = this;
		return (
			<Prompt.Dialog onBeforeDismiss={onBeforeDismiss}>
				<div>{loading}</div>
			</Prompt.Dialog>
		);
	}
}

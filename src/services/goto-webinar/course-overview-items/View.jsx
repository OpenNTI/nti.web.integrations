import React from 'react';
import PropTypes from 'prop-types';
import { Overview } from '@nti/web-course';

const { List } = Overview.Constants;

export default
@Overview.Registry.register('application/vnd.nextthought.webinar')
class OverviewItemView extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		layout: PropTypes.any
	}

	render () {
		const { layout } = this.props;

		const minimal = layout === List;

		return (
			<div>
				Webinar {minimal}
			</div>
		);
	}
}

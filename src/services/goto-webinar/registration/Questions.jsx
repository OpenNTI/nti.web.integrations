import React from 'react';
import PropTypes from 'prop-types';

import Question from './Question';

export default class Questions extends React.PureComponent {

	static propTypes = {
		items: PropTypes.array,
		onChange: PropTypes.func,
		values: PropTypes.object
	}

	render () {
		const {items, onChange, values} = this.props;
		return items.length === 0 ? null : (
			<div className="webinar-registration-questions">
				<h2>Survey</h2>
				<div>
					{items.map(x => (
						<Question key={x.questionKey} item={x} onChange={onChange} value={values[x.questionKey]}/>
					))}
				</div>
			</div>
		);
	}
}

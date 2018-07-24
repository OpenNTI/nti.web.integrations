import React from 'react';
import PropTypes from 'prop-types';
import { Input, RadioGroup } from '@nti/web-commons';


export default class Question extends React.PureComponent {

	static propTypes = {
		item: PropTypes.object,
		onChange: PropTypes.func,
		value: PropTypes.object
	}

	onChange = (value) => {
		const {item: {questionKey}, onChange} = this.props;

		onChange(questionKey, !value ? null : {
			questionKey,
			answerKey: 0,
			responseText: value
		});
	}

	onSelect (e) {

	}

	render () {
		const {
			value,
			item: {
				answers = [],
				question,
				questionKey,
				type
			},
		} = this.props;

		const {responseText} = value || {};

		// "answers": [
		// 	{
		// 		"answer": "string",
		// 		"answerKey": 0
		// 	}
		// ]

		return (
			<div className="webinar-registration-question">
				<p>{question}</p>
				{type === 'multipleChoice' ? (
					<RadioGroup name={String(questionKey)}
						options={answers.map(x => x.answer)}
						value={responseText}
						onChange={this.onSelect}
					/>
				) : (
					<Input.TextArea onChange={this.onChange} value={responseText}/>
				)}
			</div>
		);
	}
}

import './Field.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Input, Checkbox, Select } from '@nti/web-commons';

const CLASSNAME = 'webinar-registration-field';

const t = scoped('integrations.services.goto-webinar.registration.field', {
	firstName: 'First Name',
	lastName: 'Last Name',
	email: 'Email Address',
	phone: 'Phone Number',
	address: 'Address',
	country: 'Country',
	city: 'City',
	state: 'State',
	zipCode: 'Zip',
	organization: 'Organization Name',
	jobTitle: 'Job Title',
	industry: 'Industry',
	numberOfEmployees: 'Number of Employees',
	questionsAndComments: 'Questions & Comments',
	purchasingTimeFrame: 'Purchasing Time Frame',
	purchasingRole: 'Purchasing Role',
});

const p = scoped(
	'integrations.services.goto-webinar.registration.field.placeholders',
	{
		firstName: 'John',
		lastName: 'Smith',
		email: 'name@example.com',
		phone: '(405) 555-5555',
		address: 'Address',
		country: 'Country',
		city: 'City',
		state: 'State',
		zipCode: '00000',
		organization: 'Company Name',
		jobTitle: 'Title',
		industry: 'Select an Industry',
		numberOfEmployees: 'Select a range',
		questionsAndComments: '',
		purchasingTimeFrame: 'Select a timeframe',
		purchasingRole: 'Role',
	}
);

export default class Field extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		focusOnMount: PropTypes.bool,
		onChange: PropTypes.func,
		value: PropTypes.shape({
			value: PropTypes.string,
			invalid: PropTypes.bool,
		}),
	};

	state = {};

	onBlur = () => this.setState({ focus: false });
	onFocus = () => this.setState({ focus: true });

	onChange = e => {
		const { onChange, item } = this.props;
		const value = e.target ? e.target.value : e;

		onChange(item.field, { value });
	};

	onCheck = ({ target: { value, checked } }) => {
		this.onChange(checked ? value : null);
	};

	render() {
		const {
			props: { focusOnMount: focusMe, item, value: v },
			state: { focus },
		} = this;
		const { answers, field, maxSize, required } = item;
		const { value, invalid } = v || {};

		const InputType = maxSize > 128 ? Input.TextArea : Input.Text;
		const hasAnswers = Array.isArray(answers) && answers.length > 0;
		const isCheckbox = hasAnswers && answers.length === 1;

		const maybeFocus = x => x && focusMe && x.focus && x.focus();

		const common = {
			required,
			value,
			name: field,
			onChange: this.onChange,
			onFocus: this.onFocus,
			onBlur: this.onBlur,
			placeholder: !isCheckbox && p(field),
			ref: maybeFocus,
		};

		return isCheckbox ? (
			<Checkbox
				className={cx(CLASSNAME, field, { invalid })}
				required={required}
				ref={maybeFocus}
				name={field}
				label={answers[0]}
				value={answers[0]}
				checked={answers[0] === value}
				onChange={this.onCheck}
			/>
		) : (
			<Input.Label
				className={cx(CLASSNAME, field, { focus, invalid })}
				label={t(field)}
			>
				{hasAnswers ? (
					<Select {...common}>
						<option value="">{p(field)}</option>
						{answers.map(x => (
							<option key={x} value={x}>
								{x}
							</option>
						))}
					</Select>
				) : (
					<InputType {...common} maxLength={maxSize} />
				)}
			</Input.Label>
		);
	}
}

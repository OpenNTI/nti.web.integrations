import './Fields.scss';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import Field from './Field';

const PERSONAL_FIELDS = ['firstName', 'lastName', 'email', 'phone'];
const ADDRESS_FEILDS = ['address', 'country', 'city', 'state', 'zipCode'];

export default class Fields extends React.PureComponent {

	static propTypes = {
		items: PropTypes.array,
		onChange: PropTypes.func,
		values: PropTypes.object
	}

	render () {
		const {items, ...props} = this.props;

		const others = items.filter(({field: x}) => !PERSONAL_FIELDS.includes(x) && !ADDRESS_FEILDS.includes(x));

		return (
			<Fragment>
				<FieldGroup {...props} items={items} label="Personal" fields={PERSONAL_FIELDS} />
				<FieldGroup {...props} items={items} label="Address" fields={ADDRESS_FEILDS}/>
				<FieldGroup {...props} items={others} label="Professional" />
			</Fragment>
		);
	}
}



FieldGroup.propTypes = {
	items: PropTypes.array,
	fields: PropTypes.arrayOf(PropTypes.string),
	label: PropTypes.string,
	values: PropTypes.object,
	onChange: PropTypes.func
};

function FieldGroup ({label, fields, items, onChange, values}) {
	const showAll = !Array.isArray(fields) || fields.length === 0;
	const applicable = showAll
		? items
		//This is mapping the fields list to maintain our defined order. (I know its slightly less efficient)
		: fields.map(x => items.find(f => f.field === x)).filter(Boolean);

	return applicable.length === 0 ? null : (
		<div className="webinar-registration-field-group">
			<h2>{label}</h2>
			<div>
				{applicable.map((x, i) => (
					<Field key={x.field} focusOnMount={x === 0} item={x} onChange={onChange} value={values[x.field]}/>
				))}
			</div>
		</div>
	);
}

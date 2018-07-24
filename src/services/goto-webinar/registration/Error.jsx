import React from 'react';
import PropTypes from 'prop-types';
import { rawContent } from '@nti/lib-commons';

const CODES = {
	WebinarRegistrationValidationError: {
		title: 'Missing required information',
		message: 'Please provide all required information and try again'
	},

	fallback: {
		title: 'Unfortunately, there was a problem with your registration.',
		message: 'You can try again or for further assistance <a href="mailto:support@nextthought.com">contact support</a>.'
	}
};



Error.propTypes = {
	children: PropTypes.any,
	error: PropTypes.object
};
export default function Error ({error, children}) {
	const {title, message} = CODES[(error || {}).code] || CODES.fallback;

	return (
		<div className="webinar-registration-error">
			<h3>{children || title}</h3>
			<p {...rawContent(message)}/>
		</div>
	);
}

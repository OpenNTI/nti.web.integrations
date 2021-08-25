import './Complete.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { CompletionCheckmark } from '@nti/web-commons';
import { Button } from "@nti/web-core";

Complete.propTypes = {
	onClose: PropTypes.func,
};

export default function Complete({ onClose }) {
	return (
		<div className="webinar-registration-complete">
			<div>
				<CompletionCheckmark />
				<h2>You are Registered!</h2>
				<p>
					Join your webinar early to save your seat. Some webinars
					have a max number of attendees.
				</p>
				<Button onClick={onClose}>Done</Button>
			</div>
		</div>
	);
}

import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nti/web-commons';

InProgress.propTypes = {
	loading: PropTypes.bool
};
export default function InProgress ({loading}) {
	return (
		<div className="webinar-registration-in-progress">
			<div>
				<Loading.Spinner className="spinner" size="120px" strokeWidth="1" />
				{!loading && (
					<p>We are registering you for the webinar, this should not take too long…</p>
				)}
			</div>
		</div>
	);
}

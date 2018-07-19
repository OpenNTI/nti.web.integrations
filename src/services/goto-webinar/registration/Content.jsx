import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

Content.propTypes = {
	className: PropTypes.string
};
export default function Content ({className, ...props}) {
	return (
		<div className={cx('goto-webinar-registration-content', className)} {...props}/>
	);
}

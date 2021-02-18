import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './WindowContents.css';

const cx = classnames.bind(Styles);

IntegrationWindowContents.propTypes = {
	className: PropTypes.string,
};
export default function IntegrationWindowContents({
	className,
	...otherProps
}) {
	return (
		<div
			className={cx(className, 'nti-integration-window-contents')}
			{...otherProps}
		/>
	);
}

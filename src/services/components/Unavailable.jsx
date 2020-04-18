import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Text} from '@nti/web-commons';

import Styles from './Unavailable.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.services.components.Unavailable', {
	contactSupport: 'For questions, or to enable this integration please contact <a href="mailto:support@nextthought.com?subject=%(subject)s">support@nextthought.com</a>'
});

UnavailableService.propTypes = {
	title: PropTypes.string.isRequired,
	supportSubject: PropTypes.string.isRequired
};
export default function UnavailableService ({title, supportSubject}) {
	return (
		<div className={cx('service-unavailable')}>
			<Text.Base className={cx('title')}>{title}</Text.Base>
			<Text.Base className={cx('support')}>
				{t('contactSupport', {subject: supportSubject})}
			</Text.Base>
		</div>
	);
}
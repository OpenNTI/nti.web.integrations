import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';
import { Text, Image } from '@nti/web-commons';

import Styles from './Description.css';

const cx = classnames.bind(Styles);
const t = scoped('integrations.services.components.Description', {
	description: 'description',
});

ServiceDescription.propTypes = {
	logo: PropTypes.any,
	link: PropTypes.string,
	children: PropTypes.any,
};
export default function ServiceDescription({ logo, link, children }) {
	return (
		<div className={cx('nti-service-description')}>
			{logo && (
				<div className={cx('logo')}>
					<Image src={logo} alt="" />
				</div>
			)}
			<div className={cx('wrap')}>
				<Text.Base className={cx('label')}>
					{t('description')}
				</Text.Base>
				<div className={cx('content')}>{children}</div>
			</div>
			{link && (
				<a
					className={cx('link')}
					href={link}
					rel="noopener noreferrer"
					target="_blank"
				>
					<i className="icon-shareto" />
				</a>
			)}
		</div>
	);
}

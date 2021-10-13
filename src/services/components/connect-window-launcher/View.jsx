import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Text, Errors } from '@nti/web-commons';

import Styles from './View.css';
import Link from './Link';

const cx = classnames.bind(Styles);

ConnectWindowLauncherView.propTypes = {
	title: PropTypes.string,
	link: PropTypes.string,
};
export default function ConnectWindowLauncherView({
	title,
	link,
	...otherProps
}) {
	const [error, setError] = useState(null);

	return (
		<div className={cx('connect-window-launcher-view')}>
			{title && <Text.Base className={cx('title')}>{title}</Text.Base>}
			<Link
				className={cx('launch-link')}
				{...otherProps}
				onError={e => setError(e)}
				onConnecting={() => setError(null)}
				onConnected={() => setError(null)}
			>
				<Text.Base>{link}</Text.Base>
			</Link>
			<Errors.Message error={error} />
		</div>
	);
}

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, Image } from '@nti/web-commons';

const styles = stylesheet`
	.badge {
		display: inline-block;
		position: relative;
		border-radius: 100%;
		width: 130px;
	}

	.badge:focus {
		box-shadow: 0 0 3px 1px var(--primary-blue);
	}

	.trigger {
		cursor: pointer;
	}

	.badge-image {
		display: block;
		object-fit: cover;
		width: 100%;
		height: auto;
		border-radius: 50%;
		box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
	}

	.badge-mask {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}
`;

BadgeImage.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		imageURL: PropTypes.string,
	}),
};
function BadgeImage({ badge, className }) {
	const [errored, setErrored] = React.useState(false);

	const onError = React.useCallback(() => setErrored(true), [setErrored]);

	if (errored) {
		return <Image.Error className={cx(styles.badgeImage, className)} />;
	}

	return (
		<img
			className={cx(styles.badgeImage, className)}
			src={badge.imageURL}
			onError={onError}
		/>
	);
}

Badge.Image = BadgeImage;
Badge.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		imageURL: PropTypes.string,
		name: PropTypes.string,
	}),

	extendedInfo: PropTypes.bool,
	onClick: PropTypes.func,

	mask: PropTypes.node,
};
export default function Badge({
	className,
	badge,
	onClick,
	mask,
	...otherProps
}) {
	return (
		<Button
			className={cx(styles.badge, 'nti-badge', className, {
				[styles.trigger]: Boolean(onClick),
			})}
			href="#"
			onClick={onClick}
			title={badge.name}
			plain
			{...otherProps}
		>
			<BadgeImage badge={badge} />
			{mask && <div className={styles.badgeMask}>{mask}</div>}
		</Button>
	);
}

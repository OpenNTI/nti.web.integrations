import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Button} from '@nti/web-commons';

const styles = css`
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
		imageURL: PropTypes.string
	})
};
function BadgeImage ({badge, className}) {
	return (<img src={badge.imageURL} className={cx(styles.badgeImage, className)} />);
}

Badge.Image = BadgeImage;
Badge.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		imageURL: PropTypes.string,
		name: PropTypes.string
	}),

	extendedInfo: PropTypes.bool,
	onClick: PropTypes.func,

	mask: PropTypes.node
};
export default function Badge ({className, badge, onClick, mask, ...otherProps}) {
	return (
		<Button
			className={cx(styles.badge, 'nti-badge', className, {[styles.trigger]: Boolean(onClick)})}
			onClick={onClick}
			title={badge.name}
			plain
			{...otherProps}
		>
			<BadgeImage badge={badge} />
			{mask && (
				<div className={styles.badgeMask}>
					{mask}
				</div>
			)}
		</Button>
	);
}

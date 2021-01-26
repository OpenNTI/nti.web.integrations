import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Text} from '@nti/web-commons';

import Badge from './Badge';

const styles = css`
	.container {
		padding: 0.5rem 1rem;
	}

	.details {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image {
		max-width: 130px;
		margin-right: 0.5rem;
	}

	.name {
		display: block;
		font-size: 1.5rem;
		margin-bottom: 0.625rem;
	}

	.description {
		display: block;
		font-size: 0.875rem;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 0.5rem;

		& *:not(:last-child) {
			margin-right: 0.25rem;
		}
	}
`;

BadgeDetails.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string
	}),

	hideImage: PropTypes.bool,
	actions: PropTypes.arrayOf(
		PropTypes.node
	)
};
export default function BadgeDetails ({className, badge, hideImage, actions}) {
	const hasActions = actions && actions.length > 0;

	return (
		<div className={cx(styles.container, className)}>
			<div className={styles.details}>
				{!hideImage && (
					<Badge.Image badge={badge} className={styles.image} />
				)}
				<div className={styles.info}>
					<Text.Base className={styles.name}>{badge.name}</Text.Base>
					<Text.Base className={styles.description} limitLines={3} overflow={Text.Overflow.Ellipse}>{badge.description}</Text.Base>
				</div>
			</div>
			{hasActions && (
				<div className={styles.actions}>
					{actions}
				</div>
			)}
		</div>
	);
}

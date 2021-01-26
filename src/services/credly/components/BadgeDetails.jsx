import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Text, StandardUI} from '@nti/web-commons';

import Badge from './Badge';

const {Prompt} = StandardUI;

const t = scoped('integrations.services.credly.components.BadgeDetails', {
	issuedBy: 'Issued By',
	details: 'Details',
	page: 'Page'
});

const styles = css`
	.container {
		padding: 0.5rem 1rem;
	}

	.details {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.info {
		flex: 1 1 auto;
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

	.meta {
		list-style: none;
		padding: 0;
		margin: 0 0 0.625rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.meta li {
		flex: 0 0 auto;
		width: 50%;
		min-width: 100px;
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

const MetaLabel = styled(Text.Base)`
	display: block;
	font-size: 0.625rem;
	font-weight: 700;
	text-transform: uppercase;
	color: var(--tertiary-grey);
`;

const MetaValue = styled(Text.Base)`
	display: block;
	font-size: 0.875rem;
	max-width: 200px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

BadgeDetailsDialog.propTypes = {
	className: PropTypes.string,
	onDone: PropTypes.func,
	doneLabel: PropTypes.string
};
function BadgeDetailsDialog ({className, onDone, doneLabel, ...otherProps}) {
	return (
		<Prompt.Info className={className} onDone={onDone} doneLabel={doneLabel}>
			<BadgeDetails {...otherProps} />
		</Prompt.Info>
	);
}

BadgeDetails.Dialog = BadgeDetailsDialog;
BadgeDetails.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
		organizationName: PropTypes.string,
		badgeURL: PropTypes.string
	}),

	hideImage: PropTypes.bool,
	actions: PropTypes.arrayOf(
		PropTypes.node
	)
};
export default function BadgeDetails ({className, badge, hideImage, actions}) {
	const hasActions = actions && actions.length > 0;
	const hasMeta = badge.badgeURL || badge.organizationName;

	return (
		<div className={cx(styles.container, className)}>
			<div className={styles.details}>
				{!hideImage && (
					<Badge.Image badge={badge} className={styles.image} />
				)}
				<div className={styles.info}>
					<Text.Base className={styles.name}>{badge.name}</Text.Base>
					{hasMeta && (
						<ul className={styles.meta}>
							{badge.organizationName && (
								<li>
									<MetaLabel>{t('issuedBy')}</MetaLabel>
									<MetaValue>{badge.organizationName}</MetaValue>
								</li>
							)}
							{badge.badgeURL && (
								<li>
									<MetaLabel>{t('details')}</MetaLabel>
									<MetaValue>
										<a href={badge.badgeURL} rel="noopener noreferrer">
											{t('page')}
										</a>
									</MetaValue>
								</li>
							)}
						</ul>
					)}
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

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const styles = css`
	.badge-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(var(--badge-grid-columns, 4), 1fr);
		grid-template-rows: auto;

		& > li:not(.details) {
			height: 0;
			position: relative;
			padding-bottom: 100%;
		}
	}

	.inner {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.details {
		grid-row-start: var(--badge-details-row);
		grid-row-end: var(--badge-details-row);
		grid-column: 1 / -1;
	}
`;

const getListStyles = (columns) => ({
	'--badge-grid-columns': columns
});

const getDetailStyles = (details, columns) => {
	const row = Math.floor(details.index / columns) + 2;

	return {
		'--badge-details-row': row
	};
};

BadgeGrid.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	columns: PropTypes.number,

	details: PropTypes.shape({
		index: PropTypes.number,
		node: PropTypes.node
	})
};
export default function BadgeGrid ({children, className, details, columns = 4}) {
	const badges = React.Children.toArray(children);

	return (
		<ul className={cx(styles.badgeGrid, className)} style={getListStyles(columns)}>
			{badges.map((cmp, key) => (
				<li key={key}>
					<div className={styles.inner}>
						{cmp}
					</div>
				</li>
			))}
			{details && (
				<li style={getDetailStyles(details, columns)} className={styles.details}>
					{details.node}
				</li>
			)}
		</ul>
	);
}

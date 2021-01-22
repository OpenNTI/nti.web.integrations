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

		& li {
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
`;

BadgeGrid.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string
};
export default function BadgeGrid ({children, className}) {
	const badges = React.Children.toArray(children);

	return (
		<ul className={cx(styles.badgeGrid, className)}>
			{badges.map((cmp, key) => (
				<li key={key}>
					<div className={styles.inner}>
						{cmp}
					</div>
				</li>
			))}
		</ul>
	);
}

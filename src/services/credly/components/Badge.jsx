import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Flyout, Image, Text} from '@nti/web-commons';

const styles = css`
	.badge {
		display: inline-block;
		position: relative;
		border-radius: 100%;
		width: 130px;
	}

	.trigger {
		cursor: pointer;
	}

	.badge-image {
		display: block;
		object-fit: cover;
		width: 100%;
		border-radius: 50%;
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

const InfoContainer = styled.div`
	font-size: 0.875rem;
	color: white;
	padding: 0.5rem 1rem;
`;

// const InfoLabel = styled(Text.Base)`
// 	font-weight: 600;
// `;


Badge.propTypes = {
	className: PropTypes.string,
	badge: PropTypes.shape({
		imageURL: PropTypes.string,
		name: PropTypes.string
	}),

	extendedInfo: PropTypes.bool,
	onClick: PropTypes.func,

	mask: PropTypes.node,
	message: PropTypes.node
};
export default function Badge ({className, badge, onClick, mask, message, ...otherProps}) {
	const trigger = (
		<div className={cx(styles.badge, 'nti-badge', className, {[styles.trigger]: Boolean(onClick)})} onClick={onClick} {...otherProps} >
			<Image src={badge.imageURL} className={styles.badgeImage} />
			{mask && (
				<div className={styles.badgeMask}>
					{mask}
				</div>
			)}
		</div>
	);

	let content = null;

	if (message) {
		content = message;
	} else {
		content = (
			<InfoContainer>
				<Text.Base>{badge.name}</Text.Base>
			</InfoContainer>
		);
	}


	return (
		<Flyout.Triggered trigger={trigger} dark hover >
			{content}
		</Flyout.Triggered>
	);
}

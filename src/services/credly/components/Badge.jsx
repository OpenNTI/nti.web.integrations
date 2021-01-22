import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Flyout, Image, Text} from '@nti/web-commons';

const styles = css`
	.badge {
		display: inline-block;
		border-radius: 100%;
		width: 130px;
		overflow: hidden;
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
	onClick: PropTypes.func,
	extendedInfo: PropTypes.bool,
	badge: PropTypes.shape({
		imageURL: PropTypes.string,
		name: PropTypes.string
	})
};
export default function Badge ({className, badge, onClick, ...otherProps}) {
	const trigger = (
		<div className={cx(styles.badge, 'nti-badge', className, {[styles.trigger]: Boolean(onClick)})} onClick={onClick} {...otherProps} >
			<Image src={badge.imageURL} className={styles.badgeImage} />
		</div>
	);

	return (
		<Flyout.Triggered trigger={trigger} dark hover >
			<InfoContainer>
				<Text.Base>{badge.name}</Text.Base>
			</InfoContainer>
		</Flyout.Triggered>
	);
}

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading, Errors, StandardUI } from '@nti/web-commons';
import { Button, Icons } from '@nti/web-core';

import Badge from '../Badge';
import BadgeDetails from '../BadgeDetails';

import { BadgesStore } from './Store';

const { Prompt } = StandardUI;
const t = scoped(
	'integrations.services.credly.components.badges.BadgeWrapper',
	{
		confirmRemove: {
			title: 'Are you sure?',
			body: 'Going forward Learners who complete the course will not earn this badge. Learners who have already earned the badge will keep it.',
		},
	}
);

const stop = e => (e.stopPropagation(), e.preventDefault());

const Mask = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	border-radius: 50%;
`;

const CenteredMask = styled(Mask)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const LoadingMask = styled(CenteredMask)`
	background: rgba(255, 255, 255, 0.6);
`;

const ErrorMask = styled(CenteredMask)`
	background: rgba(var(--primary-red-rgb), 0.25);
	font-size: 2rem;
	color: var(--primary-red);
	text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
`;

const ErrorMessage = styled(Errors.Message)`
	font-size: 0.875rem;
	color: white;
	padding: 0.5rem 1rem;
	background: var(--primary-red);
`;
Icons;

const styles = stylesheet`
	.controls {
		opacity: 0;
	}

	.badge:hover .controls,
	.badge:focus .controls {
		opacity: 1;
	}

	.delete:global(.nti-button) {
		position: absolute;
		top: 2px;
		right: 2px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		background: var(--primary-grey);
		color: white;
		border: 2px solid white;
		border-radius: 50%;
		box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
		padding: 0;
		font-size: 1rem;

		& > [data-button-label] {
			display: inline-flex;
		}
	}
`;

BadgeWrapper.propTypes = {
	badge: PropTypes.object,
};
export default function BadgeWrapper({ badge }) {
	const [openDetails, setOpenDetails] = useState(false);
	const doOpenDetails = useCallback(
		e => (stop(e), setOpenDetails(true)),
		[setOpenDetails]
	);
	const doCloseDetails = useCallback(
		() => setOpenDetails(false),
		[setOpenDetails]
	);

	const { removeBadge, canRemoveBadge } = BadgesStore.useValue();
	const [confirmRemove, setConfirmRemove] = useState(false);
	const openConfirmRemove = useCallback(
		e => (stop(e), setConfirmRemove(true)),
		[setConfirmRemove]
	);
	const closeConfirmRemove = useCallback(
		() => setConfirmRemove(false),
		[setConfirmRemove]
	);
	const doRemove = useCallback(
		() => (removeBadge(badge), closeConfirmRemove()),
		[removeBadge, badge]
	);

	let obj = badge;
	let mask = null;
	let message = null;

	if (badge.newBadge && badge.pending) {
		obj = badge.template;
		mask = (
			<LoadingMask>
				<Loading.Spinner />
			</LoadingMask>
		);
	} else if (badge.newBadge && badge.error) {
		obj = badge.template;
		mask = (
			<ErrorMask>
				<Icons.Alert />
			</ErrorMask>
		);

		message = <ErrorMessage error={badge.error} />;
	} else if (canRemoveBadge(badge)) {
		mask = (
			<Mask className={styles.controls}>
				<Button
					className={styles.delete}
					onClick={openConfirmRemove}
					plain
				>
					<Icons.X bold />
				</Button>
			</Mask>
		);
	}

	return (
		<>
			<Badge
				className={styles.badge}
				badge={obj}
				mask={mask}
				message={message}
				onClick={doOpenDetails}
			/>
			{confirmRemove && (
				<Prompt.Confirm
					title={t('confirmRemove.title')}
					body={t('confirmRemove.body')}
					onConfirm={doRemove}
					onCancel={closeConfirmRemove}
				/>
			)}
			{openDetails && (
				<BadgeDetails.Dialog badge={badge} onDone={doCloseDetails} />
			)}
		</>
	);
}

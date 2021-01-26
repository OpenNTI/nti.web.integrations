import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Loading, Errors, EmptyState, StandardUI, Icons} from '@nti/web-commons';

import Connect from '../../window/Connect';
import Badge from '../Badge';
import BadgeGrid from '../BadgeGrid';
import Organization from '../Organization';

import Store from './Store';
import Details from './Details';
import Controls from './Controls';

const t = scoped('integrations.services.credly.components.available-badges.View', {
	selectDialog: {
		title: 'Select a Badge',
	},
	empty: 'No Badges'
});

const Container = styled.div`
	width: 98vw;
	max-width: 786px;
	min-height: 200px;
`;

const Content = styled.div`padding: var(--side-padding, 2rem) 0`;
const DetailsWrapper = styled(StandardUI.Card)`margin: 0 2.5rem`;
const SelectedIcon = styled(Icons.Check)`
	position: absolute;
	top: 2px;
	right: 2px;
	color: white;
	background: var(--secondary-green);
	border: 2px solid white;
	border-radius: 50%;
	box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
`;

AvailableBadges.propTypes = {
	context: PropTypes.object,
	selected: PropTypes.array,
	onSelect: PropTypes.func
};
function AvailableBadges ({selected, onSelect}) {
	const {
		loading,
		error,

		integration,
		notConnected,
		reload,

		badges
	} = Store.useValue();

	const selectedSet = React.useMemo(() => (
		new Set((selected ?? []).map(s => s.getID()))
	), [selected]);

	const content = [];

	const [selectedBadge, setSelectedBadge] = React.useState(null);
	const details = React.useMemo(() => {
		if (!selectedBadge) { return null; }

		const selectedId = selectedBadge?.getID();
		const badge = (badges ?? []).find(b => b.getID() === selectedId);

		return {
			index: (badges ?? []).indexOf(badge),
			node: (
				<DetailsWrapper rounded>
					<Details
						badge={badge}
						selected={selectedSet.has(badge.getID())}
						onSelect={onSelect}
					/>
				</DetailsWrapper>
			)
		};
	}, [selectedBadge, selectedSet]);

	const clearSelectedTimeout = React.useRef(null);
	const onContentsFocus = React.useCallback(() => {
		clearTimeout(clearSelectedTimeout.current);
	}, [clearSelectedTimeout.current]);
	const onContentsBlur = React.useCallback(() => {
		clearTimeout(clearSelectedTimeout.current);
		clearSelectedTimeout.current = setTimeout(() => {
			// setSelectedBadge(null);
		}, 300);
	}, [clearSelectedTimeout.current, selectedBadge]);

	if (error) {
		content.push(<Errors.Message error={error} />);
	} else if (notConnected) {
		content.push(<Connect service={integration} afterSubmit={reload} />);
	} else if (badges?.length === 0) {
		content.push(<EmptyState header={t('empty')} />);
	} else if (badges) {
		content.push(
			<BadgeGrid details={details}>
				{badges.map((badge, key) => (
					<Badge
						key={key}
						badge={badge}
						onClick={() => setSelectedBadge(badge)}
						mask={
							selectedSet.has(badge.getID()) ? (<SelectedIcon />): null
						}
					/>
				))}
			</BadgeGrid>
		);
	}

	return (
		<Container>
			<Controls />
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />} >
				<Content onFocus={onContentsFocus} onBlur={onContentsBlur}>
					{content}
				</Content>
			</Loading.Placeholder>
		</Container>
	);
}

const Connected = Store.WrapCmp(AvailableBadges, {
	deriveBindingFromProps: ({context}) => context
});

Connected.SelectDialog = ({title = t('selectDialog.title'), doClose, ...otherProps}) => (
	<Prompt.Dialog onBeforeDismiss={doClose}>
		<Prompt.BaseWindow title={title} doClose={doClose} buttons={[]}>
			<Connected {...otherProps} />
		</Prompt.BaseWindow>
	</Prompt.Dialog>
);

Connected.SelectDialog.displayName = 'SelectBadgeDialog';
Connected.SelectDialog.propTypes = {
	title: PropTypes.string,
	doClose: PropTypes.func
};

export default Connected;

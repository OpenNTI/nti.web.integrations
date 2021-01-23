import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Loading, Errors, EmptyState, HOC} from '@nti/web-commons';

import Connect from '../../window/Connect';
import Badge from '../Badge';
import BadgeGrid from '../BadgeGrid';
import Organization from '../Organization';

import Store from './Store';


const t = scoped('integrations.services.credly.components.available-badges.View', {
	selectDialog: {
		title: 'Select a Badge',
	},
	empty: 'No Badges'
});

const styles = css`
	.container {
		width: 98vw;
		max-width: 700px;
		min-height: 200px;
	}
`;

const Container = styled.div`
	width: 98vw;
	max-width: 786px;
	min-height: 200px;
`;

const Content = styled.div`padding: var(--side-padding, 2rem) 0`;

AvailableBadges.propTypes = {
	context: PropTypes.object,
	selected: PropTypes.array,
	onSelect: PropTypes.func
};
function AvailableBadges ({onSelect}) {
	const {
		loading,
		error,

		integration,
		notConnected,
		reload,

		badges
	} = Store.useValue();

	const {organization} = integration ?? {};
	const content = [];

	if (error) {
		content.push(<Errors.Message error={error} />);
	} else if (notConnected) {
		content.push(<Connect service={integration} afterSubmit={reload} />);
	} else if (badges?.length === 0) {
		content.push(<EmptyState header={t('empty')} />);
	} else if (badges) {
		content.push(
			<BadgeGrid>
				{badges.map((badge, key) => (
					<Badge badge={badge} key={key} onClick={() => onSelect(badge)} />
				))}
			</BadgeGrid>
		);
	}

	return (
		<Container>
			{organization && (<Organization organization={organization} />)}
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />} >
				<Content>
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

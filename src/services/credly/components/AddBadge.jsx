import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Hooks, Text, Button, Prompt} from '@nti/web-commons';

import {findCredlyIntegration} from '../utils';

const styles = css`
	.button:global(.nti-button) {
		background: none;
		color: var(--primary-blue);
		padding-left: 0;
		padding-right: 0;
	}
`;

const t = scoped('integrations.services.credly.components.AddBadge', {
	prompt: {
		trigger: '+Add Badge',
		title: 'Select a Badge'
	}

});

const {useResolver} = Hooks;
const {isResolved, isErrored, isPending} = useResolver;


function AddBadgeTrigger (props) {
	const [open, setOpen] = React.useState(false);

	const openPrompt = React.useCallback(() => setOpen(true), [setOpen]);
	const closePrompt = React.useCallback(() => setOpen(false), [setOpen]);

	return (
		<>
			<Button className={styles.button} onClick={openPrompt}>{t('prompt.trigger')}</Button>
			{open && (
				<Prompt.Dialog onBeforeDismiss={closePrompt}>
					<Prompt.BaseWindow title={t('prompt.title')} buttons={[]} doClose={closePrompt}>
						<AddBadge {...props} />
					</Prompt.BaseWindow>
				</Prompt.Dialog>
			)}
		</>
	);
}

function AddBadge ({context}) {
	const integrationResolver = useResolver(() => findCredlyIntegration(context), [context]);
	const badgesResolver = useResolver(() => context.getBadges(), [context]);

	const loading = isPending(integrationResolver) || isPending(badgesResolver);
	const error = (isErrored(integrationResolver) ? integrationResolver : null) || (isErrored(badgesResolver) ? badgesResolver : null);

	const integration = isResolved(integrationResolver) ? integrationResolver : null;
	const badges = isResolved(badgesResolver) ? badgesResolver : null;
	return (
		<div>
			Add a badge
		</div>
	);
}

AddBadge.Trigger = AddBadgeTrigger;

AddBadge.PropTypes = {
	context: PropTypes.shape({
		getBadges: PropTypes.func
	}),
	integration: PropTypes.object
};

export default AddBadge;

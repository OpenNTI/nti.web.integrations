import ListItemRegistry from './ListItemRegistry.js';

export * as GotoWebinar from './goto-webinar';

const listItemRegister = ListItemRegistry.getInstance();

export function getListItemFor (integration) {
	return listItemRegister.getItemFor(integration);
}

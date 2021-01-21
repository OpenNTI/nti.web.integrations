import {Stores} from '@nti/lib-store';

import {getCredlyIntegration} from '../utils';

export default class BadgeStore extends Stores.BoundStore {

	async load () {
		if (this.context === this.binding) { return; }

		const context = this.context = this.binding;

		this.set({
			loading: true,
			error: null
		});

		try {
			const integration = await getCredlyIntegration(context);
			const badges = await context.getBadges();

			this.set({
				loading: false,
				integration,
				badges
			});
 		} catch (e) {
			 this.set({
				 loading: false,
				 error: e
			 });
		 }
	}
}

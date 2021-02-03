import {Stores} from '@nti/lib-store';


const getBadges = p => p?.badges ?? p?.Items ?? [];
const getCurrentPage = p => p?.currentPage;
const getTotalPages = p => p?.totalPages;
export class BadgesStore extends Stores.BoundStore {
	async load () {
		if (
			this.binding.pageSize === -1 || //if the page size hasn't been setup yet
			(
				this.binding.context === this.context &&
				this.binding.pageSize === this.pageSize
			)
		) { return; }

		const context = this.context = this.binding.context;
		this.pageSize = this.binding.pageSize;

		this.set({
			loading: true,
			error: null,
			page: null
		});

		try {
			const params = {};

			// For now this is forced to be 50 by credly...
			// if (pageSize != null) {
			// 	params.pageSize = pageSize;
			// }

			const page = await context.fetchLinkParsed(this.rel, params);

			this.set({
				loading: false
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	#setPage (page) {
		this.set({
			page,
			badges: getBadges(page),
			currentPage: getCurrentPage(page) ?? 1,
			totalPages: getTotalPages(page) ?? 1
		});
		this.emitChange(['badges', 'currentPage', 'totalPages']);
	}

	async loadPage (pageNumber) {
		this.set({
			loading: true,
			currentPage: pageNumber
		});

		try {
			const params = {page: pageNumber};
			const page = await this.context.fetchLinkParsed(this.rel, params);

			this.set({
				loading: false
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	get readOnly () {
		return this.binding.readOnly;
	}

	get canAddBadges () {
		return !this.readOnly && this.context?.hasLink('Integrations');
	}


	async addBadge (badge) {
		const payload = {
			...badge.toJSON(),
			MimeType: badge.MimeType,
			Class: badge.Class
		};
		const resp = await this.context.postToLink('badges', payload, true);

		this.set({
			badges: [...this.get('badges'), resp]
		});
	}

	canRemoveBadge (badge) {
		return !this.readOnly && badge.hasLink('delete');
	}

	async removeBadge (badge) {
		const removeId = badge.getID();
		const existing = this.get('badges');

		this.setImmediate({
			badges: existing.filter(b => b.getID() !== removeId)
		});

		try {
			await badge.delete('delete');
		} catch (e) {
			this.set({badges: existing, error: e});
		}
	}
}

export class AwardedBadgesStore extends BadgesStore {
	static hasBadges (c) { return c.hasLink('awarded_badges'); }

	rel = 'awarded_badges'
}

export class AwardsBadgesStore extends BadgesStore {
	static hasBadges (c) { return c.hasLink('awarded_badges'); }

	rel = 'badges'
}

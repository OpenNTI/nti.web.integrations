import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import Item from './Item';

const t = scoped('integrations.services.goto-webinar.upcoming-webinars.View', {
	error: 'Unable to load upcoming webinars.',
	empty: {
		filtered: 'No upcoming webinars match your filters.',
		notFiltered: 'There are no upcoming webinars.'
	}
});

export default
@Store.connect({loading: 'loading', items: 'items', error: 'error'})
class GotoWebinarUpcomingWebinars extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		context: PropTypes.shape({
			getLink: PropTypes.func.isRequired
		}),
		filter: PropTypes.func,

		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.object,

		store: PropTypes.shape({
			load: PropTypes.func.isRequired
		}).isRequired
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {context, filter} = this.props;
		const {context:prevContext, filter:prevFilter} = prevProps;

		if (prevContext !== context || prevFilter !== filter) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {context, filter, store} = props;

		store.load(context, filter);
	}


	render () {
		const {className, loading, error} = this.props;

		return (
			<div className={cx('nti-integrations-goto-webinar-upcoming-webinars', className)}>
				{loading && (<Loading.Mask />)}
				{!loading && error && this.renderError()}
				{!loading && !error && this.renderItems()}
			</div>
		);
	}

	renderError () {
		return (
			<div className="error">
				{t('error')}
			</div>
		);
	}

	renderEmpty () {
		const {filter} = this.props;

		return (
			<EmptyState header={filter ? t('empty.filtered') : t('empty.notFiltered')} />
		);
	}

	renderItems () {
		const {items} = this.props;

		if (!items) { return null; }

		if (!items.length) { return this.renderEmpty(); }

		return (
			<ul>
				{items.map((item, key) => {
					return (
						<li key={key}>
							<Item item={item} />
						</li>
					);
				})}
			</ul>
		);
	}
}

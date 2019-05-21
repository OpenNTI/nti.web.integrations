import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState} from '@nti/web-commons';

import {getListItemFor} from '../services';

import Store from './Store';

const t = scoped('integrations.list.View', {
	title: 'Connect with Other Services',
	description: 'We offer powerful integrations with popular services so you can do more with your audience',
	label: 'List of Services',
	error: 'Unable to load integrations',
	empty: 'No integrations have been set up.'
});

export default
@Store.connect({loading: 'loading', items: 'items', error: 'error'})
class IntegrationsList extends React.Component {
	static propTypes = {
		context: PropTypes.object,

		loading: PropTypes.bool,
		items: PropTypes.array,
		error: PropTypes.object,

		store: PropTypes.object
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {context} = this.props;
		const {context:prevContext} = prevProps;

		if (context !== prevContext) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {context, store} = props;

		store.load(context);
	}


	render () {
		const {loading, items, error} = this.props;

		return (
			<div className="nti-integration-list">
				{loading && (<Loading.Mask />)}
				{!loading && error && this.renderError()}
				{!loading && !error && this.renderItems(items)}
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


	renderItems (items) {
		if (!items) { return null; }

		return (
			<div className="content">
				<div className="title">
					{t('title')}
				</div>
				<div className="description">
					{t('description')}
				</div>
				<div className="label">
					{t('label')}
				</div>
				{!items.length && (
					<EmptyState header={t('empty')} />
				)}
				{items.length && (
					<ul>
						{
							items
								.map((item, key) => {
									const Cmp = getListItemFor(item);

									if (!Cmp) { return null; }

									return (
										<li key={key}>
											<Cmp integration={item} />
										</li>
									);
								})
						}
					</ul>
				)}
			</div>
		);
	}
}

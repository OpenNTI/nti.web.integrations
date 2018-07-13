import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

const t = scoped('integrations.services.goto-webinar.upcoming-webinars.Item', {
	duration: '%(duration)s Long'
});

export default class IntegrationsServicesGotoWebinarUpcomingWebinarsItem extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			subject: PropTypes.string.isRequired,
			getNearestSession: PropTypes.func.isRequired
		}).isRequired
	}

	render () {
		const {item} = this.props;
		const session = item.getNearestSession();

		const extra = [
			this.renderDate(session),
			this.renderDuration(session)
		];

		return (
			<LinkTo.Object object={item} className="nti-integrations-services-goto-webinar-upcoming-webinar-item">
				{this.renderCalendar(session)}
				<div className="meta">
					<div className="title">
						{item.subject}
					</div>
					<ul className="extras">
						{
							extra
								.filter(x => !!x)
								.map((cmp, key) => {
									return (
										<li key={key}>
											<div className="content">
												{cmp}
											</div>
										</li>
									);
								})
						}
					</ul>
				</div>
			</LinkTo.Object>
		);
	}


	renderCalendar (session) {
		const startDate = session && session.getStartTime();

		if (!startDate) { return null; }

		return (
			<div className="calendar">
				<div className="month">
					{DateTime.format(startDate, 'MMM')}
				</div>
				<div className="day">
					{DateTime.format(startDate, 'D')}
				</div>
			</div>
		);
	}


	renderDate (session) {
		const startDate = session && session.getStartTime();

		if (!startDate) { return null; }

		return (
			<DateTime date={startDate} format={'dddd [at] h:mm A z'} />
		);
	}


	renderDuration (session) {
		const startDate = session && session.getStartTime();
		const endDate  = session && session.getEndTime();

		if (!startDate || !endDate) { return null; }

		const duration = endDate - startDate;

		return (
			<div className="duration">
				{t('duration', {duration: DateTime.getNaturalDuration(duration, 1)})}
			</div>
		);
	}
}

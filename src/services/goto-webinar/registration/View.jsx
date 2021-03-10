import './View.scss';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Prompt } from '@nti/web-commons';
import { getAppUser } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';

import Content from './Content';
import Error from './Error';
import Fields from './Fields';
import Questions from './Questions';
import InProgress from './InProgress';
import Complete from './Complete';

const t = scoped('web.integrations.services.gotowebinar.registration.View', {
	title: 'Webinar Registration',
	save: 'Register',
	cancel: 'Cancel',
});

const completeLocalizer = scoped(
	'web.integrations.services.gotowebinar.registration.View.completed',
	{
		title: 'Registration Complete',
		save: 'Done',
		cancel: 'Cancel',
	}
);

const stop = e => (e.preventDefault(), e.stopPropagation());

const ERROR_FIELD_MAPPINGS = {
	surname: 'lastName',
	givenName: 'firstName',
};

const USER_FIELD_MAPPINGS = {
	email: 'email',
	firstName: 'NonI18NFirstName',
	lastName: 'NonI18NLastName',
};

export default class Registration extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onBeforeDismiss: PropTypes.func.isRequired,
		onDismiss: PropTypes.func,
		nonDialog: PropTypes.bool,
	};

	state = {};

	makeInitialValuesFromUser(user) {
		if (!user) {
			return null;
		}

		let values = {};

		for (let key of Object.keys(USER_FIELD_MAPPINGS)) {
			if (user[USER_FIELD_MAPPINGS[key]]) {
				values[key] = { value: user[USER_FIELD_MAPPINGS[key]] };
			}
		}

		return values;
	}

	async componentDidMount() {
		const { item: { webinar } = {} } = this.props;
		// window.reg = this;

		if (!webinar) {
			return;
		}
		try {
			const currentUser = await getAppUser();

			this.setState({
				data: await webinar.fetchLink('WebinarRegistrationFields'),
				fieldValues: this.makeInitialValuesFromUser(currentUser),
			});
		} catch (e) {
			this.setState({ error: e });
		}
	}

	onClose = e => {
		stop(e);

		this.onCancel();
	};

	onFieldChange = (name, value) => {
		if (value && !value.value) {
			value = false;
		}

		this.setState(state => ({
			...state,
			fieldValues: {
				...(state.fieldValues || {}),
				[name]: value || void value,
			},
		}));
	};

	onQuestionResponseChange = (questionKey, resp) => {
		this.setState(state => ({
			...state,
			responses: {
				...(state.responses || {}),
				[questionKey]: resp || void resp,
			},
		}));
	};

	onRegister = async e => {
		stop(e);

		const {
			props: {
				item: { webinar },
			},
			state: { complete, fieldValues: fields = {}, responses = {} },
		} = this;

		if (complete) {
			return this.onClose(e);
		}

		this.setState({ busy: true });

		try {
			const fieldValues = {};

			for (let field of Object.keys(fields)) {
				const { value } = fields[field] || {};
				if (value) {
					fieldValues[field] = value;
				}
			}

			await webinar.postToLink('WebinarRegister', {
				...fieldValues,
				responses: Object.keys(responses).map(x => ({
					questionKey: x,
					...responses[x],
				})),
			});

			await webinar.refresh();

			this.setState({ busy: false, complete: true });
		} catch (error) {
			const { invalidFields = [] } = error.error_dict || {};

			const values = { ...fields };

			// reset validity state before checking invalidFields
			for (let f of Object.keys(fields)) {
				if (fields[f]) {
					fields[f].invalid = false;
				}
			}

			for (let x of invalidFields) {
				const key = ERROR_FIELD_MAPPINGS[x] || x;
				values[key] = { ...(values[key] || {}), invalid: true };
			}

			this.setState({
				busy: false,
				error,
				fieldValues: values,
			});
		}
	};

	onCancel = () => {
		const { onBeforeDismiss, onDismiss } = this.props;

		if (onBeforeDismiss) {
			onBeforeDismiss();
		}

		if (onDismiss) {
			onDismiss();
		}
	};

	render() {
		const {
			props: { nonDialog },
			state: {
				complete,
				busy,
				data,
				error,
				fieldValues = {},
				responses = {},
			},
		} = this;

		return (
			<Prompt.SaveCancel
				className="goto-webinar-registration"
				getString={complete ? completeLocalizer : t}
				onCancel={this.onClose}
				onSave={this.onRegister}
				disableSave={busy}
				nonDialog={nonDialog}
			>
				<Fragment>
					{busy ? (
						<InProgress />
					) : complete ? (
						<Complete onClose={this.onClose} />
					) : error && !data ? (
						<Error>
							{error.Message ||
								'There was an error loading the registration form.'}
						</Error>
					) : (
						<form
							onSubmit={stop}
							ref={x => x && error && x.checkValidity()}
						>
							{error && <Error error={error} />}

							<Content>
								{!data ? (
									<InProgress loading />
								) : (
									<Fragment>
										<Fields
											items={data.fields}
											values={fieldValues}
											onChange={this.onFieldChange}
										/>
										<Questions
											items={data.questions}
											values={responses}
											onChange={
												this.onQuestionResponseChange
											}
										/>
									</Fragment>
								)}
							</Content>
						</form>
					)}
				</Fragment>
			</Prompt.SaveCancel>
		);
	}
}

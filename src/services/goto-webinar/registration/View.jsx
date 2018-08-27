import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, Panels, Prompt} from '@nti/web-commons';
import {getAppUser} from '@nti/web-client';

import Content from './Content';
import Error from './Error';
import Fields from './Fields';
import Questions from './Questions';
import InProgress from './InProgress';
import Complete from './Complete';


const stop = e => (e.preventDefault(), e.stopPropagation());

const ERROR_FIELD_MAPPINGS = {
	'surname': 'lastName',
	'givenName': 'firstName'
};

const USER_FIELD_MAPPINGS = {
	email: 'email',
	firstName: 'NonI18NFirstName',
	lastName: 'NonI18NLastName'
};

export default class Registration extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = {}

	makeInitialValuesFromUser (user) {
		if(!user) {
			return null;
		}

		let values = {};

		for(let key of Object.keys(USER_FIELD_MAPPINGS)) {
			if(user[USER_FIELD_MAPPINGS[key]]) {
				values[key] = {value: user[USER_FIELD_MAPPINGS[key]]};
			}
		}

		return values;
	}

	async componentDidMount () {
		const {item: {webinar} = {}} = this.props;
		// window.reg = this;

		if (!webinar) {
			return;
		}
		try {
			const currentUser = await getAppUser();

			this.setState({
				data: await webinar.fetchLink('WebinarRegistrationFields'),
				fieldValues: this.makeInitialValuesFromUser(currentUser)
			});
		} catch (e) {
			this.setState({error: e});
		}
	}


	onClose = (e) => {
		stop(e);
		this.props.onBeforeDismiss();
	}


	onFieldChange = (name, value) => {

		if (value && !value.value) {
			value = false;
		}

		this.setState(state => ({
			...state,
			fieldValues: {
				...(state.fieldValues || {}),
				[name]: value || void value
			}
		}));
	}


	onQuestionResponseChange = (questionKey, resp) => {
		this.setState(state => ({
			...state,
			responses: {
				...(state.responses || {}),
				[questionKey]: resp || void resp
			}
		}));
	}


	onRegister = async (e) => {
		stop(e);

		const {
			props: {item: {webinar}},
			state: {fieldValues: fields = {}, responses = {}}
		} = this;

		this.setState({busy: true});

		try {
			const fieldValues = {};

			for (let field of Object.keys(fields)) {
				const {value} = fields[field] || {};
				if (value) {
					fieldValues[field] = value;
				}
			}

			await webinar.postToLink('WebinarRegister', {
				...fieldValues,
				responses: Object.keys(responses).map(x => ({
					questionKey: x,
					...responses[x]
				}))
			});

			await webinar.refresh();

			this.setState({busy: false, complete: true});

		} catch (error) {
			const {invalidFields = []} = error.error_dict || {};

			const values = {...fields};

			// reset validity state before checking invalidFields
			for (let f of Object.keys(fields)) {
				if(fields[f]) {
					fields[f].invalid = false;
				}
			}

			for (let x of invalidFields) {
				const key = ERROR_FIELD_MAPPINGS[x] || x;
				values[key] = {...(values[key] || {}), invalid: true};
			}

			this.setState({
				busy: false,
				error,
				fieldValues: values
			});
		}
	}


	render () {
		const {
			props: {
				onBeforeDismiss: close
			},
			state: {
				complete,
				busy,
				data,
				error,
				fieldValues = {},
				responses = {}
			}
		} = this;

		return (
			<Prompt.Dialog onBeforeDismiss={close} closeOnMaskClick={false} className="goto-webinar-registration">
				<Fragment>
					<Panels.TitleBar title="Registration" iconAction={this.onClose}/>
					{busy ? (
						<InProgress/>
					) : complete ? (
						<Complete onClose={this.onClose}/>
					) : error && !data ? (
						<Error>
							{error.Message || 'There was an error loading the registration form.'}
						</Error>
					) : (
						<form onSubmit={stop} ref={x => x && error && x.checkValidity()}>

							{error && (
								<Error error={error}/>
							)}

							<Content>

								{!data ? (
									<InProgress loading/>
								) : (
									<Fragment>
										<Fields items={data.fields} values={fieldValues} onChange={this.onFieldChange}/>
										<Questions items={data.questions} values={responses} onChange={this.onQuestionResponseChange}/>
									</Fragment>
								)}

							</Content>

							<DialogButtons buttons={[
								{
									label: 'Cancel',
									type: 'reset',
									onClick: this.onClose
								},
								{
									label: 'Register',
									disabled: !data,
									type: 'submit',
									onClick: this.onRegister
								},
							]}/>
						</form>
					)}
				</Fragment>
			</Prompt.Dialog>
		);
	}
}

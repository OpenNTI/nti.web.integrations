import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {DialogButtons, Panels, Prompt, Loading} from '@nti/web-commons';

import Content from './Content';
import Fields from './Fields';
import Questions from './Questions';


export default class Registration extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = { }


	async componentDidMount () {
		const {item: {webinar} = {}} = this.props;

		if (!webinar) {
			return;
		}

		const data = await webinar.fetchLink('WebinarRegistrationFields');
		this.setState({ data });
	}


	onClose = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onBeforeDismiss();
	}


	render () {
		const {props: {onBeforeDismiss: close}, state: {data}} = this;
		return (
			<Prompt.Dialog onBeforeDismiss={close} closeOnMaskClick={false} className="goto-webinar-registration">
				<Fragment>
					<Panels.TitleBar title="Registration" iconAction={this.onClose}/>

					<Content>

						{!data ? (
							<Loading.Mask/>
						) : (
							<Fragment>
								<Fields items={data.fields}/>
								<Questions items={data.questions}/>
							</Fragment>
						)}

					</Content>

					<DialogButtons buttons={[
						{
							label: 'Cancel',
							onClick: close
						},
						{
							label: 'Register',
							disabled: !data
						},
					]}/>
				</Fragment>
			</Prompt.Dialog>
		);
	}
}

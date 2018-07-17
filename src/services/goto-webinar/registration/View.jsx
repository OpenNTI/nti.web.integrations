import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Prompt, Loading} from '@nti/web-commons';

export default class Registration extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = { loading: true }


	async componentDidMount () {
		const {item: {webinar} = {}} = this.props;

		if (!webinar) {
			return;
		}

		const data = await webinar.fetchLink('WebinarRegistrationFields');
		this.setState({loading: false, data});
	}


	onClose = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onBeforeDismiss();
	}


	render () {
		const {props: {onBeforeDismiss: close}, state: {loading}} = this;
		return (
			<Prompt.Dialog onBeforeDismiss={close} closeOnMaskClick={false} className="goto-webinar-registration">
				<Fragment>
					<h3 className="title">
						Registration
						<a className="close" title="Close" href="#close" onClick={this.onClose}><i className="icon-">x</i></a>
					</h3>
					{loading ? (
						<Loading.Mask/>
					) : (
						<Fragment>



						</Fragment>
					)}
				</Fragment>
			</Prompt.Dialog>
		);
	}
}

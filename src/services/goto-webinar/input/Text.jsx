import React from 'react';
import PropTypes from 'prop-types';
import {Input, Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';


import Store from './Store';

const t = scoped('integrations.services.goto-webinar.input.Text', {
	placeholder: 'Paste or Enter a Registration Link'
});

const propMap = {
	loading: 'loading',
	integration: 'integration',
	connected: 'connected',
	canConnect: 'canConnect',
	error: 'error'
};

export default
@Store.connect(propMap)
class GotoWebinarTextInput extends React.Component {
	static propTypes = {
		context: PropTypes.shape({
			getLink: PropTypes.func.isRequired
		}),
		store: PropTypes.shape({
			load: PropTypes.func,
			resolve: PropTypes.func
		}),
		loading: PropTypes.bool,
		error: PropTypes.string,
		onSuccess: PropTypes.func,
		onFailure: PropTypes.func
	}


	state = {}

	onTextChange = (val) => {
		this.setState({url: val});

		if(this.state.pasted) {
			this.setState({pasted: false});

			this.resolve(val);
		}
	}

	onPaste = (val) => {
		this.setState({pasted: true});
	}

	onBlur = () => {
		this.resolve(this.state.url);
	}

	resolve (val) {
		const {store, context, onSuccess, onFailure} = this.props;

		if(this.lastUrl === val) {
			return;
		}

		this.lastUrl = val;

		store.resolve(context, val).then(webinars => {
			if(!webinars || webinars.length === 0) {
				if(onFailure) {
					onFailure('No matching webinars found', val);
				}
			}
			else {
				if(onSuccess) {
					onSuccess(webinars);
				}
			}
		}).catch(e => {
			if(onFailure) {
				onFailure(e, val);
			}
		});
	}

	render () {
		const {loading} = this.props;

		return (
			<span className="go-to-webinar-text-input-container">
				<Input.Text
					className="go-to-webinar-text-input"
					disabled={loading}
					value={this.state.url}
					onChange={this.onTextChange}
					onPaste={this.onPaste}
					onBlur={this.onBlur}
					placeholder={t('placeholder')}
				/>
				{loading && <Loading.Spinner/>}
			</span>
		);
	}
}

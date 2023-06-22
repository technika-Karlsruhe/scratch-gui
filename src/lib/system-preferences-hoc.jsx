import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {setTheme} from '../reducers/theme';
import {detectTheme} from './themes/themePersistance';

// Dark mode is not yet supported
// const prefersDarkQuery = '(prefers-color-scheme: dark)';
const prefersHighContrastQuery = '(prefers-contrast: more)';

const systemPreferencesHOC = function (WrappedComponent) {
    class SystemPreferences extends React.Component {
        componentDidMount () {
            this.preferencesListener = () => this.props.onSetTheme(detectTheme());

            this.highContrastMatchMedia = window.matchMedia(prefersHighContrastQuery);
            this.highContrastMatchMedia.addEventListener('change', this.preferencesListener);
        }

        componentWillUnmount () {
            this.highContrastMatchMedia.removeEventListener('change', this.preferencesListener);
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                onSetTheme,
                /* eslint-enable no-unused-vars */
                ...props
            } = this.props;
            return <WrappedComponent {...props} />;
        }
    }

    SystemPreferences.propTypes = {
        onSetTheme: PropTypes.func
    };

    const mapDispatchToProps = dispatch => ({
        onSetTheme: theme => dispatch(setTheme(theme))
    });

    return connect(
        null,
        mapDispatchToProps
    )(SystemPreferences);
};

export default systemPreferencesHOC;

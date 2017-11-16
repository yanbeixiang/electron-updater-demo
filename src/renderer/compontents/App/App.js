import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <div className='app-container'>
                {this.props.children}
            </div>
        );
    }
}
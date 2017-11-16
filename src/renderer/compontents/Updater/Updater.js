import React, { Component } from 'react';
import CheckForUpdates from './CheckForUpdates';
import FoundUpdate from './FoundUpdate';
import DownloadUpdate from './DownloadUpdate';
import UpdateError from './UpdateError';
import { ipcRenderer } from 'electron';
import UpdaterStyles from './Updater.css';

export default class Updater extends Component {
  state = {
  };

  setUpdateState = (updateState) => {
    this.setState({ ...updateState });
  };

  componentDidMount () {
    ipcRenderer.send('update-state-request');
    this.handleUpdateStateChange = this.handleUpdateStateChange.bind(this);
    ipcRenderer.on('update-state-change', this.handleUpdateStateChange);
  }

  handleUpdateStateChange (e, state) {
    this.setUpdateState(state);
  }

  render () {
    return <div className={UpdaterStyles['updater-container']}>
      <CheckForUpdates setUpdateState={this.setUpdateState} {...this.state} />
      <FoundUpdate setUpdateState={this.setUpdateState} {...this.state} />
      <DownloadUpdate setUpdateState={this.setUpdateState} {...this.state} />
      <UpdateError setUpdateState={this.setUpdateState} {...this.state} />
    </div>;
  }
}

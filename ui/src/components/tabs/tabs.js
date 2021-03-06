import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import MessageView from '../../message';

const styles = theme => ({
  paper: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
    margin: 'auto',
    width: '65%',
    minHeight: 700,
    textAling: 'center',
    top: '50%',
  },
});

class TabContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: 0,
    };
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper} elevation={6}>
        <Tabs value={this.state.value} onChange={this.handleChange} fullWidth centered indicatorColor="secondary" textColor="secondary">
          <Tab label="MESSAGE" icon={<Icon>chat</Icon>} />
          <Tab label="UPLOAD" icon={<Icon>cloud_upload</Icon>} />
          <Tab label="DOWNLOAD" icon={<Icon>cloud_download</Icon>} />
        </Tabs>
        {this.state.value === 0 && <MessageView />}
      </Paper>
    );
  }
}

TabContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabContainer);

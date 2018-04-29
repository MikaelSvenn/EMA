import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import red from 'material-ui/colors/pink';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    marginTop: 50,
  },
  inputLabelFocused: {
    color: red[500],
  },
  inputUnderline: {
    '&:after': {
      backgroundColor: red[500],
    },
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
});

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.switchMultiline = this.switchMultiline.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  switchMultiline() {
    this.props.onSwitchMultiline();
  }

  onInputChange(event) {
    this.props.onWrite(event.target.value);
  }

  canSend() {
    return this.props.message;
  }

  sendMessage(event) {
    event.preventDefault();
    if (!this.canSend()) {
      return;
    }
    this.props.onSend(this.props.message);
  }

  renderButtonContent() {
    return <Button variant="raised" color="secondary" size="medium" disabled={!this.canSend()} className={this.classes.button} onClick={this.sendMessage}>
      Send
      <Icon style={{ paddingLeft: 5 }}>send</Icon>
    </Button>;
  }

  renderLoaderContent() {
    return <Button variant="raised" color="secondary" size="medium" disabled="true" className={this.classes.button}>
      <CircularProgress size={25} color="secondary" />
    </Button>;
  }

  render() {
    const inputPlaceHolder = this.props.isMultiline ? 'Press enter to add new line' : 'Press enter to send';
    return (
      <div className={this.classes.container}>
        <FormControl fullWidth className={this.classes.formControl} >
          <form onSubmit={this.sendMessage}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <InputLabel FormLabelClasses={{ focused: this.classes.inputLabelFocused }} label="Message" htmlFor="custom-color-input">
                  Message
                </InputLabel>
                <Input fullWidth spellCheck={false}
                value={this.props.message}
                onChange={this.onInputChange}
                disabled={this.props.isSendingMessage}
                rowsMax={22}
                classes={{ underline: this.classes.inputUnderline }}
                multiline={this.props.isMultiline}
                placeholder={inputPlaceHolder}
                id="custom-color-input" />
              </Grid>
              <Grid item xs={10}>
                <FormControlLabel control={
                  <Switch checked={this.props.isMultiline} onChange={this.switchMultiline} />
                } label="Use multiple lines" />
              </Grid>
              <Grid item xs>
                {this.props.isSendingMessage ? this.renderLoaderContent() : this.renderButtonContent()}
              </Grid>
            </Grid>
          </form>
        </FormControl>
      </div>
    );
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  onWrite: PropTypes.func.isRequired,
  onSwitchMultiline: PropTypes.func.isRequired,
  isMultiline: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  isSendingMessage: PropTypes.bool.isRequired,
  isSendMessageFailed: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MessageView);

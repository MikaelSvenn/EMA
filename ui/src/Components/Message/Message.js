import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
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

class Message extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.switchMultiline = this.switchMultiline.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      isMultiline: false,
      message: '',
    };
  }

  switchMultiline() {
    this.setState({ isMultiline: !this.state.isMultiline });
  }

  onInputChange(event) {
    this.setState({ message: event.target.value });
  }

  canSend() {
    return this.state.message;
  }

  render() {
    const inputPlaceHolder = this.state.isMultiline ? 'Press enter to add new line' : 'Press enter to send';
    return (
      <div className={this.classes.container}>
        <FormControl fullWidth className={this.classes.formControl}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <InputLabel FormLabelClasses={{ focused: this.classes.inputLabelFocused }} label="Message" htmlFor="custom-color-input">
                Message
              </InputLabel>
              <Input fullWidth spellCheck={false} onChange={this.onInputChange} rowsMax={22} classes={{ underline: this.classes.inputUnderline }} multiline={this.state.isMultiline} placeholder={inputPlaceHolder} id="custom-color-input" />
            </Grid>
            <Grid item xs={10}>
            <FormControlLabel control={
                <Switch checked={this.state.isMultiline} onChange={this.switchMultiline} />
              } label="Use multiple lines" />
            </Grid>
            <Grid item xs>
              <Button variant="raised" color="secondary" size="medium" disabled={!this.canSend()} className={this.classes.button}>
                Send
                <Icon className={this.classes.rightIcon}>send</Icon>
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </div>
    );
  }
}

Message.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Message);

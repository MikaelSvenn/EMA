import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
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

function Message(props) {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel FormLabelClasses={{ focused: classes.inputLabelFocused }} label="Message" htmlFor="custom-color-input">
          Message
        </InputLabel>
        <Input classes={{ underline: classes.inputUnderline }} placeholder="Press enter to send" id="custom-color-input" />
      </FormControl>
    </div>
  );
}

Message.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Message);

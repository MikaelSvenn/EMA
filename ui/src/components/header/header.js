import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

class Header extends Component {
  render() {
    const titleStyle = {
      margin: 'auto',
      height: 80,
      width: '65%',
      minWidth: 500,
      color: '#202020',
      textShadow: '-1px -1px 1px #000, 2px 2px 1px #363636',
      whiteSpace: 'no-wrap',
    };

    return (
        <Typography style={titleStyle} variant="display2">{this.props.text}</Typography>
    );
  }
}

Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;

import { connect } from 'react-redux';
import messageActions from '../actions';
import MessageView from '../components/messageView';

const mapStateToProps = ({ sendMessage, writeMessage }) => ({ ...sendMessage, ...writeMessage });
const mapDispatchToProps = dispatch => ({
  onWrite: message => dispatch(messageActions.write(message)),
  onSwitchMultiline: () => dispatch(messageActions.switchMultiline()),
  onSend: message => dispatch(messageActions.send(message)),
});

const MessageContainer = connect(mapStateToProps, mapDispatchToProps)(MessageView);
export default MessageContainer;

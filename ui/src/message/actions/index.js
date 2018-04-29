import api from '../../common/api';
import { writeMessage, switchMultiline } from './writeMessage';
import { sendMessage } from './sendMessage';

export default {
  switchMultiline,
  write: writeMessage,
  send: sendMessage(api),
};

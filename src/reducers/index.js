import Topics from './Topics';
import Session from './Session';
import Tickets from './Tickets';
import Message from './Message';
import { combineReducers } from 'redux';

export default combineReducers({
  session: Session,
  topics: Topics,
  tickets: Tickets,
  message: Message
});

import Topics from './Topics';
import Session from './Session';
import Tickets from './Tickets';
import { combineReducers } from 'redux';

export default combineReducers({
  topics: Topics,
  session: Session,
  tickets: Tickets
})

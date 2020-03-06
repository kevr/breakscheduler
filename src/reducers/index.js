import Topics from './Topics';
import Session from './Session';
import Tickets from './Tickets';
import Ticket from './Ticket';
import Message from './Message';
import Articles from './Articles';
import { combineReducers } from 'redux';

export default combineReducers({
  session: Session,
  topics: Topics,
  tickets: Tickets,
  ticket: Ticket,
  message: Message,
  articles: Articles,
});

// Component Module
// All components located in this directory should be
// accessible from this module export.
// 
import Breadcrumb from './Breadcrumb';
import Badge from './Badge';
import Loader from './Loader';
import Modal from './Modal';
import UserWidget from './UserWidget';
import Navbar from './Navbar';
import ExtendedNavbar from './ExtendedNavbar';
import Reply from './Reply';
import ReplyForm from './ReplyForm';
import ReplyCollapse from './ReplyCollapse';
import TicketControl from './TicketControl';
import Paginator from './Paginator';
import SearchBar from './SearchBar';

// All partials exported here should be mimicked in
// the module's default export below.
export {
  Breadcrumb,
  Badge,
  Loader,
  Modal,
  UserWidget,
  Navbar,
  ExtendedNavbar,
  Reply,
  ReplyForm,
  ReplyCollapse,
  TicketControl,
  Paginator,
  SearchBar
};

export default {
  // Page breadcrumbs
  Breadcrumb,

  // Indicator badge
  Badge,

  // Loading spinner
  Loader,

  // Full-screen modal
  Modal,

  // User-centered widget
  UserWidget,

  // Main navbar
  Navbar,

  // Tab-driven navbar (For now, only for /help/support)
  ExtendedNavbar,

  // A Ticket reply
  Reply,

  // A form for creating a reply
  ReplyForm,

  // The parent of ReplyForm for most situations.
  // Provides a collapsible form.
  ReplyCollapse,

  // Administrator Ticket control widget.
  // Used for updating Ticket status, and other actions
  // requiring elevated privileges.
  TicketControl,

  // Data paginator
  Paginator,

  // Search component
  SearchBar
};

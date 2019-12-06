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
  Reply
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
  Reply
};

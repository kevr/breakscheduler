// Component Module
// All components located in this directory should be
// accessible from this module export.
// 
import Breadcrumb from './Breadcrumb';
import Badge, { SelectBadge } from './Badge';
import Loader from './Loader';
import Modal from './Modal';
import UserWidget from './UserWidget';
import Navbar from './Navbar';
import ExtendedNavbar from './ExtendedNavbar';
import Reply from './Reply';
import ReplyForm from './ReplyForm';
import ReplyCollapse from './ReplyCollapse';
import Paginator from './Paginator';
import SearchBar from './SearchBar';
import Card from './Card';
import StatusBadge from './StatusBadge';
import Indicator from './Indicator';
import Collection from './Collection';
import Section from './Section';
import Row from './Row';
import Col from './Col';
import Container from './Container';

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
  Paginator,
  SearchBar,
  Card,
  SelectBadge,
  StatusBadge,
  Indicator,
  Collection,
  Section,

  // Materialize grid components
  Row,
  Col,
  Container
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

  // Data paginator
  Paginator,

  // Search component
  SearchBar,

  Card,

  SelectBadge,
  StatusBadge,

  Indicator,

  Collection,

  Section,

  Row,
  Col,
  Container
};

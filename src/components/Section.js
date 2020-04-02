import React from 'react';

/**
 * Represents a page section. Takes an optional prop of title, which
 * when given is included directly within the section.
 * Example title: <h4 className="FrameTitle">{"Section Title"}</h4>
**/
const Section = ({ children, title }) => (
  <div className="widePageFrame pageSection">
    {title !== null && title}
    {children}
  </div>
);

Section.defaultProps = {
  title: null
};

export default Section;

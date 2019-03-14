/**
 *
 * RelationBox
 *
 */

import React from 'react';
//import PropTypes from 'prop-types';
// import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import Input from 'components/InputsIndex';

import styles from './styles.scss';

function RelationBox({
  isMainContentType,
  relation
}) {
  console.log(isMainContentType);
  console.log(relation);
  return (

    <div className={styles.relationBox}>
      BOX
      {isMainContentType ? <p>Main</p> : <p>NOT</p> }
      {/* <Input type="text" /> */}
    </div>
  );
}

RelationBox.propTypes = {};

export default RelationBox;

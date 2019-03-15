/**
*
* RelationNature
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

function RelationNature({
  nature,
}) {
  return (
    <div className={styles.relationNature}>
      {nature}
    </div>
  );
}

RelationNature.propTypes = {

};

export default RelationNature;

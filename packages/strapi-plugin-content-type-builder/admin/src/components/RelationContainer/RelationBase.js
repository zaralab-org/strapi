/**
*
* RelationBase
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import RelationBox from '../RelationBox';
import RelationNature from '../RelationNature';

import styles from './styles.scss';

function RelationBase({
  relation,
}) {

  const { nature, plugin, target, targetColumnName, key } = relation;

  console.log("YO");
  console.log(relation);

  return (
    <div className={styles.relationBase}>

      {/* Left box - main content type */}
      <RelationBox isMainContentType={true} />

      {/* Nature picker */}
      <RelationNature />

      {/* Right box - main content type */}
      <RelationBox />
    </div>
  );
}

RelationBase.defaultProps = {
};

RelationBase.propTypes = {
  relation: PropTypes.shape({
    nature: PropTypes.string,
    plugin: PropTypes.string,
    target: PropTypes.string,
    targetColumnName: PropTypes.string,
    key: PropTypes.string,
  }).isRequired,
};

export default RelationBase;

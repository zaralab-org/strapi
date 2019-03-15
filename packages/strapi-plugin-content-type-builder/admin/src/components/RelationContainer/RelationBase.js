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
  modelsInfos,
  currentForm,
}) {

  const { nature } = relation;

  return (
    <div className={styles.relationBase}>
      <div className={styles.relationBoxWrapper}>
        {/* Left box - main content type */}
        <RelationBox isMainContentType={true} modelsInfos={modelsInfos} relation={relation} currentForm={currentForm}/>
      </div>
      <div className={styles.relationNatureWrapper}>
        {/* Nature picker */}
        <RelationNature nature={nature}/>
      </div>
      <div className={styles.relationBoxWrapper}>
        {/* Right box - main content type */}
        <RelationBox modelsInfos={modelsInfos} relation={relation} currentForm={currentForm} />
      </div>
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
  modelsInfos: PropTypes.shape({
    modelName: PropTypes.string,
    models: PropTypes.array,
  }).isRequired,
};

export default RelationBase;

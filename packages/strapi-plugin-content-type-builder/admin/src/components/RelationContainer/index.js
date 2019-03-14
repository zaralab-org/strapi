/**
*
* RelationContainer
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import RelationBase from './RelationBase';
import RelationAdvanced from './RelationAdvanced';

import styles from './styles.scss';

function RelationContainer({
  activeTab,
  relation,
}) {

  // Manage settings between them

  const renderTab = () => {
    if (activeTab === 'base') {
      return <RelationBase relation={relation} />;
    } else {
      return <RelationAdvanced />;
    }
  };

  return (
    <div className={styles.relationContainer}>
      {renderTab()}
    </div>
  );
}

RelationContainer.defaultProps = {
  activeTab : 'base',
};

RelationContainer.propTypes = {
  activeTab : PropTypes.string,
  relation: PropTypes.object.isRequired,
};

export default RelationContainer;

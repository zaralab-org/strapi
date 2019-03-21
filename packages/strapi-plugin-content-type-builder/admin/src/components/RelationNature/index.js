/**
*
* RelationNature
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

import styles from './styles.scss';

function RelationNature({
  nature,
}) {
  const natures = [
    {
      name: 'oneWay',
      className: styles.oneWay,
    },
    {
      name: 'oneToOne',
      className: styles.oneToOne,
    },
    {
      name: 'oneToMany',
      className: styles.oneToMany,
    },
    {
      name: 'manyToOne',
      className: styles.manyToOne,
    },
    {
      name: 'manyToMany',
      className: styles.manyToMany,
    },
  ];

  const handleChange = e => {
    console.log(e.target);
  };

  return (
    <div className={styles.relationNature}>
      <div className={styles.naturesWrapper}>
        {natures.map(item => {
          return (
            <FormGroup key={item.name} className={`${styles.formGroup} ${item.className}`}>
              <Input type="radio" id={item.name} name="nature" value={item.name} checked={nature === item.name} onChange={handleChange} />
              <Label htmlFor={item.name}></Label>
            </FormGroup>
          )
        })}
      </div>
      <div className={styles.naturesText}>
        <p>Article a un article</p>
      </div>
    </div>
  );
}

RelationNature.defaultProps = {
  nature: 'oneWay',
};

RelationNature.propTypes = {
  nature: PropTypes.string,
};

export default RelationNature;

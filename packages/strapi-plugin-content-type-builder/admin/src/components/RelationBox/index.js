/**
 *
 * RelationBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';

// import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import Input from 'components/InputsIndex';
import { Input } from 'reactstrap';
import InputText from 'components/InputsIndex';
import InputSelect from 'components/InputSelect';

import styles from './styles.scss';

function RelationBox({
  currentForm,
  isMainContentType,
  modelsInfos,
  relation,
  errors,
}) {
  const { modelName, models, onChange} = modelsInfos;
  const { key, name, target} = currentForm;

  const selectOptions = () => {
    return models.map(model => {
      return {value : model.name};
    })
  }

  return (
    <div className={styles.relationBox}>
      <div className={styles.relationBoxHeader}>
        {isMainContentType ? (
          <p><i className={`fa fa-caret-square-o-right`} />{modelName}</p>
        ) : (
          <Input type="select" name={target.name} id={target.name} className={styles.inputText}>
            {selectOptions().map(option => {
              return (
                // Change with formatted message
                <option key={option.value} value={option.value}>{option.value}</option>
              );
            })}
          </Input>
        )}
      </div>

      <div className={styles.relationBoxBody}>
        {isMainContentType ? (
          <InputText
            {...key}
            onChange={onChange}
            value={relation.key}
          />
        ) : (
          <InputText
            {...name}
            onChange={onChange}
            value={relation.name}
          />
        )}
      </div>
    </div>
  );
}

RelationBox.propTypes = {
  relation: PropTypes.object,
  modelsInfos: PropTypes.shape({
    modelName: PropTypes.string,
    models: PropTypes.array,
  }).isRequired,
};

export default RelationBox;

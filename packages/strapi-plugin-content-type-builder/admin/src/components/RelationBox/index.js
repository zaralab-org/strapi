/**
 *
 * RelationBox
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import InputText from 'components/InputsIndex';

import styles from './styles.scss';

function RelationBox({
  currentForm,
  isMainContentType,
  modelsInfos,
  relation,
  errors,
}) {
  const [isOpen, toggleIsOpen] = useState(false);
  const { modelName, models, onChange} = modelsInfos;
  const { key, name} = currentForm;
  const { target} = relation;

  const selectTarget = e => {
    onChange({target: e.currentTarget});
  };

  return (
    <div className={styles.relationBox}>
      <div className={styles.relationBoxHeader}>
        {isMainContentType ? (
          <p><i className={`fa fa-caret-square-o-right`} />{modelName}</p>
        ) : (

          <Dropdown isOpen={isOpen} toggle={() => toggleIsOpen(!isOpen)}>
            <DropdownToggle caret>
              {target}
            </DropdownToggle>
            <DropdownMenu>
              {models.map(option => {
                const id = option.source ? `${option.name}.${option.source}` : `${option.name}. `;

                return (
                  <DropdownItem key={option.name} onClick={selectTarget} id={id}>
                    <p>
                      <i className={`fa fa-caret-square-o-right`} />
                      {option.name}
                      {option.source && (
                        <FormattedMessage id="content-type-builder.from">
                          {message => (
                            <span style={{ fontStyle: 'italic' }}>
                              ({message}: {option.source})
                            </span>
                          )}
                        </FormattedMessage>
                      )}
                    </p>
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      <div className={styles.relationBoxBody}>
        {isMainContentType ? (
          <InputText
            {...key}
            type="text"
            onChange={onChange}
            value={relation.key}
          />
        ) : (
          <InputText
            {...name}
            type="text"
            onChange={onChange}
            value={relation.name}
          />
        )}
      </div>
    </div>
  );
}

RelationBox.propTypes = {
  modelsInfos: PropTypes.shape({
    modelName: PropTypes.string,
    models: PropTypes.array,
    onChange: PropTypes.func,
  }).isRequired,
  relation: PropTypes.object,
};

export default RelationBox;

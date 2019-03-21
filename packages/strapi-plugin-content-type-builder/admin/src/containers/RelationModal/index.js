/**
 *
 * RelationModal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';

import pluginId from '../../pluginId';

import BodyModal from '../../components/BodyModal';
import ButtonModalPrimary from '../../components/ButtonModalPrimary';
import ButtonModalSecondary from '../../components/ButtonModalSecondary';
import FooterModal from '../../components/FooterModal';
import HeaderModal from '../../components/HeaderModal';
import HeaderModalNavContainer from '../../components/HeaderModalNavContainer';
import HeaderNavLink from '../../components/HeaderNavLink';
import { RelationBase, RelationAdvanced  } from '../../components/RelationContainer';
import WrapperModal from '../../components/WrapperModal';

import supportedAttributes from './supportedAttributes.json';

import styles from './styles.scss';

const NAVLINKS = [{ id: 'base', name: 'relation' }, { id: 'advanced', name: 'advanced' }];

class RelationModal extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  state = { didCheckErrors: false, formErrors: {}, showForm: false };
  
  getCurrentForm = () => {
    const { activeTab, attributeType } = this.props;

    return get(supportedAttributes, [attributeType, activeTab, 'items'], []);
  };

  formatProps = () => {
    const { models, modelName, onChange } = this.props;

    return ({ 
      modelName: modelName,
      models: models,
      onChange: onChange,
    });
  }

  handleCancel = () => {
    const { push } = this.props;

    push({ search: '' });
  };

  handleGoTo = to => {
    const { attributeType, push } = this.props;

    push({
      search: `modalType=attributeForm&attributeType=${attributeType}&settingType=${to}&actionType=create`,
    });
  };

  handleOnClosed = () => {
    const { onCancel } = this.props;

    onCancel();
  };

  handleOnOpened = () => this.setState({ showForm: true });

  handleSubmit = e => {
    e.preventDefault();

    const { alreadyTakenAttributes, modifiedData, onSubmit } = this.props;
    const currentForm = this.getCurrentForm();
    let formErrors = {};

    console.log(modifiedData);
    console.log(currentForm);
    console.log(alreadyTakenAttributes);

    // if (isEmpty(modifiedData.name)) {
    //   formErrors = { name: [{ id: `${pluginId}.error.validation.required` }] };
    // }

    // if (alreadyTakenAttributes.includes(get(modifiedData, 'name', ''))) {
    //   formErrors = { name: [{ id: `${pluginId}.error.attribute.taken` }] };
    // }

    // // TODO NEED TO HANDLE OTHER VALIDATIONS
    // formErrors = Object.keys(modifiedData).reduce((acc, current) => {
    //   const { custom, validations } = currentForm.find(
    //     input => input.name === current,
    //   ) || { validations: {} };
    //   const value = modifiedData[current];

    //   if (validations.required === true && value === '' && custom === true) {
    //     acc[current] = [{ id: `${pluginId}.error.validation.required` }];
    //   }

    //   return acc;
    // }, formErrors);

    // this.setState(prevState => ({
    //   didCheckErrors: !prevState.didCheckErrors,
    //   formErrors,
    // }));

    if (isEmpty(formErrors)) {
      onSubmit();
    }
  };

  handleToggle = () => {
    this.setState({ formErrors: {}, showForm: false });
    const { push } = this.props;
    push({ search: '' });
  };

  renderNavLink = (link, index) => {
    const { activeTab } = this.props;

    return (
      <HeaderNavLink
        isActive={activeTab === link.id}
        key={link.id}
        name={link.name}
        id={link.id}
        {...link}
        onClick={this.handleGoTo}
        nextTab={index === NAVLINKS.length - 1 ? 0 : index + 1}
      />
    );
  };  

  renderRelationTab = () => {
    const currentForm = this.getCurrentForm();
    const modelsInfos = this.formatProps();
    const { activeTab, modifiedData } = this.props;

    // if (activeTab === 'base') {
    //   return <RelationBase relation={modifiedData} modelsInfos={modelsInfos} currentForm={currentForm} />;
    // } else {
    //   return <RelationAdvanced currentForm={currentForm} />;
    // }

    return <RelationBase relation={modifiedData} modelsInfos={modelsInfos} currentForm={currentForm} />;
  };

  render() {
    const { attributeType, isOpen } = this.props;
    const { showForm } = this.state;

    return (
      <WrapperModal
        className={styles.relationModal}
        isOpen={isOpen}
        onClosed={this.handleOnClosed}
        onOpened={this.handleOnOpened}
        onToggle={this.handleToggle}
      >
        <HeaderModal>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            <FormattedMessage id={`${pluginId}.popUpForm.create`} />
            &nbsp;
            <span style={{ fontStyle: 'italic', textTransform: 'capitalize' }}>
              {attributeType}
            </span>
            &nbsp;
            <FormattedMessage id={`${pluginId}.popUpForm.field`} />
          </div>
          <HeaderModalNavContainer>
            {NAVLINKS.map(this.renderNavLink)}
          </HeaderModalNavContainer>
        </HeaderModal>
        <form onSubmit={this.handleSubmit}>
          <BodyModal>
            {showForm && this.renderRelationTab()}
          </BodyModal>
          <FooterModal>
            <ButtonModalSecondary
              message={`${pluginId}.form.button.cancel`}
              onClick={this.handleToggle}
            />
            <ButtonModalPrimary
              message={`${pluginId}.form.button.continue`}
              type="submit"
              add
            />
            <ButtonModalPrimary
              message={`${pluginId}.form.button.save`}
              type="button"
            />
          </FooterModal>
        </form>
      </WrapperModal>
    );
  }
}





// function RelationModalFunc({ 
//   alreadyTakenAttributes,
//   attributeType, 
//   activeTab, 
//   isOpen, 
//   modelName, 
//   models, 
//   modifiedData, 
//   onChange, 
//   onSubmit, 
//   push,
// }) {
//   const getCurrentForm = () => {
//     return get(supportedAttributes, [attributeType, activeTab, 'items'], []);
//   };

//   const handleToggle = () => {
//     push({ search: '' });
//   };

//   const handleGoTo = to => {
//     push({
//       search: `modalType=attributeForm&attributeType=${attributeType}&settingType=${to}&actionType=create`,
//     });
//   };

//   const formatProps = () => {
//     return ({ 
//       modelName: modelName,
//       models: models,
//       onChange: onChange,
//     });
//   }

//   const renderNavLink = (link, index) => {
//     return (
//       <HeaderNavLink
//         isActive={activeTab === link.id}
//         key={link.id}
//         name={link.name}
//         id={link.id}
//         {...link}
//         onClick={handleGoTo}
//         nextTab={index === NAVLINKS.length - 1 ? 0 : index + 1}
//       />
//     );
//   };  
  
  
//   const handleSubmit = e => {
//     e.preventDefault();

//     const currentForm = getCurrentForm();
//     let formErrors = {};

//     console.log(modifiedData);
//     console.log(currentForm);
//     console.log(alreadyTakenAttributes);

//     // if (isEmpty(modifiedData.name)) {
//     //   formErrors = { name: [{ id: `${pluginId}.error.validation.required` }] };
//     // }

//     // if (alreadyTakenAttributes.includes(get(modifiedData, 'name', ''))) {
//     //   formErrors = { name: [{ id: `${pluginId}.error.attribute.taken` }] };
//     // }

//     // // TODO NEED TO HANDLE OTHER VALIDATIONS
//     // formErrors = Object.keys(modifiedData).reduce((acc, current) => {
//     //   const { custom, validations } = currentForm.find(
//     //     input => input.name === current,
//     //   ) || { validations: {} };
//     //   const value = modifiedData[current];

//     //   if (validations.required === true && value === '' && custom === true) {
//     //     acc[current] = [{ id: `${pluginId}.error.validation.required` }];
//     //   }

//     //   return acc;
//     // }, formErrors);

//     // this.setState(prevState => ({
//     //   didCheckErrors: !prevState.didCheckErrors,
//     //   formErrors,
//     // }));

//     if (isEmpty(formErrors)) {
//       onSubmit();
//     }
//   };

//   return (
//     <WrapperModal
//       isOpen={isOpen}
//       onToggle={handleToggle}
//       className={styles.relationModal}
//     >
//       <HeaderModal>
//         <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
//           <FormattedMessage id={`${pluginId}.popUpForm.create`} />
//           &nbsp;
//           <span style={{ fontStyle: 'italic', textTransform: 'capitalize' }}>
//             {attributeType}
//           </span>
//           &nbsp;
//           <FormattedMessage id={`${pluginId}.popUpForm.field`} />
//         </div>
//         <HeaderModalNavContainer>
//           {NAVLINKS.map(renderNavLink)}
//         </HeaderModalNavContainer>
//       </HeaderModal>
//       <form onSubmit={handleSubmit}>
//         <BodyModal>
//           <RelationContainer activeTab={activeTab} relation={modifiedData} modelsInfos={formatProps()} />
//         </BodyModal>
//         <FooterModal>
//           <ButtonModalSecondary
//             message={`${pluginId}.form.button.cancel`}
//             onClick={handleToggle}
//           />
//           <ButtonModalPrimary
//             message={`${pluginId}.form.button.continue`}
//             type="submit"
//             add
//           />
//           <ButtonModalPrimary
//             message={`${pluginId}.form.button.save`}
//             type="button"
//           />
//         </FooterModal>
//       </form>
//     </WrapperModal>
//   );
// }

RelationModal.defaultProps = {
  activeTab: 'base',
  attributeType: 'string',
  isOpen: false,
  onCancel: () => {},
  onChange: () => {},
  push: () => {},
  modelName: '',
  models: [],
};

RelationModal.propTypes = {
  activeTab: PropTypes.string,
  attributeType: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  isOpen: PropTypes.bool,
  push: PropTypes.func,
  modalName: PropTypes.string,
  models: PropTypes.array,
};

export default RelationModal;

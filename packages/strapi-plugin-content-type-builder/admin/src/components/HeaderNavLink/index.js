/**
 *
 * HeaderNavLink
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';

import pluginId from '../../pluginId';

import styles from './styles.scss';

/* istanbul ignore next */
function HeaderNavLink({ id, isActive, onClick, name }) {
  return (
    <div
      className={cn(isActive && styles.headerNavLink)}
      onClick={() => onClick(id)}
    >
      <FormattedMessage id={`${pluginId}.popUpForm.navContainer.${name || id}`} />
    </div>
  );
}

HeaderNavLink.defaultProps = {
  id: 'base',
  isActive: false,
  name: null,
};

HeaderNavLink.propTypes = {
  id: PropTypes.string,
  isActive: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default HeaderNavLink;

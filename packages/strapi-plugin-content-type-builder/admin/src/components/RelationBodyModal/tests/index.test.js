import React from 'react';
import { shallow } from 'enzyme';

import RelationBodyModal from '../index';

// import mountWithIntl from 'testUtils/mountWithIntl';
// import formatMessagesWithPluginId from 'testUtils/formatMessages';


// This part is needed if you need to test the lifecycle of a container that contains FormattedMessages

// import pluginId from '../../../pluginId';
// import pluginTradsEn from '../../../translations/en.json';

// import { RelationBodyModal } from '../index';

// const messages = formatMessagesWithPluginId(pluginId, pluginTradsEn);
// const renderComponent = (props = {}) => mountWithIntl(<RelationBodyModal {...props} />, messages);

describe('<RelationBodyModal />', () => {
  it('should not crash', () => {
    shallow(<RelationBodyModal />);

    // renderComponent({});
  });
});

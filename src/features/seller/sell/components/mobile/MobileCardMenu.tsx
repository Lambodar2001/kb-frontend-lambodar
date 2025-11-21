import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../../../listings/components/myads/ListingCardMenu';

export type MobileCardMenuProps = ListingCardMenuProps;

const MobileCardMenu: React.FC<MobileCardMenuProps> = (props) => {
  // Reuse shared listing menu so mobile features stay in sync
  return <ListingCardMenu {...props} />;
};

export default MobileCardMenu;

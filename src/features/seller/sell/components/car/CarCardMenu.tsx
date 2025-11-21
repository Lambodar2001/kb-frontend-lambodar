import React from 'react';
import ListingCardMenu, { ListingCardMenuProps } from '../../../listings/components/myads/ListingCardMenu';

export type CarCardMenuProps = ListingCardMenuProps;

const CarCardMenu: React.FC<CarCardMenuProps> = (props) => {
  // Reuse shared listing menu so car features stay in sync
  return <ListingCardMenu {...props} />;
};

export default CarCardMenu;

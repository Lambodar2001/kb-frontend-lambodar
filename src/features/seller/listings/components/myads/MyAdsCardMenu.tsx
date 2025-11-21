import React from 'react';

import ListingCardMenu, { ListingCardMenuProps } from './ListingCardMenu';

type MyAdsCardMenuProps = Omit<ListingCardMenuProps, 'editLabel' | 'deleteLabel'> & {
  entityLabel?: string;
};

const MyAdsCardMenu: React.FC<MyAdsCardMenuProps> = ({
  entityLabel,
  ...restProps
}) => {
  const defaultEditLabel = entityLabel ? `Edit ${entityLabel}` : 'Edit Ad';

  return (
    <ListingCardMenu
      editLabel={defaultEditLabel}
      deleteLabel="Delete listing"
      {...restProps}
    />
  );
};

export default MyAdsCardMenu;


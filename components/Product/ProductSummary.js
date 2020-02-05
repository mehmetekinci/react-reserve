import React from 'react';
import { Item, Label, Rating, Icon } from 'semantic-ui-react';
import calculateRatingMedian from '../../utils/calculateRatingMedian';
import AddProductToCart from './AddProductToCart';

function ProductSummary({ name, mediaUrl, _id, price, sku, user, ratings }) {
  const [ratingAmount, setRatingAmount] = React.useState(0);

  React.useEffect(() => {
    const avrRating = calculateRatingMedian(ratings);
    setRatingAmount(avrRating);
  }, [ratings]);

  return (
    <>
      <Item.Group>
        <Item>
          <Item.Image size="medium" src={mediaUrl} />
          <Item.Content>
            <Item.Header>{name}</Item.Header>
            <Item.Description>
              <p>${price}</p>
              <Label>SKU: {sku}</Label>
            </Item.Description>
            <Item.Extra>
              <AddProductToCart user={user} productId={_id} name={name} />
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
      <Rating
        maxRating="5"
        disabled
        icon="star"
        size="large"
        rating={ratingAmount}
      />
      <Label>
        {`${ratings.length} users rated this!`}{' '}
        <Icon name="star" color="yellow" />
      </Label>
    </>
  );
}

export default ProductSummary;

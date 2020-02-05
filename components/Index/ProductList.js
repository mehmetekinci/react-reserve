import { Card, Rating } from 'semantic-ui-react';
import calculateRatingMedian from '../../utils/calculateRatingMedian';

function ProductList({ products }) {
  function mapProductsToItems(products) {
    return products.map(product => {
      const avargeRating = calculateRatingMedian(product.ratings);

      return {
        header: product.name,
        image: product.mediaUrl,
        meta: `$${product.price}`,
        color: 'teal',
        fluid: true,
        childKey: product._id,
        href: `/product?_id=${product._id}`,
        extra: (
          <Rating
            size="tiny"
            icon="star"
            disabled
            maxRating={5}
            rating={avargeRating || 0}
          />
        ),
      };
    });
  }

  return (
    <Card.Group
      stackable
      itemsPerRow="3"
      centered
      items={mapProductsToItems(products)}
    />
  );
}

export default ProductList;

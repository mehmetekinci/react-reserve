import {
  Header,
  Accordion,
  Label,
  Segment,
  Icon,
  Button,
  List,
  Image,
  Rating,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import baseUrl from '../../utils/baseUrl';
import cookie from 'js-cookie';
import axios from 'axios';
import formateDate from '../../utils/formatDate';

function AccountOrders({ orders, _id }) {
  const initialStars = orders.reduce((starObj, order) => {
    starObj[order._id] = order.products.reduce((prodObj, p) => {
      prodObj[p.product._id] =
        p.product.ratings[0] === undefined ? '0' : p.product.ratings[0].star;
      return prodObj;
    }, {});
    return starObj;
  }, {});

  const [star, setStar] = React.useState(initialStars);
  const router = useRouter();

  async function handleOnRate(e, { rating }, productId, orderId) {
    const url = `${baseUrl}/api/ratings`;
    const token = cookie.get('token');
    const headers = { headers: { Authorization: token } };
    const payload = { productId: productId, rating, userId: _id };
    const response = await axios.post(url, payload, headers);

    setStar({
      ...star,
      [orderId]: { ...star[orderId][productId], [productId]: rating },
    });
  }

  function mapOrdersToPanels(orders) {
    return orders.map(order => {
      return {
        key: order._id,
        title: {
          content: (
            <Label color="blue" content={formateDate(order.createdAt)} />
          ),
        },
        content: {
          content: (
            <>
              <List.Header as="h3">
                Total: ${order.total}
                <Label
                  content={order.email}
                  icon="mail"
                  basic
                  horizontal
                  style={{ marginLeft: '1em' }}
                />
              </List.Header>
              <List>
                {order.products.map(p => (
                  <List.Item key={p.product._id}>
                    <Image avatar src={p.product.mediaUrl} />
                    <List.Content>
                      <List.Header>{p.product.name}</List.Header>
                      <List.Description>
                        {p.quantity} · ${p.product.price}
                      </List.Description>
                    </List.Content>
                    <Rating
                      icon="star"
                      maxRating="5"
                      size="tiny"
                      onRate={(e, data) =>
                        handleOnRate(e, data, p.product._id, order._id)
                      }
                      rating={star[order._id][p.product._id]}
                    />
                    <List.Content floated="right">
                      <Label tag color="red" size="tiny">
                        {p.product.sku}
                      </Label>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </>
          ),
        },
      };
    });
  }

  return (
    <>
      <Header as="h2">
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment inverted tertiary color="grey" textAlign="center">
          <Header icon>
            <Icon name="copy outline" />
            No past orders.
          </Header>
          <div>
            <Button onClick={() => router.push('/')} color="orange">
              View Products
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          fluid
          styled
          exclusive={false}
          panels={mapOrdersToPanels(orders)}
        />
      )}
    </>
  );
}

export default AccountOrders;

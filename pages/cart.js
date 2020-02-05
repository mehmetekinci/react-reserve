import { useState } from 'react';
import { logEvent } from '../utils/analytics';
import { useRouter } from 'next/router';
import { Segment, Modal, Image, Button, Header } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import { parseCookies } from 'nookies';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import cookie from 'js-cookie';
import catchErrors from '../utils/catchErrors';

function Cart({ products, user }) {
  const router = useRouter();
  const [cartProducts, setCartProducts] = React.useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const payload = {
      params: { productId },
      headers: { Authorization: token },
    };
    const response = await axios.delete(url, payload);
    setCartProducts(response.data);
    logEvent('User', `User ${user.name} removed product from their cart`);
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(url, payload, headers);
      setSuccess(true);
      logEvent('User', `User ${user.name} made a payment! `);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Segment loading={loading}>
        <CartItemList
          handleRemoveFromCart={handleRemoveFromCart}
          user={user}
          products={cartProducts}
          success={success}
        />
        <CartSummary
          products={cartProducts}
          handleCheckout={handleCheckout}
          success={success}
        />
      </Segment>
      {success && (
        <Modal
          centered={false}
          closeIcon
          open={isOpen}
          size="large"
          style={{
            marginTop: '0px !important',
            position: 'relative',
            top: '20px',
          }}
        >
          <Header content="You can rate your products from your order list now!" />
          <Modal.Content image>
            <Image floated="left" src="../static/click-to-rate.png" />
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={() => router.push('/account')}>
              I'd love to!
            </Button>
            <Button color="red" onClick={() => setIsOpen(false)}>
              Nah..Maybe later.
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

Cart.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  return { products: response.data };
};

export default Cart;

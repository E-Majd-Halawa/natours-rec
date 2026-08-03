/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51TvvZx4rlV4vwB5OzEHYBhHDm6T1RjnXJu6fLxZX7tCIVzpCCWPBpeI9b1jN2vpooIGODrKXnZMHS0a4ql0pzBtC00Y3XXV0Gb',
);
export const bookTour = async (tourId) => {
  try {
    //1)get  checkout session from Api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //2)create checkout form + charge cridet card}
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};

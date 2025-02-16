import prisma from "@/src/lib/services/db";
import { Request, Response } from "express";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();

// Add this configuration to receive raw body
router.use(express.raw({ type: 'application/json' }));

router.route('/subscription').post(async (request: Request, response: Response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    // request.body is now a Buffer containing the raw request body
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    console.log(err);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      console.log('Processing checkout.session.completed:', checkoutSessionCompleted.id);

      try {
        const stripeUser = await prisma.stripeUser.create({
          data: {
            stripe_id: checkoutSessionCompleted.id,
            is_active: true,
            user_id: checkoutSessionCompleted.client_reference_id,
          },
        });

        if (stripeUser) {
          response.status(200).send('Subscription created successfully');
        } else {
          response.status(400).send('Subscription creation failed');
        }
      } catch (error) {
        response.status(400).send('Subscription creation failed');
        console.log(error);
      }
      break;

    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      console.log('Processing customer.subscription.deleted:', customerSubscriptionDeleted.id);
      await prisma.stripeUser.update({
        where: {
          id: customerSubscriptionDeleted.client_reference_id,
        },
        data: {
          is_active: false,
        },
      });
      break;

    default:
      console.log(`Skipping unhandled event type ${event.type} (Event ID: ${event.id})`);
  }
  response.send();
});

export default router;
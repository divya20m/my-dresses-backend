import express from "express";
import { auth } from '../MiddleWare/auth.js';
import {addToCart,getCartItems,removeFromCart} from "../functions.js";

const router=express.Router()

router.post('/', express.json(), auth, async (req, res) => {
    try {
      const { items } = req.body;
      const email = req.user.email;
      const result = await addToCart(email, items);
  
      res.status(201).json({ message: 'Items added to cart successfully' });
    } catch (error) {
      console.error('Error adding items to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // retrieve cart items

router.get('/', auth, async (req, res) => {
    try {
        const email = req.user.email;
        const userCartItems = await getCartItems(email);
        res.json(userCartItems);
    } catch (error) {
        console.error("Error fetching user's cart items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//deleting the cart id and quantity
router.delete('/:id', auth,async (req, res) => {
    const { id } = req.params;
    const email = req.user.email; 

    try {
        const result = await removeFromCart(email, id);
        res.status(200).json({ message: 'Item deleted from cart successfully' });
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export const cartrouter=router
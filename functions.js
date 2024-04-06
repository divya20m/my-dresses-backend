import { client } from "./index.js";
import bcrypt from "bcrypt"

export async function genPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
   return hashedPassword
}

    export async function createUser(email,hashedPassword) {
        return await client.db("dresses").collection("users-list").insertOne({email:email,password:hashedPassword});
    }

    
    export async function getUsersByEmail(email) {
        return await client.db("dresses").collection("users-list").findOne({email:email});
    }

     
    export async function getAllUsers() {
        return await client.db("dresses").collection("users-list").find().toArray()
    }

    export async function forgotPassword(email) {
        return await client.db("dresses").collection("users-list").findOne({ email })
    }

    export async function getByID(id, token) {
        return await client.db("dresses").collection("users-list").find({ email })
    }

    export async function resetPassword(encryptedPassword, email) {
        return await client.db("dresses").collection("users-list").updateOne(
          { email: email },
          { $set: { password: encryptedPassword } }
        );
      }

      export async function DeleteUsersByEmail(email) {
        return await client.db("dresses").collection("users-list").deleteOne({ email:email })
    }

  ///////////////////////////////////////////////////


  function preprocessRequestBody(items) {
    return items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));
  }
  
  export async function addToCart(email, items) {
    try {
      const processedItems = preprocessRequestBody(items);
      const existingCart = await client.db("dresses").collection("cart").findOne({ email });
  
      if (existingCart) {
        const mergedItems = mergeItems(existingCart.items, processedItems);
        return  await client.db("dresses").collection("cart").updateOne(
          { email },
          { $set: { items: mergedItems } }
        );
      } else {
        const cartItem = {
          email: email,
          items: processedItems
        };
        return await client.db("dresses").collection("cart").insertOne(cartItem);
      }
    } catch (error) {
      throw new Error('Error adding items to cart: ' + error.message);
    }
  }
  function mergeItems(existingItems, newItems) {
    const itemsMap = new Map();
    existingItems.forEach(item => {
      itemsMap.set(item.id, item);
    });
    newItems.forEach(item => {
      const existingItem = itemsMap.get(item.id);
      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        itemsMap.set(item.id, item);
      }
    });
    return Array.from(itemsMap.values());
  }


export async function getCartItems(email) {
    return await client.db("dresses").collection("cart").find({email:email}).toArray();
}

export async function removeFromCart(email, id) {
  return await client.db("dresses").collection("cart").updateOne(
    { email },
    { $pull: { items: { id: id } } }
);
}


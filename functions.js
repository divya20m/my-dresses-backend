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

    export async function getByID(email) {
      return await client.db("dresses").collection("users-list").findOne({ email });
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


  // async function preprocessRequestBody(items) {
  //   const processedItems = [];
  //   for (const item of items) {
  //     const dress = await client.db("dresses").collection("dresses").findOne({ id: item.id });
  //     if (!dress) {
  //       throw new Error(`Dress with ID ${item.id} not found`);
  //     }
  //     processedItems.push({
  //       id: item.id,
  //       quantity: item.quantity || 1 // Default quantity to 1 if not provided
  //     });
  //   }
  //   return processedItems;
  // }
  
  export async function addToCart(email, id) {
    try {
      // const processedItems = await preprocessRequestBody(items);
      // const existingCart = await client.db("dresses").collection("cart").findOne({ email });
  
      // if (existingCart) {
      //   const mergedItems = mergeItems(existingCart.items, processedItems);
      //   await client.db("dresses").collection("cart").updateOne(
      //     { email },
      //     { $set: { items: mergedItems } }
      //   );
      // } else {
      //   const cartItem = {
      //     email: email,
      //     items: processedItems
      //   };
      //   await client.db("dresses").collection("cart").insertOne(cartItem);
      // }

    //   await client.db("dresses").collection("cart").updateOne({ email }, { $set: { id: id } });
    // return { message: id};
    if (!email) {
      return { message: "User not found" };
    } else {
      const existingCartItem = await client.db("dresses").collection("cart").findOne({ email });
      if (!existingCartItem) {
        // If user does not exist in the cart collection, insert a new document with the id in an array
        await client.db("dresses").collection("cart").insertOne({ email, id: [id] });
        return { message: 'Item added to cart successfully' };
      } else {
        // If user exists, check if the id already exists in the array
        if (existingCartItem.id.includes(id)) {
          return { message: 'Item already exists in cart' };
        } else {
          // If the id is not in the array, add it to the array
          await client.db("dresses").collection("cart").updateOne(
            { email },
            { $addToSet: { id: id } } // Use $addToSet to avoid adding duplicate ids
          );
          return { message: 'Item added to cart successfully' };
        }
      }
    }
    } catch (error) {
      throw new Error('Error adding items to cart: ' + error.message)
    }
  }
  
  // function mergeItems(existingItems, newItems) {
  //   const itemsMap = new Map(existingItems.map(item => [item.id, item]));
  //   for (const newItem of newItems) {
  //     const existingItem = itemsMap.get(newItem.id);
  //     if (existingItem) {
  //       existingItem.quantity += newItem.quantity;
  //     } else {
  //       itemsMap.set(newItem.id, newItem);
  //     }
  //   }
  //   return Array.from(itemsMap.values());
  // }

export async function getCartItems(email) {
    return await client.db("dresses").collection("cart").find({email:email}).toArray();
}

export async function removeFromCart(email, id) {
  return await client.db("dresses").collection("cart").updateOne(
    { email },
    { $pull: { items: { id: id } } }
);
}


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

  // Modify the addToCart function to add only the ID to the cart collection
  export async function addToCart(email, id) {
    try {
      const existingCartItem = await client.db("dresses").collection("cart").findOne({ email });
  
      if (!existingCartItem) {
        await client.db("dresses").collection("cart").insertOne({ email, id: [id] });
        return { message: 'Item added to cart successfully' };
      } else {
        if (existingCartItem.id.includes(id)) {
          return { message: 'Item already exists in the cart' };
        } else {
          await client.db("dresses").collection("cart").updateOne(
            { email },
            { $addToSet: { id: id } }
          );
          return { message: 'Item added to cart successfully' };
        }
      }
    } catch (error) {
      throw new Error('Error adding items to cart: ' + error.message)
    }
  }

// get all cart items stored in the email
export async function getCartItems(email) {
  try {
    const cart = await client.db("dresses").collection("cart").findOne({ email });
    if (!cart) {
      return []
    }
    const cartItems = [];
    for (const id of cart.id) {
      const dress = await client.db("dresses").collection("dresses").findOne({ id });
      cartItems.push(dress);
    }

    return cartItems;
  } catch (error) {
    throw new Error('Error fetching cart items: ' + error.message)
  }
}

/// deleting items with thier id
export async function DeletingId(email, id) {
  const existingItem=await client.db("dresses").collection("cart").findOne({id})
  if(existingItem){
  try {
    await client.db("dresses").collection("cart").updateOne(
      { email },
      { $pull: { id: id } } 
    )
    return { message: 'Item deleted from cart successfully' };
  } catch (error) {
    throw new Error('Error deleting item from cart: ' + error.message)
  }}
  else{
    return {message:"Item DoesNot Exist"}
  }
}


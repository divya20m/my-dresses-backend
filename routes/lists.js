import express from "express";
import { getAllLists, GetListsById, deleteListsById, addLists, updateLists } from "../helpers.js";


const router=express.Router()

router.get('/', express.json(), async (req, res) => {
    const { id } = req.params
    const { style, occasion,rating } = req.query;
    console.log({ style, occasion });
    const dress = await getAllLists(req);
    res.send(dress);
});



router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log(req.params, id)
    const product = await GetListsById(id)
    console.log(product)
    res.send(product)
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const dress = await deleteListsById(id);
    console.log(dress);
    res.send(dress);
});


router.post('/', express.json(), async (req, res) => {
    const newlists = req.body;
    const result = await addLists(newlists);
    console.log(result);
    res.send(result);
});


router.put('/:id', express.json(), async (req, res) => {
    const { id } = req.params;
    const lists = req.body;
    const result = await updateLists(id, lists);
    console.log(result);
    res.send(result);
});


export const dressesRouter=router
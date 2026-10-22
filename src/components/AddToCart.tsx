'use client'
import {useState} from 'react'
export type CartItem={id:number|string;name:string;price:number;slug:string;quantity:number}
export function readCart():CartItem[]{try{return JSON.parse(localStorage.getItem('ek-cart')||'[]')}catch{return []}}
export default function AddToCart({item,disabled}:{item:Omit<CartItem,'quantity'>;disabled:boolean}){const [added,setAdded]=useState(false);return <button className="btn" disabled={disabled} onClick={()=>{const cart=readCart();const found=cart.find(x=>x.id===item.id);if(found)found.quantity+=1;else cart.push({...item,quantity:1});localStorage.setItem('ek-cart',JSON.stringify(cart));setAdded(true)}}>{disabled?'Out of stock':added?'Added to Bag ✓':'Add to Bag'}</button>}
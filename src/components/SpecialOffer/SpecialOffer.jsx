import React, { useEffect, useState } from 'react'
import { cardData, additionalData, addButtonBase, addButtonHover, commonTransition } from '../../assets/dummydata';
import { useCart } from '../../CartContext/CartContext';
import { FaFire, FaHeart, FaPlus, FaStar } from 'react-icons/fa';
import { HiMinus, HiPlus } from "react-icons/hi";
import FloatingPaticle from '../FloatingParticle/FloatingPaticle';
import axios from 'axios';

const SpecialOffer = () => {

    const [showAll, setShowAll] = useState(false);
    const [items, setItems] = useState([]);
    const {addToCart, updateQuantity, removeFromCart, cartItems} = useCart();

    //FETCH MENU
    useEffect(() => {
        axios.get('http://localhost:4000/api/items')
        .then(res => setItems(res.data.items ?? res.data))
        .catch(err => console.error(err));
    }, [])

    const displayList = Array.isArray(items) ? items.slice(0, showAll ? 8 : 4) : [];

  return (
    <div className=' bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]'>
      <div className=' max-w-7xl mx-auto'>
        <div className=' text-center mb-14'>
            <h1 className=' text-5xl font-bold mb-4 transform transition-all bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text
             text-transparent font-[Playfair_Display] italic'>
                Today's <span className=' text-stroke-gold'>Special</span> Offers
            </h1>
            <p className=' text-lg text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed'>
                Savor the extraordinary with our culinary masterpieces crafted to perfection. 
            </p>
        </div>

        {/* PRODUCT CARD */}
        <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {displayList.map(item => {
                const cartItem = cartItems.find(ci => ci.item._id === item._id);
                const qty = cartItem ? cartItem.quantity : 0;
                const cartId = cartItem?._id

                return (
                    //w-50  h-72
                    <div key={item._id} className=' relative w-65 group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl
                     transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent
                      hover:border-amber-500/20 before:absolute before:inset-0 hover:before:opacity-20'>

                        <div className=' relative h-45 overflow-hidden'>
                            <img src={item.imageUrl} alt={item.name} className=' w-full h-full object-cover brightness-90 
                            group-hover:brightness-110 transition-all duration-500' />
                            <div className=' absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90' />

                            <div className=' absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40
                             backdrop-blur-sm px-4 py-2 rounded-full' >

                                <span className=' flex items-center gap-2 text-amber-400'>
                                    <FaStar className=' text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' />
                                    <span className=' font-bold'>{item.rating}</span>
                                </span>
                                <span className=' flex items-center gap-2 text-red-400'>
                                    <FaHeart className=' text-xl animate-heartbeat' />
                                    <span className=' font-bold'>{item.hearts}</span>
                                </span>
                             </div>
                        </div>

                        <div className=' p-6 relative z-10'>
                            <h3 className=' text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent
                             font-[Playfair_Display] italic'>
                                {item.name}
                             </h3>
                             <p className=' text-gray-300 mb-5 text-md leading-relaxed tracking-wide'>
                                {item.description}
                             </p>
                             <div className=' flex items-center justify-between gap-4'>
                                <span className=' text-2xl font-bold text-amber-400 flex-1'>
                                    ₹{Number(item.price).toFixed(2)}
                                </span>

                                {qty > 0 ? (
                                    <div className=' flex items-center gap-3'>
                                        <button onClick={() => {
                                            qty > 1 ? updateQuantity(cartId, qty - 1) 
                                            : removeFromCart(cartId)
                                        }} className=' w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center
                                         hover:bg-amber-800/50 transition-all duration-200 active:scale-95'>
                                            <HiMinus className=' w-4 h-4 text-amber-100' />
                                        </button>
                                        <span className=' w-8 text-center text-amber-100 font-cinzel'>
                                            {qty}
                                        </span>

                                        <button onClick={() =>  updateQuantity(cartId, qty + 1)} 
                                         className=' w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center
                                         hover:bg-amber-800/50 transition-all duration-200 active:scale-95'>
                                            <HiPlus className=' w-4 h-4 text-amber-100' />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => addToCart(item, 1)}
                                     className={ `${addButtonBase} ${addButtonHover} ${commonTransition}` }>
                                        <div className=' absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0
                                         hover:opacity-100 transition-opacity duration-300' />
                                         <FaPlus className=' text-lg transition-transform' />
                                         <span className=' relative z-10'>Add</span>
                                    </button>
                                )}
                             </div>
                        </div>

                        <div className=' absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent 
                        group-hover:border-amber-500/30 transition-all duration-500' />
                        <div className=' opacity-0 group-hover:opacity-100'>
                            <FloatingPaticle />
                        </div>
                    </div>
                )
            })}
        </div>

        <div className=' mt-12 flex justify-center'>
            <button onClick={() => setShowAll(!showAll)}
                 className=' flex items-center gap-3 bg-gradient-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl
                  font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20
                   transition-all duration-300 group border-2 border-amber-400/30 relative overflow-hidden'>
                <div className=' absolute inset-0 bg-gradient-to-r fill-amber-500/20 via-transparent to-amber-500/10 opacity-0
                 group-hover:opacity-100 transition-opacity duration-300' />
                 <FaFire className=' text-xl animate-pulse' />
                 <span>{showAll ? 'Show Less' : 'Show More'}</span>
                 <div className=' h-full w-1 bg-amber-400/30 absolute right-0 top-0 group-hover:animate-border-pulse' />
            </button>
        </div>
      </div>
    </div>
  )
}

export default SpecialOffer

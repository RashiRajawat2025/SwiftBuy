import React, { useState, useEffect, type MouseEvent } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { teal } from "@mui/material/colors";
import { Box, Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { isWishlisted } from "../../../../util/isWishlisted";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ChatBot from "../../ChatBot/ChatBot";

interface ProductCardProps {
    item: Product;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    borderRadius: ".5rem",
    boxShadow: 24,
};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    // ✅ The isFavorite state is now used to control the icon's appearance for immediate UI feedback.
    const [isFavorite, setIsFavorite] = useState(false);
    const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showChatBot, setShowChatBot] = useState(false);

    // ✅ This new `useEffect` hook syncs the local `isFavorite` state with the global Redux wishlist state.
    // This ensures the icon is correct when the component first loads or if the wishlist changes from somewhere else.
    useEffect(() => {
        if (wishlist.wishlist) {
            setIsFavorite(isWishlisted(wishlist.wishlist, item));
        }
    }, [wishlist.wishlist, item]);


    const handleAddWishlist = (event: MouseEvent) => {
        event.stopPropagation();
        // This provides an "optimistic update" by changing the icon color immediately.
        setIsFavorite((prev) => !prev);
        // Your original Redux logic remains unchanged.
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    useEffect(() => {
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000); // Change image every 1 second
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);

    const handleShowChatBot = (event: MouseEvent) => {
        event.stopPropagation();
        setShowChatBot(true)
    }
    const handleCloseChatBot = (e: MouseEvent) => {
        e.stopPropagation();
        setShowChatBot(false)
    }

    return (
        <>
            <div
                onClick={() =>
                    navigate(
                        `/product-details/${item.category?.categoryId}/${item.title}/${item.id}`
                    )
                }
                className="group px-4 relative"
            >
                <div
                    className="card "
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {item.images.map((image: any, index: number) => (
                        <img
                            key={index}
                            className="card-media object-top"
                            src={image}
                            alt={`product-${index}`}
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                            }}
                        />
                    ))}
                    {isHovered && (
                        <div className="indicator flex flex-col items-center space-y-2">
                            <div className="flex gap-4">
                                {item.images.map((_item: any, index: number) => (
                                    <button
                                        key={index}
                                        className={`indicator-button ${index === currentImage ? "active" : ""
                                            }`}
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                {wishlist.wishlist && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ zIndex: 10 }}
                                        className=" z-50"
                                        onClick={handleAddWishlist}
                                    >
                                        {/* ✅ The icon now uses the local `isFavorite` state. */}
                                        {isFavorite ? (
                                            <FavoriteIcon sx={{ color: teal[500] }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ color: "gray" }} />
                                        )}
                                    </Button>
                                )}
                                <Button onClick={handleShowChatBot} color="secondary" variant="contained">
                                    <ModeCommentIcon sx={{ color: teal[500] }} />
                                </Button>
                            </div>


                        </div>
                    )}
                </div>
                <div className="details pt-3 space-y-1 group-hover-effect  rounded-md ">
                    <div className="name space-y ">
                        <h1 className="font-semibold text-lg">
                            {item.seller?.businessDetails.businessName}
                        </h1>
                        <p className="">{item.title}</p>
                    </div>
                    <div className="price flex items-center gap-3 ">
                        <span className="font-semibold text-gray-800">
                            {" "}
                            ₹{item.sellingPrice}
                        </span>
                        <span className="text thin-line-through text-gray-400 ">
                            ₹{item.mrpPrice}
                        </span>
                        <span className="text-[#00927c] font-semibold">
                            {item.discountPercent}% off
                        </span>
                    </div>
                </div>

            </div>
            {showChatBot && <section className="absolute left-16 top-0">
                <Modal
                    open={true}
                    onClose={handleCloseChatBot}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <ChatBot handleClose={handleCloseChatBot} productId={item.id} />
                    </Box>
                </Modal>

            </section>}
        </>
    );
};

export default ProductCard;
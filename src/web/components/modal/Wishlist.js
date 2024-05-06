import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Config from '../../../helpers/Config';
import { makeProductShortDescription } from '../../../helpers/ConversionHelper';
import rootAction from '../../../stateManagment/actions/rootAction';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


const Wishlist = (props) => {
    const dispatch = useDispatch();
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const navigate = useNavigate();
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const jsoncustomerWishList = useSelector(state => state.cartReducer.customerWishList);
    const wishListData = JSON.parse(jsoncustomerWishList ?? "[]");
    const wishListCount = wishListData != undefined && wishListData != null ? wishListData.length : 0;


    const handleContinueShopping = () => {
        props.handleWishlist();
        setTimeout(() => {
            navigate('/' + getLanguageCodeFromSession() + '/');
        }, 500);
    }

    const makeEmptyFromWishList = () => {


        localStorage.setItem("customerWishList", '[]');
        dispatch(rootAction.cartAction.setCustomerWishList('[]'));

        props.handleWishlist();

    }


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Wishlist"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])


    return (
        <>

            {
                wishListData != undefined ?
                    <>
                        <div
                            className="modal right fade show shoppingCartModal"
                            style={{
                                display: "block", paddingRight: "16px"
                            }}
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            props.handleWishlist();
                                        }}

                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>

                                    <div className="modal-body">
                                        <h3>
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "My Wish List", "lbl_wishlist_title")
                                                :
                                                "My Wish List"
                                            }

                                            ({wishListCount ?? 0})</h3>

                                        <div className="product-cart-content">

                                            {wishListData?.map((item, idx) => (
                                                <div className="product-cart" key={idx}>
                                                    <div className="product-image">
                                                        <img src={item.DefaultImage != undefined ? (adminPanelBaseURL + item.DefaultImage) : ""} alt="image" />
                                                    </div>

                                                    <div className="product-content">
                                                        <h3>
                                                            <Link to="#">
                                                                {
                                                                    makeProductShortDescription(item.ProductName, 30)
                                                                }

                                                            </Link>
                                                        </h3>
                                                        {/* <span>Blue / XL</span> */}
                                                        <div className="product-price">
                                                            <span>{item.Quantity}</span>
                                                            <span>x</span>
                                                            <span className="price">{GetDefaultCurrencySymbol()}{" "}{item.Price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>

                                        <div className="product-cart-btn">
                                            <Link to="#" className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleContinueShopping();
                                                }}
                                                id="lbl_wishlist_contshop"
                                            >
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Continue Shopping", "lbl_wishlist_contshop")
                                                    :
                                                    "Continue Shopping"
                                                } 
                                            </Link>

                                            <Link to="#" className="btn btn-light"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    makeEmptyFromWishList();
                                                }}
                                                id="lbl_wishlist_clrlist"
                                            >
                                               {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Clear Wishlist", "lbl_wishlist_contshop")
                                                    :
                                                    "Clear Wishlist"
                                                } 
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :

                    <>

                    </>
            }



        </>
    );
}

export default Wishlist










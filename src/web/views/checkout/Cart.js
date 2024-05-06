import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import BestFacilities from '../../components/shared/BestFacilities';
import { useSelector, useDispatch } from 'react-redux';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import rootAction from '../../../stateManagment/actions/rootAction';
import { makePriceRoundToTwoPlaces, makeProductShortDescription } from '../../../helpers/ConversionHelper';
import { Helmet } from 'react-helmet';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const [CartChanged, setCartChangedStatusCount] = useState(0);
    const [CartSubTotal, setCartSubTotal] = useState(0);
    const [ShippingSubTotal, setShippingSubTotal] = useState(0);
    const [OrderTotal, setOrderTotal] = useState(0);
    const [cartProductsData, setCartProductsData] = useState(0);
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [productSelectedAttributes, setProductSelectedAttributes] = useState([]);
    const [showProductVariantsPopup, setShowProductVariantsPopup] = useState(false);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const loginUserDataJson = useSelector(state => state.userReducer.user);
    const loginUser = JSON.parse(loginUserDataJson ?? "{}");

    const cartJsonDataSession = useSelector(state => state.cartReducer.cartItems);
    const cartItemsSession = JSON.parse(cartJsonDataSession ?? "[]");

    const styles = {
        popup: {
            display: showProductVariantsPopup ? "block" : "none",
            paddingRight: '16px'
        }
    };

    // if (loginUser == undefined || loginUser.UserID == undefined || loginUser.UserID < 1) {
    //     navigate('/login');
    // }

    const closeProductVariantPopup = () => {
        setShowProductVariantsPopup(false);
    }


    const handleSubtractQuantity = (ProductId) => {
        let qty = cartProductsData?.find(x => x.ProductId == ProductId).Quantity;
        if (qty > 1) {

            let IndexPrd = cartItemsSession.findIndex((obj => obj.ProductId == ProductId));
            cartItemsSession[IndexPrd].Quantity = ((qty) - 1);

            //--store in storage
            localStorage.setItem("cartItems", JSON.stringify(cartItemsSession));
            //store in redux
            dispatch(rootAction.cartAction.setCustomerCart(JSON.stringify(cartItemsSession)));

            //--update in "cartProductsData"
            let IndexPrdCartProduct = cartProductsData.findIndex((obj => obj.ProductId == ProductId));
            cartProductsData[IndexPrdCartProduct].Quantity = ((qty) - 1);


            //-- set total, sub total, shipping
            setCartTotalSubTotalShippingTotalAfterUpdate();

            //--change the value so that new data uploaded in useEffect
            //setCartChangedStatusCount(CartChanged + 1);
        }
    }

    const handleAddQuantity = (ProductId, OrderMaximumQuantity) => {

        
        let qty = cartProductsData?.find(x => x.ProductId == ProductId).Quantity;

        if (OrderMaximumQuantity != undefined && OrderMaximumQuantity != null && OrderMaximumQuantity > 0) {
            if ((qty + 1) > OrderMaximumQuantity) {
                showErrorMsg(`Can not add more than ${OrderMaximumQuantity} for this product`);
                return false;
            }
        }



        if (qty < 10) {



            let IndexPrd = cartItemsSession.findIndex((obj => obj.ProductId == ProductId));
            cartItemsSession[IndexPrd].Quantity = ((qty) + 1);

            //--store in storage
            localStorage.setItem("cartItems", JSON.stringify(cartItemsSession));
            //store in redux
            dispatch(rootAction.cartAction.setCustomerCart(JSON.stringify(cartItemsSession)));

            //--update in "cartProductsData"
            let IndexPrdCartProduct = cartProductsData.findIndex((obj => obj.ProductId == ProductId));
            cartProductsData[IndexPrdCartProduct].Quantity = ((qty) + 1);

            //-- set total, sub total, shipping
            setCartTotalSubTotalShippingTotalAfterUpdate();

            //--change the value so that new data uploaded in useEffect
            // setCartChangedStatusCount(CartChanged + 1);
        }
    }


    const handleRemove = (ProductId) => {
        
        //--remove from session
        let updatedProductsList = cartItemsSession.filter(item => item.ProductId != ProductId);

        //--store in storage
        localStorage.setItem("cartItems", JSON.stringify(updatedProductsList));
        //store in redux
        dispatch(rootAction.cartAction.setCustomerCart(JSON.stringify(updatedProductsList)));
        dispatch(rootAction.cartAction.SetTotalCartItems(updatedProductsList != undefined && updatedProductsList != null ? updatedProductsList.length : (0)));

        //--remove from "cartProductsData"
        let IndexPrdCartData = cartProductsData.findIndex((obj => obj.ProductId == ProductId));
        if (IndexPrdCartData > -1) {
            cartProductsData.splice(IndexPrdCartData, 1);
        }

        //-- set total, sub total, shipping
        setCartTotalSubTotalShippingTotalAfterUpdate();

        //--change the value so that new data uploaded in useEffect
        setCartChangedStatusCount(CartChanged + 1);
    }

    const setCartTotalSubTotalShippingTotalAfterUpdate = () => {

        if (cartProductsData != undefined && cartProductsData != null && cartItemsSession.length > 0) {

            let CartSubTotalDummy = 0;
            let ShippingSubTotalDummuy = 0;
            let OrderTotalDummu = 0;
            for (let i = 0; i < cartProductsData.length; i++) {

                let itemSubTotal = (cartProductsData[i].DiscountedPrice != undefined && cartProductsData[i].DiscountedPrice != null && cartProductsData[i].DiscountedPrice > 0 ? cartProductsData[i].DiscountedPrice : cartProductsData[i].Price) * (cartProductsData[i].Quantity ?? 1);
                cartProductsData[i].ItemSubTotal = itemSubTotal;
                CartSubTotalDummy = CartSubTotalDummy + itemSubTotal;
                ShippingSubTotalDummuy = ShippingSubTotalDummuy + (cartProductsData[i].ShippingCharges ?? 0);
                OrderTotalDummu = OrderTotalDummu + (itemSubTotal + (cartProductsData[i].ShippingCharges ?? 0));

            }

            setTimeout(() => {

                setCartSubTotal(makePriceRoundToTwoPlaces(CartSubTotalDummy));
                setShippingSubTotal(makePriceRoundToTwoPlaces(ShippingSubTotalDummuy));
                setOrderTotal(makePriceRoundToTwoPlaces(OrderTotalDummu));

            }, 500);
        }
    }

    const viewSelectedAttributesOfCartItem = async (ProductId) => {


        //-- first empty existing data
        setProductSelectedAttributes([]);

        const headersProdAttribte = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }


        const paramProdAttribute = {
            requestParameters: {
                ProductId: ProductId,
                recordValueJson: "[]",
            },
        };


        //--Get product all attributes by product id
        const responseProdAttributes = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PRODUCT_ALL_ATTRIBUTES_BY_ID'], null, paramProdAttribute, headersProdAttribte, "POST", true);
        if (responseProdAttributes != null && responseProdAttributes.data != null && responseProdAttributes.data.data != null) {
            
            let ProductAllAttributes = JSON.parse(responseProdAttributes.data.data);
            let productAttr = cartItemsSession.find(x => x.ProductId == ProductId).productSelectedAttributes;

            let extractedAttributes = [];

            if (productAttr != undefined && productAttr != null) {
                for (let index = 0; index < productAttr.length; index++) {
                    let localRowAttr = productAttr[index];
                    let elementGet = ProductAllAttributes.find(x => x.ProductAttributeID == localRowAttr.ProductAttributeID && x.PrimaryKeyValue == localRowAttr.PrimaryKeyValue);
                    extractedAttributes.push(elementGet);
                }
            }
            setProductSelectedAttributes(extractedAttributes);
            setShowProductVariantsPopup(true);
            console.log(extractedAttributes);
        }



        //--show the popup
    }



    useEffect(() => {
        // declare the data fetching function
        const dataOperationInUseEffect = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }

            // let ProductsIds = [];
            // if (cartItemsSession != undefined && cartItemsSession != null && cartItemsSession.length > 0) {
            //     for (let i = 0; i < cartItemsSession.length; i++) {
            //         ProductsIds.push({
            //             ProductId: cartItemsSession[i].ProductId ?? 0
            //         });
            //     }
            // }


            //--Get cart data
            const paramCart = {
                requestParameters: {
                    cartJsonData: JSON.stringify(cartItemsSession),
                    recordValueJson: "[]",
                },
            };


            const customerCartResponse = await MakeApiCallAsync(Config.END_POINT_NAMES["GET_CUSTOMER_CART_ITEMS"], Config['COMMON_CONTROLLER_SUB_URL'], paramCart, headers, "POST", true);
            if (customerCartResponse != null && customerCartResponse.data != null) {

                let finalData = JSON.parse(customerCartResponse.data.data);
                console.log(finalData);

                if (finalData != null) {
                    setTimeout(() => {

                        setCartProductsData(finalData.productsData);
                        setCartSubTotal(finalData.cartSubTotal);
                        setShippingSubTotal(finalData.shippingSubTotal);
                        setOrderTotal(finalData.orderTotal);

                    }, 500);

                }


            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Cart"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }

        }


        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));


        // call the function
        dataOperationInUseEffect().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [CartChanged])

    return (
        <>
            <Helmet>
                <title>{siteTitle} - cart</title>
                <meta name="description" content={siteTitle + " cart"} />
                <meta name="keywords" content="cart"></meta>
            </Helmet>

            <SiteBreadcrumb title="Cart" />

            <section className="cart-area ptb-60">



                <div className="container">
                    <div className="row">
                        {
                            cartProductsData != undefined && cartProductsData != null && cartProductsData.length > 0
                                ?
                                <>
                                    <div className="col-lg-12 col-md-12">
                                        <form>
                                            <div className="cart-table table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" id="lbl_hdr_cart_prod">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Product", "lbl_hdr_cart_prod")
                                                                    :
                                                                    "Product"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_hdr_cart_name">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Name", "lbl_hdr_cart_name")
                                                                    :
                                                                    "Name"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_hdr_cart_vari">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Variants", "lbl_hdr_cart_vari")
                                                                    :
                                                                    "Variants"
                                                                }
                                                            </th>
                                                            <th scope="col">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Unit Price", "lbl_hdr_cart_price")
                                                                    :
                                                                    "Unit Price"
                                                                }
                                                            </th>
                                                            <th scope="col">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Quantity", "lbl_hdr_cart_qty")
                                                                    :
                                                                    "Quantity"
                                                                }
                                                            </th>
                                                            <th scope="col">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Total", "lbl_hdr_cart_totl")
                                                                    :
                                                                    "Total"
                                                                }
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cartProductsData?.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="product-thumbnail">
                                                                    <Link to="#">
                                                                        <img src={item.ProductImagesJson[0]?.AttachmentURL != undefined ? (adminPanelBaseURL + (item.ProductImagesJson[0].AttachmentURL)) : ""} alt="image" />
                                                                    </Link>
                                                                </td>

                                                                <td className="product-name">

                                                                    <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/category/${item.ProductName}`} >
                                                                        {
                                                                            makeProductShortDescription(item.ProductName, 80)
                                                                        }
                                                                    </Link>


                                                                    <ul>
                                                                        {
                                                                            item.ColorName != undefined && item.ColorName != ""
                                                                                ?
                                                                                <li>Color: <strong>{item.ColorName}</strong></li>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }

                                                                        {
                                                                            item.SizeShortName != undefined && item.SizeShortName != ""
                                                                                ?
                                                                                <li>Size: <strong>{item.SizeShortName}</strong></li>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }

                                                                    </ul>
                                                                </td>
                                                                <td>

                                                                    <Link to="#"
                                                                        className="remove"
                                                                        onClick={() => { viewSelectedAttributesOfCartItem(item.ProductId) }}
                                                                    >
                                                                        <i className="far fa-eye"></i>
                                                                    </Link>

                                                                </td>

                                                                <td className="product-price">
                                                                    <span className="unit-amount">


                                                                        {item.DiscountedPrice != undefined && item.DiscountedPrice > 0 ?
                                                                            <>
                                                                                <del style={{ color: "#9494b9" }}>{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(item.Price)}</del> &nbsp; {GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(item.DiscountedPrice)}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(item.Price)}
                                                                            </>

                                                                        }


                                                                    </span>

                                                                </td>

                                                                <td className="product-quantity">
                                                                    <div className="input-counter">
                                                                        <span
                                                                            className="minus-btn"
                                                                            onClick={() => { handleSubtractQuantity(item.ProductId) }}
                                                                        >
                                                                            <i className="fas fa-minus"></i>
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            value={item.Quantity}
                                                                            min="1"
                                                                            max={10}
                                                                            readOnly={true}
                                                                            onChange={(e) => (e)}
                                                                        />
                                                                        <span
                                                                            className="plus-btn"
                                                                            onClick={(e) => { e.preventDefault(); handleAddQuantity(item.ProductId, item.OrderMaximumQuantity); }}
                                                                        >
                                                                            <i className="fas fa-plus"></i>
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className="product-subtotal">
                                                                    {(() => {


                                                                        let itemSubTotal = (item.DiscountedPrice != undefined && item.DiscountedPrice > 0 ? item.DiscountedPrice : item.Price) * (item.Quantity ?? 1);
                                                                        return (

                                                                            <span className="subtotal-amount">{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(itemSubTotal)}</span>
                                                                        );

                                                                    })()}




                                                                    <Link to="#"
                                                                        className="remove"
                                                                        onClick={(e) => { e.preventDefault(); handleRemove(item.ProductId) }}
                                                                    >
                                                                        <i className="far fa-trash-alt"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="cart-buttons">
                                                <div className="row align-items-center">
                                                    <div className="col-lg-7 col-md-7">
                                                        <div className="continue-shopping-box">
                                                            <Link to={`/${getLanguageCodeFromSession()}/`} className="btn btn-light">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Continue Shopping", "lbl_cart_cont_shop")
                                                                    :
                                                                    "Continue Shopping"
                                                                }
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* <div className="col-lg-5 col-md-5 text-right">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                ref="shipping"
                                                                onChange={this.handleChecked}
                                                            />
                                                            <span>Shipping(+6$)</span>
                                                        </label>
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className="cart-totals">
                                                <h3>
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Cart Totals", "lbl_cart_total")
                                                        :
                                                        "Cart Totals"
                                                    }
                                                </h3>

                                                <ul>
                                                    <li>
                                                     
                                                            {LocalizationLabelsArray.length > 0 ?
                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Subtotal", "lbl_cart_subtotal")
                                                                :
                                                                "Subtotal"
                                                            }
                                                       
                                                        <span>{GetDefaultCurrencySymbol()}{CartSubTotal}</span></li>
                                                    <li>
                                                      
                                                            {LocalizationLabelsArray.length > 0 ?
                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Shipping", "lbl_cart_shipping")
                                                                :
                                                                "Shipping"
                                                            }
                                                       
                                                        <span>{GetDefaultCurrencySymbol()}{ShippingSubTotal}</span></li>
                                                    <li>
                                                        
                                                            {LocalizationLabelsArray.length > 0 ?
                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Total", "lbl_cart_total_2")
                                                                :
                                                                "Total"
                                                            }
                                                       
                                                        <span><b>{GetDefaultCurrencySymbol()}{OrderTotal}</b></span></li>
                                                </ul>

                                                <Link to={`/${getLanguageCodeFromSession()}/checkout`} className="btn btn-light">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Proceed to Checkout", "lbl_cart_proc_check")
                                                        :
                                                        "Proceed to Checkout"
                                                    }
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </>
                                :
                                <>

                                </>
                        }




                    </div>
                </div>
            </section>


            <BestFacilities />



            <div
                className="modal fade sizeGuideModal show" style={styles.popup}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <button type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                closeProductVariantPopup();

                            }}



                            className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">
                                <i className="fas fa-times"></i>
                            </span>
                        </button>

                        <div className="modal-sizeguide">
                            <h3>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Product Variants", "lbl_cart_product_variant")
                                    :
                                    "Product Variants"
                                }
                            </h3>
                            <div className="text-align-left">
                                <ul className="list-group">


                                    {
                                        productSelectedAttributes?.map((item, idx) =>

                                            <li className="list-group-item">
                                                <h3 className="product-variant-title">{item.AttributeDisplayName}</h3>
                                                <div className="form-check form-check-inline"><label className="form-check-label" for="3Processor1">{item.PrimaryKeyDisplayValue}</label></div>

                                            </li>


                                        )}





                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default Cart;

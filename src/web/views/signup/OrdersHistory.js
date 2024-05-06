import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import BestFacilities from '../../components/shared/BestFacilities';
import { useSelector, useDispatch } from 'react-redux';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { checkIfStringIsEmtpy, showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import rootAction from '../../../stateManagment/actions/rootAction';
import { convertDateToDifferentFormats, getFileExtensionFromContentType, makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from '../../../helpers/ConversionHelper';
import { Helmet } from 'react-helmet';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, GetUserIdForHeader, replaceLoclizationLabel, ScrollIntoSpecificDiv } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';
import axios from 'axios';

const OrdersHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const [OrderMasterList, setOrderMasterList] = useState([]);
    const [OrderItemsDetailList, setOrderItemsDetailList] = useState([]);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    //-get login user from session
    const loginUserDataJson = useSelector(state => state.userReducer.user);
    const loginUser = JSON.parse(loginUserDataJson ?? "{}");


    const viewOrderItemsDetails = async (OrderId) => {
        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));


        const headersDetail = {
            // customerid: userData?.UserID,
            // customeremail: userData.EmailAddress,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }


        const paramDetail = {
            requestParameters: {
                OrderId: OrderId,
                recordValueJson: "[]",
            },
        };


        let responseDetailOrderDetail = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CUSTOME_ORDER_HISTORY_DETAIL'], null, paramDetail, headersDetail, "POST", true);
        if (responseDetailOrderDetail != null && responseDetailOrderDetail.data != null) {
            await setOrderItemsDetailList(JSON.parse(responseDetailOrderDetail.data.data));
            console.log(JSON.parse(responseDetailOrderDetail.data.data));
        }


        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

        try {
            ScrollIntoSpecificDiv("order_item_detail", "smooth");
        }
        catch (err) {

            console.log(err.message);
        }


    }
    const downloadDigitalProduct = async (OrderItemID, ProductName) => {

        debugger
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }

      
        let UserID = await GetUserIdForHeader();
        let fileUrl = Config['ADMIN_BASE_URL'] + Config['COMMON_CONTROLLER_SUB_URL'] + Config.END_POINT_NAMES['DOWNLOAD_DIGITAL_FILE'];
        fileUrl = `${fileUrl}/${OrderItemID ?? 0}/${UserID}`;


       const response = await fetch(fileUrl, {
        headers: headers
      });

       const contentType = await response.headers.get('content-type');
       const fileExtension = getFileExtensionFromContentType(contentType);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        let FileName = replaceWhiteSpacesWithDashSymbolInUrl(ProductName);
        FileName = FileName ?? "Your_Digital_Product";
        link.setAttribute('download', (FileName + fileExtension));
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

    }

    useEffect(() => {
        // declare the data fetching function
        const getOrderHistoryMaster = async () => {

            const headers = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    UserId: loginUser.UserID,
                    recordValueJson: "[]",
                },
            };


            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CUSTOMER_ORDER_HISTORY_MASTER'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                await setOrderMasterList(JSON.parse(response.data.data));
                console.log(JSON.parse(response.data.data));
            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["OrdersHistory"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getOrderHistoryMaster().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])



    return (
        <>
            <Helmet>
                <title>{siteTitle} - Orders History</title>
                <meta name="description" content={siteTitle + " Orders History"} />
                <meta name="keywords" content="Orders History"></meta>
            </Helmet>

            <SiteBreadcrumb title="Orders History" />

            <section className="cart-area ptb-60">



                <div className="container">
                    <div className="row">
                        {
                            OrderMasterList != undefined && OrderMasterList != null && OrderMasterList.length > 0
                                ?
                                <>
                                    <div className="col-lg-12 col-md-12">
                                        <form>
                                            <div className="cart-table table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" id="lbl_ordrhis_orderno">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Order Number", "lbl_ordrhis_orderno")
                                                                    :
                                                                    "Order Number"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_orderdte">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Order Date", "lbl_ordrhis_orderdte")
                                                                    :
                                                                    "Order Date"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_orderstatus">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Status", "lbl_ordrhis_orderstatus")
                                                                    :
                                                                    "Status"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_totalitem">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Total Items", "lbl_ordrhis_totalitem")
                                                                    :
                                                                    "Total Items"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_total">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Total", "lbl_ordrhis_total")
                                                                    :
                                                                    "Total"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_detail">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Detail", "lbl_ordrhis_detail")
                                                                    :
                                                                    "Detail"
                                                                }
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {OrderMasterList?.map((item, idx) => (
                                                            <tr key={idx}>


                                                                <td className="product-name"> {item.OrderNumber}</td>
                                                                <td className="product-name"> {convertDateToDifferentFormats(item.OrderDateUTC, 'dd-mm-yyyy')}</td>

                                                                <td className="product-price">
                                                                    <span className="unit-amount">
                                                                        {item.LatestStatusName}

                                                                    </span>

                                                                </td>

                                                                <td>
                                                                    <span> {item.TotalItems}</span>

                                                                </td>

                                                                <td className="product-subtotal">
                                                                    <span className="subtotal-amount">{GetDefaultCurrencySymbol()}{item.OrderTotal}</span>
                                                                </td>
                                                                <td>
                                                                    <Link to="#"
                                                                        className="remove"
                                                                        onClick={() => { viewOrderItemsDetails(item.OrderId) }}
                                                                    >
                                                                        <i className="far fa-eye"></i>
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
                                                            <Link to={`/${getLanguageCodeFromSession()}/`} className="btn btn-light" id="lbl_ordrhis_continue_ship">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Continue Shopping", "lbl_ordrhis_continue_ship")
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

                                            <div id="order_item_detail" className="cart-totals" style={{ maxWidth: "100%" }}>
                                                <h3 id="lbl_ordrhis_cartitm">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Cart Items", "lbl_ordrhis_cartitm")
                                                        :
                                                        "Cart Items"
                                                    }
                                                </h3>

                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" id="lbl_ordrhis_prd">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Product", "lbl_ordrhis_prd")
                                                                    :
                                                                    "Product"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_prdnme">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Free", "lbl_ordrhis_prdnme")
                                                                    :
                                                                    "Name"
                                                                }
                                                            </th>

                                                            <th scope="col" id="lbl_ordrhis_price">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Unit Price", "lbl_ordrhis_price")
                                                                    :
                                                                    "Unit Price"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_qty">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Quantity", "lbl_ordrhis_qty")
                                                                    :
                                                                    "Quantity"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_itmtotal">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Item Total", "lbl_ordrhis_itmtotal")
                                                                    :
                                                                    "Item Total"
                                                                }
                                                            </th>
                                                            <th scope="col" id="lbl_ordrhis_isdigital">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Is Digital Product", "lbl_ordrhis_isdigital")
                                                                    :
                                                                    "Is Digital Product"
                                                                }
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {OrderItemsDetailList?.map((itemDetail, idx) => (
                                                            <tr key={idx} className="table-row-ver-hor-center">
                                                                <td className="product-thumbnail">
                                                                    <Link to="#">
                                                                        <img src={adminPanelBaseURL + itemDetail.DefaultImageUrl} alt="image" width={100} height={90} />
                                                                        {/* <img src="https://localhost:7248//content/commonImages/productImages/811_instagram3.jpg" alt="image" /> */}


                                                                    </Link>
                                                                </td>

                                                                <td className="product-name">{itemDetail.ProductName}</td>

                                                                <td className="product-price">{GetDefaultCurrencySymbol()}{itemDetail.Price}</td>
                                                                <td className="product-quantity">
                                                                    <div className="input-counter">
                                                                        {itemDetail.Quantity}

                                                                    </div>
                                                                </td>
                                                                <td>{(itemDetail.OrderItemTotal)}</td>
                                                                <td>


                                                                    {
                                                                        itemDetail?.IsDigitalProduct != undefined && itemDetail.IsDigitalProduct == true &&
                                                                            (itemDetail.LatestStatusID == Config.ORDER_STATUS["Completed"] || itemDetail.ShippingStatusID == Config.ORDER_STATUS["Completed"]) ?
                                                                            (
                                                                                <Link to="#" className="digital-download-btn"
                                                                                    onClick={() => { downloadDigitalProduct(itemDetail.OrderItemID, itemDetail.ProductName) }}
                                                                                >
                                                                                    Download
                                                                                </Link>
                                                                            )
                                                                            : itemDetail?.IsDigitalProduct == true ? (
                                                                                "Yes (In Progress)"
                                                                            ) : (
                                                                                "No"
                                                                            )
                                                                    }

                                                                </td>
                                                            </tr>
                                                        ))}

                                                    </tbody>
                                                </table>

                                                {/* <Link to="/checkout" className="btn btn-light">
                                                    Proceed to Checkout
                                                </Link> */}
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


        </>
    );
}

export default OrdersHistory;

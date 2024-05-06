
import React, { useEffect, useState } from 'react';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import ProductsGridTypeOne from '../products/ProductsGridTypeOne';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { Link } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


const NewProducts = () => {
    const dispatch = useDispatch();
    const [ProductsList, setProductsList] = useState([]);
    const [ProductListMainClass, setProductListMainClass] = useState("col-lg-3 col-sm-6 col-6");
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [PaginationInfo, setPaginationInfo] = useState({
        PageNo: 1,
        PageSize: 20,
        TotalRecords: 0
    });



    useEffect(() => {
        // declare the data fetching function
        const getNewProductsList = async () => {


            const headers = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    PageNo: PaginationInfo.PageNo,
                    PageSize: PaginationInfo.PageSize,
                    TabName: "new products",
                    recordValueJson: "[]",
                },
            };


            
            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_RECENTS_PRODUCTS_LIST'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                await setProductsList(JSON.parse(response.data.data));
                console.log(JSON.parse(response.data.data));
            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["NewProducts"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getNewProductsList().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])


    return (
        <>



            <section className="products-area pt-60 pb-30">
                <div className="container">
                    <div className="section-title">
                        <div className='row'>
                            <div className='col-6'>
                                <h2 style={{ float: "left" }}><span className="dot"></span>
                                    <span id="lbl_rcntprd_title">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "Recent Products", "lbl_rcntprd_title")
                                            :
                                            "Recent Products"
                                        }
                                    </span>  </h2>
                            </div>
                            <div className='col-6'>
                                <div className="products-view-all">
                                    <Link to={`/${getLanguageCodeFromSession()}/all-products/0/recent-products`} id="lbl_rcntprd_viewall">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "View All", "lbl_popprd_viewall")
                                            :
                                            "View All"
                                        }
                                    </Link>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <ProductsGridTypeOne
                            ProductsList={ProductsList}
                            ProductListMainClass={ProductListMainClass}
                        />



                    </div>
                </div>



            </section>

        </>
    );

}


export default NewProducts;

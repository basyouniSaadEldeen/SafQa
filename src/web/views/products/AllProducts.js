import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import BestFacilities from '../../components/shared/BestFacilities';
import ProductsFilterOptions from '../../components/products/ProductsFilterOptions';
import ProductsGridTypeOne from '../../components/products/ProductsGridTypeOne';
import { SiteLeftSidebarFilter } from '../../components/shared/SiteLeftSidebarFilter';
import SitePagination from '../../components/shared/SitePagination';

import SubscribeNewsLetter from '../../components/shared/SubscribeNewsLetter';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { Helmet } from 'react-helmet';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel, ScrollIntoSpecificDiv } from '../../../helpers/CommonHelper';


const AllProducts = () => {
    const dispatch = useDispatch();
    const search = useLocation().search;
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [RowColCssCls, setRowColCssCls] = useState("col-lg-3 col-md-12");
    const [ProductListMainClass, setProductListMainClass] = useState("col-lg-4 col-sm-6 col-md-4 col-6 products-col-item");
    const [gridClass, setGridClass] = useState("");
    const [ProductsList, setProductsList] = useState([]);
    const [TotalRecords, setTotalRecords] = useState(0);
    const [showPagination, setshowPagination] = useState(false);
    const [PageNo, setPageNo] = useState(1);
    const [PageSize, setPageSize] = useState(9);
    const [OrderByColumnName, setOrderByColumnName] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    //--set product id from url
    const params = useParams();
    let categParamArray = [];
    categParamArray.push(parseInt(params.category_id) ?? 0);
    const [CategoryID, setCategoryID] = useState(categParamArray);


    const [SearchTerm, setSearchTerm] = useState(new URLSearchParams(search).get('SearchTerm'));
    const [SizeID, setSizeID] = useState([]);
    const [ColorID, setColorID] = useState(null);
    const [TagID, setTagID] = useState([]);
    const [ManufacturerID, setManufacturerID] = useState([]);
    const [MinPrice, setMinPrice] = useState(null);
    const [MaxPrice, setMaxPrice] = useState(null);
    const [Rating, setRating] = useState(null);



    const handleGrid = (e) => {

        setGridClass(e);

    }


    const setFilterValueInParent = async (e, value, type) => {

        // e.preventDefault();

        //--intialize variables
        let categoriesIdsCommaSeperated = CategoryID.length > 0 ? CategoryID.join(",") : "";
        let brandsIdsCommaSeperated = ManufacturerID.length > 0 ? ManufacturerID.join(",") : "";
        let sizeIdsCommaSeperated = SizeID.length > 0 ? SizeID.join(",") : "";
        let tagsIdsCommaSeperated = TagID.length > 0 ? TagID.join(",") : "";
        let minPriceLocal = MinPrice;
        let maxPriceLocal = MaxPrice;
        let colorIdLocal = ColorID;
        let ratingLocal = Rating;

    
        if (type == "category") {

            let updatedCategories = [...CategoryID];
            const index = updatedCategories.indexOf(value);

            if (index === -1) {
                updatedCategories.push(value);
            } else {
                updatedCategories.splice(index, 1);
            }
            updatedCategories = updatedCategories.filter((num) => num !== 0);

            await setCategoryID(updatedCategories);
            categoriesIdsCommaSeperated = updatedCategories.join(",");


        } else if (type == "brand") {

            let updatedBrands = [...ManufacturerID];
            const index = updatedBrands.indexOf(value);

            if (index === -1) {
                updatedBrands.push(value);
            } else {
                updatedBrands.splice(index, 1);
            }
            updatedBrands = updatedBrands.filter((num) => num !== 0);

            await setManufacturerID(updatedBrands);
            brandsIdsCommaSeperated = updatedBrands.join(",");


        } else if (type == "size") {

            let updatedSize = [...SizeID];
            const index = updatedSize.indexOf(value);

            if (index === -1) {
                updatedSize.push(value);
            } else {
                updatedSize.splice(index, 1);
            }
            updatedSize = updatedSize.filter((num) => num !== 0);

            await setSizeID(updatedSize);
            sizeIdsCommaSeperated = updatedSize.join(",");


        } else if (type == "price") {

            // setTimeout(() => {
            //     const priceArray = value.split("-");
            //     setMinPrice(priceArray[0]);
            //     setMaxPrice(priceArray[1]);
            // }, 100);

            const priceArray = value.split("-");
            await setMinPrice(priceArray[0]);
            await setMaxPrice(priceArray[1]);

            minPriceLocal = priceArray[0];
            maxPriceLocal = priceArray[1];
          

           

        } else if (type == "color") {

            await setColorID(value);
            colorIdLocal = value;
           

        }
        else if (type == "rating") {

            await setRating(value);
            ratingLocal = value;
            

        } else if (type == "tag") {


            let updatedTags = [...TagID];
            const index = updatedTags.indexOf(value);

            if (index === -1) {
                updatedTags.push(value);
            } else {
                updatedTags.splice(index, 1);
            }
            updatedTags = updatedTags.filter((num) => num !== 0);

            await setTagID(updatedTags);
            tagsIdsCommaSeperated = updatedTags.join(",");

        }

        await getAllProductsAfterAnyFilterChange(1, categoriesIdsCommaSeperated, brandsIdsCommaSeperated, sizeIdsCommaSeperated, minPriceLocal, maxPriceLocal, ratingLocal, tagsIdsCommaSeperated, colorIdLocal, null);

    }

    //--this function called from the ProductsFiltersOption component
    const setPageSizeFromProductFilter = async (e) => {

        setPageSize(parseInt(e.target.value));
        await getAllProductsAfterAnyFilterChange(1, null, null, null, null, null, null, null, null, null);

    }

    const setSortByFilter = async (e) => {

        setOrderByColumnName(parseInt(e.target.value));
        await getAllProductsAfterAnyFilterChange(1, null, null, null, null, null, null, null, null, e.target.value);

    }

    //--this function called from the SitePagination component
    const setCurrentPage = async (pageNumber) => {


        setTimeout(async () => {
            await getAllProductsAfterAnyFilterChange(pageNumber, null, null, null, null, null, null, null, null, null);
        }, 200);



    }

    const getAllProductsAfterAnyFilterChange = async (pageNumber, _categoryId, _manufacturerId, _sizeId,
        _minPrice, _maxPrice, _rating, _tagId, _colorId, _orderByColumnName) => {


        try {


            //--start loader
            dispatch(rootAction.commonAction.setLoading(true));

            await setPageNo(pageNumber);

            let headersFromPage = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            let paramFromPage = {
                requestParameters: {
                    SearchTerm: SearchTerm,
                    SizeID: _sizeId ??  SizeID.join(","),
                    ColorID: _colorId ?? ColorID,
                    CategoryID: _categoryId ?? CategoryID.join(","),
                    TagID: _tagId ??  TagID.join(","),
                    ManufacturerID: _manufacturerId ??  ManufacturerID.join(","),
                    MinPrice: _minPrice ?? MinPrice,
                    MaxPrice: _maxPrice ?? MaxPrice,
                    Rating: _rating ?? Rating,
                    OrderByColumnName: _orderByColumnName ?? OrderByColumnName,
                    PageNo: pageNumber ?? PageNo,
                    PageSize: PageSize,
                    recordValueJson: "[]",
                },
            };

            setshowPagination(false);


            let responseAllProducts = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_All_PRODUCTS'], null, paramFromPage, headersFromPage, "POST", true);
            if (responseAllProducts != null && responseAllProducts.data != null) {

                await setProductsList(JSON.parse(responseAllProducts.data.data));
                let AllProducts = JSON.parse(responseAllProducts.data.data);
                await setTotalRecords(parseInt(AllProducts[0]?.TotalRecords ?? 0))
                console.log(JSON.parse(responseAllProducts.data.data));

                if (AllProducts.length > 0) {
                    await setshowPagination(true);
                }

            }


            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

            //--Scroll to main div
            ScrollIntoSpecificDiv("all_products_main_sec", "smooth");

        }
        catch (error) {

            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

        }






    }



    useEffect(() => {

        const getAllProducts = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    SearchTerm: SearchTerm,
                    SizeID:  SizeID.join(","),
                    ColorID: ColorID,
                    CategoryID: CategoryID.join(","),
                    TagID:  TagID.join(","),
                    ManufacturerID:  ManufacturerID.join(","),
                    MinPrice: MinPrice,
                    MaxPrice: MaxPrice,
                    Rating: Rating,
                    OrderByColumnName: OrderByColumnName,
                    PageNo: PageNo,
                    PageSize: PageSize,
                    recordValueJson: "[]",
                },
            };

            setshowPagination(false);


            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_All_PRODUCTS'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {

                await setProductsList(JSON.parse(response.data.data));
                let AllProducts = JSON.parse(response.data.data);
                await setTotalRecords(parseInt(AllProducts[0]?.TotalRecords ?? 0))
                console.log(JSON.parse(response.data.data));

                if (AllProducts.length > 0) {
                    await setshowPagination(true);
                }

            }


            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["AllProducts"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getAllProducts().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])

    return (
        <>
            <Helmet>
                <title>{siteTitle} - All Products</title>
                <meta name="description" content={siteTitle + " - All Products"} />
                <meta name="keywords" content="All Products"></meta>
            </Helmet>

            <section className="products-collections-area ptb-60" id="all_products_main_sec">
                <div className="container-fluid">
                    <div className="section-title">
                        <h2>
                            <span className="dot"></span><span id="lbl_allprd_allproduct">
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "All Products", "lbl_allprd_allproduct")
                                    :
                                    "All Products"
                                }
                            </span>
                        </h2>
                    </div>

                    <div className="row" >


                        <SiteLeftSidebarFilter
                            RowColCssCls={RowColCssCls}
                            setFilterValueInParent={setFilterValueInParent}

                        />

                        <div className="col-lg-9 col-md-12">

                            <ProductsFilterOptions
                                onClick={(e) => { handleGrid(e); }}
                                setPageSizeFromProductFilter={setPageSizeFromProductFilter}
                                setSortByFilter={setSortByFilter}
                                PageNo={PageNo}
                                PageSize={PageSize}
                                TotalRecords={ProductsList != undefined && ProductsList.length > 0 && ProductsList[0].TotalRecords != undefined && ProductsList[0].TotalRecords != 0 ? ProductsList[0].TotalRecords : 0}
                            />

                            <div id="products-filter" className={`products-collections-listing row ${gridClass}`}>

                                <ProductsGridTypeOne
                                    ProductsList={ProductsList}
                                    ProductListMainClass={ProductListMainClass}

                                />
                            </div>

                            {
                                showPagination == true ?
                                    <SitePagination
                                        TotalRecords={TotalRecords}
                                        CurrentPage={PageNo}
                                        PageSize={PageSize}
                                        setCurrentPage={setCurrentPage}
                                    />

                                    :
                                    <>
                                    </>
                            }


                        </div>



                    </div>






                </div>
            </section>



            <BestFacilities />
            <SubscribeNewsLetter />

        </>
    );

}

export default AllProducts;



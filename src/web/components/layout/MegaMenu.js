import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';


import Partner1Image from '../../resources/themeContent/images/partner1.png';
import Partner2Image from '../../resources/themeContent/images/partner2.png';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { checkIfStringIsEmtpy, showInfoMsg } from '../../../helpers/ValidationHelper';
import LoginUserModal from '../modal/LoginUserModal';
import { makeAnyStringLengthShort, replaceWhiteSpacesWithDashSymbolInUrl } from '../../../helpers/ConversionHelper';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';





const MegaMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchForm, setSearchForm] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [SearchTerm, setSearchTerm] = useState("");
    const [CategoriesList, setCategoriesList] = useState([]);
    const [displayLoginUserModal, setDisplayLoginUserModal] = useState(false);
    const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);
    const [LogoImageFromStorage, setLogoImageFromStorage] = useState("");
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [langCode, setLangCode] = useState('');
    const totalCartItems = useSelector(state => state.cartReducer.totalCartItems);

    const loginUserDataJson = useSelector(state => state.userReducer.user);
    const loginUser = JSON.parse(loginUserDataJson ?? "{}");

    const handleCart = (event) => {
        event.preventDefault();

        if (totalCartItems != null && totalCartItems != null && totalCartItems > 0) {
            navigate('/' + getLanguageCodeFromSession() + '/cart');
        } else {
            showInfoMsg('No item exists in your cart');
        }

    }

    const handleSearchForm = () => {
        setSearchForm(!searchForm);

    }

    const handleOpenCloseLoginUserModal = (event) => {

        event.preventDefault();
        setDisplayLoginUserModal(!displayLoginUserModal);
    }


    const HandleLogout = (e) => {

        localStorage.setItem("user", JSON.stringify('{}'));
        dispatch(rootAction.userAction.setUser('{}'));

        navigate('/', { replace: true });
    }


    const submitSearchForm = () => {

        if (SearchTerm != null && SearchTerm != undefined && SearchTerm.length > 1) {
            let url = "/" + getLanguageCodeFromSession() + "/all-products/0/all-categories?SearchTerm=" + SearchTerm;
            setSearchForm(!searchForm);

            navigate(url, { replace: true });
            window.location.reload();
        }
    }


    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    }

    const navigateOnCategoryClick = (CategoryID, categoryName, e) => {

        CategoryID = CategoryID ?? 0;
        categoryName = categoryName ?? "all-categories"

        let newPageUrl = `/${getLanguageCodeFromSession()}/all-products/${CategoryID}/${replaceWhiteSpacesWithDashSymbolInUrl(categoryName)}`

        window.location.href = newPageUrl;

        // if (pathName.includes("AllProducts")) {
        //     window.location.href = newPageUrl;
        // } else {
        //     navigate(newPageUrl);
        // }

        //  navigate(newPageUrl);



        e.preventDefault();

    }

    useEffect(() => {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
            } else {
                elementId.classList.remove("is-sticky");
            }
        });
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {

        const getDataInUseEffect = async () => {


            //--Get language code
            let lnCode = getLanguageCodeFromSession();
            await setLangCode(lnCode);


            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    PageNo: 1,
                    PageSize: 100,
                    recordValueJson: "[]",
                },
            };

            //--Get categories list
            const categoriesResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CATEGORIES_LIST'], null, param, headers, "POST", true);
            if (categoriesResponse != null && categoriesResponse.data != null) {
                await setCategoriesList(JSON.parse(categoriesResponse.data.data));
                console.log("Header Menu Categories List:");
                console.log(JSON.parse(categoriesResponse.data.data));
            }


            //--Get Website Logo
            if (!checkIfStringIsEmtpy(LogoImageFromStorage)) {

                let paramLogo = {
                    requestParameters: {
                        recordValueJson: "[]",
                    },
                };

                let WebsiteLogoInLocalStorage = "";
                let logoResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_WEBSITE_LOGO'], null, paramLogo, headers, "POST", true);
                if (logoResponse != null && logoResponse.data != null) {
                    console.log(logoResponse.data)

                    if (logoResponse.data.data != "") {
                        let logoData = JSON.parse(logoResponse.data.data);
                        WebsiteLogoInLocalStorage = logoData[0].AppConfigValue;
                        dispatch(rootAction.commonAction.setWebsiteLogo(WebsiteLogoInLocalStorage));
                        setLogoImageFromStorage(WebsiteLogoInLocalStorage);
                    }


                }
            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["MegaMenu"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getDataInUseEffect().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);
    }, [])


    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';



    return (

        <>
            <div className="navbar-area">
                <div id="navbar" className="comero-nav">
                    <div className="container">
                        <nav className="navbar navbar-expand-md navbar-light">
                            <Link to={`/${getLanguageCodeFromSession()}/`} className="navbar-brand">
                                <img src={adminPanelBaseURL + LogoImageFromStorage} width={155} height={41} alt="logo" />
                            </Link>

                            <button
                                onClick={toggleNavbar}
                                className={classTwo}
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="icon-bar top-bar"></span>
                                <span className="icon-bar middle-bar"></span>
                                <span className="icon-bar bottom-bar"></span>
                            </button>

                            <div className={classOne} id="navbarSupportedContent">
                                <ul className="navbar-nav">
                                    {/* <li className="nav-item p-relative">
                                            <Link to="/" className="nav-link active" onClick={e => e.preventDefault()}>
                                                  Home 
                                            </Link>

                                           
                                        </li> */}

                                    <li className="nav-item p-relative">
                                        <Link to={`/${getLanguageCodeFromSession()}/`} className="nav-link active" id="lbl_mgmenu_home">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Home", "lbl_mgmenu_home")
                                                :
                                                "Home"
                                            }
                                        </Link>


                                    </li>

                                    <li className="nav-item p-relative">
                                        <Link to={`/${getLanguageCodeFromSession()}/all-products/0/all-categories`} className="nav-link active" id="lbl_mgmenu_products">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "All Products", "lbl_mgmenu_products")
                                                :
                                                "All Products"
                                            }
                                        </Link>


                                    </li>

                                    {/* <li className="nav-item p-relative">
                                        <Link to="#" className="nav-link active" onClick={e => e.preventDefault()}>
                                            Home <i className="fas fa-chevron-down"></i>
                                        </Link>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item">
                                                <Link to="/" className="nav-link active">
                                                    Home One
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">

                                                    Grocery
                                                    <span className="new">New</span>

                                                </Link>
                                            </li>
                                        </ul>
                                    </li> */}

                                    <li className="nav-item megamenu">
                                        <Link to="#" className="nav-link" onClick={e => e.preventDefault()}>

                                            <span id="lbl_mgmenu_category">
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Categories", "lbl_mgmenu_category")
                                                    :
                                                    "Categories"
                                                }
                                            </span>  <i className="fas fa-chevron-down"></i>

                                        </Link>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item">
                                                <div className="container">
                                                    <div className="row">
                                                        {CategoriesList?.map((item, idx) => {

                                                            if (CategoriesList?.filter(obj => obj.ParentCategoryID == item.CategoryID).length > 0) {

                                                                return (
                                                                    <>
                                                                        <div className="col">
                                                                            <h6 className="submenu-title">

                                                                                {

                                                                                    langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                                        ?
                                                                                        (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                                            ?
                                                                                            makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                                            :
                                                                                            makeAnyStringLengthShort(item.Name, 30)
                                                                                        )

                                                                                        :
                                                                                        makeAnyStringLengthShort(item.Name, 30)
                                                                                }
                                                                            </h6>

                                                                            <ul className="megamenu-submenu">
                                                                                {CategoriesList?.filter(obj => obj.ParentCategoryID == item.CategoryID).map((elementChild, idxChild) => {
                                                                                    let allProductsUrl = "/all-products?CategoryID=" + elementChild.CategoryID;
                                                                                    return (

                                                                                        <>
                                                                                            <li>
                                                                                                <Link to="#"

                                                                                                    onClick={(e) => {
                                                                                                        navigateOnCategoryClick(elementChild.CategoryID, elementChild.Name, e);
                                                                                                    }}
                                                                                                >


                                                                                                    {

                                                                                                        langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                                                            ?
                                                                                                            (elementChild.LocalizationJsonData != null && elementChild.LocalizationJsonData.length > 0
                                                                                                                ?
                                                                                                                makeAnyStringLengthShort(elementChild.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                                                                :
                                                                                                                makeAnyStringLengthShort(elementChild.Name, 30)
                                                                                                            )

                                                                                                            :
                                                                                                            makeAnyStringLengthShort(elementChild.Name, 30)
                                                                                                    }

                                                                                                  
                                                                                                </Link>
                                                                                            </li>
                                                                                        </>);


                                                                                })}


                                                                            </ul>

                                                                        </div>
                                                                    </>
                                                                );
                                                            } else {
                                                                return null;
                                                            }

                                                        })}



                                                        {/* <div className="col">
                                                            <h6 className="submenu-title">Electronics</h6>

                                                            <ul className="megamenu-submenu">
                                                                <li>
                                                                    <Link to="">
                                                                        Fridge
                                                                    </Link>
                                                                </li>

                                                                <li>
                                                                    <Link to="">
                                                                        Air Coolers
                                                                    </Link>
                                                                </li>


                                                            </ul>
                                                        </div> */}


                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>

                                </ul>

                                <div className="others-option">
                                    <div className="option-item">
                                        <i
                                            onClick={handleSearchForm}
                                            className="search-btn fas fa-search"
                                            style={{
                                                display: searchForm ? 'none' : 'block'
                                            }}
                                        ></i>

                                        <i
                                            onClick={handleSearchForm}
                                            className={`close-btn fas fa-times ${searchForm ? 'active' : ''}`}
                                        ></i>

                                        <div
                                            className="search-overlay search-popup"
                                            style={{
                                                display: searchForm ? 'block' : 'none'
                                            }}
                                        >
                                            <div className='search-box'>
                                                <form className="search-form">
                                                    <input className="search-input" name="search" placeholder="Search" type="text"
                                                        value={SearchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                    <button className="search-button" type="button"
                                                        onClick={() => submitSearchForm()}
                                                    >
                                                        <i className="fas fa-search"></i>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="option-item">

                                        {
                                            loginUser != null && loginUser != undefined && loginUser.UserID != undefined && loginUser.UserID > 0
                                                ?
                                                <>
                                                    <Link to="#"
                                                        onClick={(e) => {
                                                            handleOpenCloseLoginUserModal(e);
                                                        }}
                                                    >
                                                        {loginUser.FirstName}

                                                    </Link>


                                                </>
                                                :
                                                <>
                                                    <Link to={`/${getLanguageCodeFromSession()}/login`} id="lbl_mgmenu_login">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Login", "lbl_mgmenu_login")
                                                            :
                                                            "Login"
                                                        }
                                                    </Link>
                                                </>
                                        }


                                    </div>







                                    {
                                        loginUser != null && loginUser != undefined && loginUser.UserID != undefined && loginUser.UserID > 0
                                            ?
                                            <>
                                                <div className="option-item">
                                                    <Link to="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            HandleLogout(e);
                                                        }}
                                                        id="lbl_mgmenu_logout"
                                                    >
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Logout", "lbl_mgmenu_logout")
                                                            :
                                                            "Logout"
                                                        }
                                                    </Link>
                                                </div>


                                            </>
                                            :
                                            <>

                                            </>
                                    }




                                    <div className="option-item">
                                        <Link to="#"
                                            onClick={(e) => {
                                                handleCart(e)
                                            }}
                                        >


                                            <span id="lbl_mgmenu_cart">
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Cart", "lbl_mgmenu_cart")
                                                    :
                                                    "Cart"
                                                }
                                            </span>
                                            ({totalCartItems ?? 0}) <i className="fas fa-shopping-bag"></i>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            {
                loginUser != null && loginUser != undefined && loginUser.UserID != undefined && loginUser.UserID > 0 && displayLoginUserModal
                    ?
                    <LoginUserModal handleOpenCloseLoginUserModal={handleOpenCloseLoginUserModal} />
                    :
                    <>
                    </>
            }

        </>
    );

}

export default MegaMenu;









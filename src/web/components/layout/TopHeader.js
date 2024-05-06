
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel, setLanguageCodeInSession } from '../../../helpers/CommonHelper';
import { makeProductShortDescription } from '../../../helpers/ConversionHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';
import rootAction from '../../../stateManagment/actions/rootAction';
import Wishlist from '../modal/Wishlist';



const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);
    const [langCode, setLangCode] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);



    const handleWishlist = () => {

        setDisplay(!display);

    }

    const handleLangCodeInSession = async (value) => {

        await setLanguageCodeInSession(value);
        await setLangCode(value);
        let homeUrl = '/' + value + '/';
        window.location.href = homeUrl;
        // navigate(homeUrl, { replace: true });
    }


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {
            let lnCode = getLanguageCodeFromSession();
            setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["TopHeader"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])



    return (
        <>
            <div className="top-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 col-md-6">
                            <ul className="top-header-nav">
                                <li>
                                    <Link to={`/${getLanguageCodeFromSession()}/about`} id="lbl_thead_about">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "About", "lbl_thead_about")
                                            :
                                            "About"
                                        }



                                    </Link>
                                </li>
                                {/* <li><Link to="/"><a>Our Stores</a></Link></li> */}
                                <li><Link to={`/${getLanguageCodeFromSession()}/faq`} id="lbl_thead_faq">

                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, " FAQ's", "lbl_thead_faq")
                                        :
                                        "FAQ's"
                                    }

                                </Link></li>
                                <li><Link to={`/${getLanguageCodeFromSession()}/contact-us`} id="lbl_thead_contct">

                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Contact", "lbl_thead_contct")
                                        :
                                        "Contact"
                                    }
                                </Link></li>

                                <li><Link to={`/${getLanguageCodeFromSession()}/become-seller`} id="lbl_thead_seller">

                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Become Seller", "lbl_thead_seller")
                                        :
                                        "Become Seller"
                                    }
                                </Link></li>
                            </ul>
                        </div>

                        <div className="col-lg-5 col-md-6">
                            <ul className="top-header-right-nav">
                                <li>
                                    <Link to="#"
                                        data-toggle="modal"
                                        data-target="#shoppingWishlistModal"
                                        onClick={() => handleWishlist()}
                                    >
                                        <span id="lbl_thead_wishlist">

                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Wishlist", "lbl_thead_wishlist")
                                                :
                                                "Wishlist"
                                            }


                                        </span> <i className="far fa-heart"></i>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link to="/compare">
                                        Compare <i className="fas fa-balance-scale"></i>
                                    </Link>
                                </li> */}
                                <li>
                                    <div className="languages-list">
                                        <select
                                            value={langCode}
                                            onChange={(e) => handleLangCodeInSession(e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="ar">Arabic</option>

                                        </select>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {display ? <Wishlist handleWishlist={handleWishlist} /> : ''}
        </>
    );

}


export default TopHeader;
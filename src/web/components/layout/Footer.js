import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoImage from '../../resources/themeContent/images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import Config from '../../../helpers/Config';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import { checkIfStringIsEmtpy } from '../../../helpers/ValidationHelper';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


const Footer = () => {
    const dispatch = useDispatch();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    //const [LogoImageFromStorage, setLogoImageFromStorage] = useState(useSelector(state => state.commonReducer.websiteLogoInLocalStorage));
    const [LogoImageFromStorage, setLogoImageFromStorage] = useState("");

    useEffect(() => {
        // declare the data fetching function
        const DataOperationFunc = async () => {


            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }

            const param = {
                requestParameters: {
                    recordValueJson: "[]",
                },
            };


            //--Get payment methods
            const responsePaymentMethods = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PAYMENT_METHODS'], null, param, headers, "POST", true);
            if (responsePaymentMethods != null && responsePaymentMethods.data != null) {
                await setPaymentMethods(JSON.parse(responsePaymentMethods.data.data));

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


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        DataOperationFunc().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);


    }, [])


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Footer"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])

    return (
        <>
            <footer className="footer-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="single-footer-widget">
                                <div className="logo">
                                    <Link to={`/${getLanguageCodeFromSession()}/`}>
                                        <img src={adminPanelBaseURL + LogoImageFromStorage} width={155} height={41} alt="logo" />
                                    </Link>
                                </div>

                                <p>Noor Shop is a Multi Vendors eCommerce Web Application built with the help of ASP MVC .NET 6 and React Js. The Admin/Vendor Panel is build with ASP MVC .NET 6 and Front End (Customer Store) is built with React Js plus .NET 6 Rest APIs.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="single-footer-widget">
                                <h3 id="lbl_footr_quicklink">
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Quick Links", "lbl_footr_quicklink")
                                        :
                                        "Quick Links"
                                    }
                                </h3>

                                <ul className="quick-links">
                                    <li>
                                        <Link to={`/${getLanguageCodeFromSession()}/`} id="lbl_footr_home">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Home", "lbl_footr_home")
                                                :
                                                "Home"
                                            }
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/${getLanguageCodeFromSession()}/about`} id="lbl_footr_about">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "About Us", "lbl_footr_about")
                                                :
                                                "About Us"
                                            }
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/${getLanguageCodeFromSession()}/faq`} id="lbl_footr_faq">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, " Faq's", "lbl_footr_faq")
                                                :
                                                " Faq's"
                                            }
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="single-footer-widget">
                                <h3 id="lbl_footr_info">
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Information", "lbl_footr_info")
                                        :
                                        "Information"
                                    }
                                </h3>

                                <ul className="information-links">
                                    <li>
                                        <Link to={`/${getLanguageCodeFromSession()}/about`}>
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "About Us", "lbl_footr_about")
                                                :
                                                "About Us"
                                            }
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/${getLanguageCodeFromSession()}/contact-us`} id="lbl_footr_cont">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Contact Us", "lbl_footr_cont")
                                                :
                                                "Contact Us"
                                            }
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="single-footer-widget">
                                <h3 id="lbl_footr_contact_title">
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Contact Us", "lbl_footr_cont")
                                        :
                                        "Contact Us"
                                    }
                                </h3>

                                <ul className="footer-contact-info">
                                    <li>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span id="lbl_footr_location">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Location:", "lbl_footr_location")
                                                :
                                                "Location:"
                                            }
                                        </span>  3179 Naya Nazimabad Street <br /> Karachi, Pakistan
                                    </li>
                                    <li>
                                        <i className="fas fa-phone"></i>
                                        <span id="lbl_footr_callus">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Call Us:", "lbl_footr_callus")
                                                :
                                                "Call Us:"
                                            }
                                        </span> <Link to="tel:(+123) 456-7898">(+92) 3433219800</Link>
                                    </li>
                                    <li>
                                        <i className="far fa-envelope"></i>
                                        <span id="lbl_footr_emailus">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Email Us:", "lbl_footr_emailus")
                                                :
                                                "Email Us:"
                                            }
                                        </span> <Link to="mailto:support@novine.com">nooruddin.9800@gmail.com</Link>
                                    </li>
                                    <li>
                                        <i className="fas fa-fax"></i>
                                        <span id="lbl_footr_fax">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Fax:", "lbl_footr_fax")
                                                :
                                                "Fax:"
                                            }
                                        </span> <Link to="tel:+123456555">+123456555</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="copyright-area">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6">
                                <p>Copyright &copy; 2023 Noor ECommerce App. All Rights Reserved By <a href="https://web.facebook.com/nashad.mehsud" target="_blank" rel="noopener noreferrer">Noor CodeLogics</a></p>
                            </div>

                            <div className="col-lg-6 col-md-6">
                                <ul className="payment-card">

                                    {
                                        paymentMethods?.map((item, idx) =>


                                            <li key={item.PaymentMethodId}>
                                                <Link to="#">
                                                    <img src={adminPanelBaseURL + item.ImageUrl} alt="image" />
                                                </Link>
                                            </li>

                                        )}



                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );

}


export default Footer;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import Config from '../../../helpers/Config';
import GlobalEnums from '../../../helpers/GlobalEnums';


const BestFacilities = () => {
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [langCode, setLangCode] = useState('');

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {
            let lnCode = getLanguageCodeFromSession();
            setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["BestFacilities"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])


    return (
        <>
            <section className={`facility-area ${langCode == Config.LANG_CODES_ENUM["Arabic"] ? "arabic-content-direction" : ""}`}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-sm-6">
                                <div className="facility-box">
                                    <div className="icon">
                                        <i className="fas fa-plane"></i>
                                    </div>
                                    <h3 id="lbl_facility_freeshipp">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "Free Shipping World Wide", "lbl_facility_freeshipp")
                                            :
                                            "Free Shipping World Wide"
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-sm-6">
                                <div className="facility-box">
                                    <div className="icon">
                                        <i className="fas fa-money-check-alt"></i>
                                    </div>
                                    <h3 id="lbl_facility_moneyback">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "100% money back guarantee", "lbl_facility_moneyback")
                                            :
                                            "100% money back guarantee"
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-sm-6">
                                <div className="facility-box">
                                    <div className="icon">
                                        <i className="far fa-credit-card"></i>
                                    </div>
                                    <h3 id="lbl_facility_pygateway">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "Many payment gatways", "lbl_facility_pygateway")
                                            :
                                            "Many payment gatways"
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="col-lg-3 col-sm-6">
                                <div className="facility-box">
                                    <div className="icon">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <h3 id="lbl_facility_support">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "24/7 online support", "lbl_facility_support")
                                            :
                                            "24/7 online support"
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </>
    );

}


export default BestFacilities;

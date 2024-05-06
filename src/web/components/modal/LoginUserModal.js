import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Config from '../../../helpers/Config';
import { makeProductShortDescription } from '../../../helpers/ConversionHelper';
import rootAction from '../../../stateManagment/actions/rootAction';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


const LoginUserModal = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const loginUserDataJson = useSelector(state => state.userReducer.user);
    const loginUser = JSON.parse(loginUserDataJson ?? "{}");
    const [langCode, setLangCode] = useState('');

    const handleUpdateProfileUrl = (e) => {
        props.handleOpenCloseLoginUserModal(e);
        navigate('/' + getLanguageCodeFromSession() + '/update-profile');
    }

    const handleOrderHistoryUrl = (e) => {
        props.handleOpenCloseLoginUserModal(e);
        navigate('/' + getLanguageCodeFromSession() + '/orders-history');
    }

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            let lnCode = getLanguageCodeFromSession();
            setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["LoginUserModal"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])

    return (
        <>

            <div className={`bts-popup is-visible`} role="alert">
                <div className={`bts-popup-container border-radius-6 ${langCode == Config.LANG_CODES_ENUM["Arabic"] ? "arabic-content-direction" : ""}`}>
                    <h3>Hi {loginUser.FirstName} {loginUser.LastName}</h3>
                    <p id="lbl_loginmodal_performaction">
                        {LocalizationLabelsArray.length > 0 ?
                            replaceLoclizationLabel(LocalizationLabelsArray, "Wants to perform an action", "lbl_loginmodal_performaction")
                            :
                            "Wants to perform an action"
                        }
                    </p>


                    <div className='signup-form'>
                        <Link to="#" className="return-store"
                            onClick={(e) => {
                                e.preventDefault();
                                handleUpdateProfileUrl(e);
                            }}
                            id="lbl_loginmodal_profile"
                        >
                            {LocalizationLabelsArray.length > 0 ?
                                replaceLoclizationLabel(LocalizationLabelsArray, "1. Update Profile", "lbl_loginmodal_profile")
                                :
                                "1. Update Profile"
                            }
                        </Link>
                        <br></br>



                        <Link to="#" className="return-store"
                            onClick={(e) => {
                                e.preventDefault();
                                handleOrderHistoryUrl(e);
                            }}
                            id="lbl_loginmodal_orderhistory"
                        >
                            {LocalizationLabelsArray.length > 0 ?
                                replaceLoclizationLabel(LocalizationLabelsArray, "2. View Order History", "lbl_loginmodal_orderhistory")
                                :
                                "2. View Order History"
                            }
                        </Link>



                    </div>



                    <Link to="#" className="bts-popup-close"
                        onClick={(e) => {
                            props.handleOpenCloseLoginUserModal(e);
                        }}
                    >

                    </Link>
                </div>
            </div>

        </>
    );
}

export default LoginUserModal







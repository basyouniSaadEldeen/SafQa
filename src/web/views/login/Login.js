import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import BestFacilities from '../../components/shared/BestFacilities';
import rootAction from '../../../stateManagment/actions/rootAction';
import Config from '../../../helpers/Config';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import { showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { Helmet } from 'react-helmet';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [Email, setEmail] = useState('sudeshKumar19@noorshop.com');
    const [Password, setPassword] = useState('123456');




    const submitLoginForm = async (event) => {
        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));


        try {

            event.preventDefault();

            let isValid = false;
            let validationArray = [];

            //--validation for email
            isValid = validateAnyFormField('Email', Email, 'email', null, 200, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            //--validation password
            isValid = validateAnyFormField('Password', Password, 'password', null, 30, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            //--check if any field is not valid
            if (validationArray != null && validationArray.length > 0) {

                isValid = false;
                return false;
            } else {
                isValid = true;
            }

            if (isValid) {

                const headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }


                const param = {
                    requestParameters: {
                        Email: Email,
                        Password: Password
                    },
                };




                //--make api call for data operation
                const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_USER_LOGIN'], null, param, headers, "POST", true);
                if (response != null && response.data != null) {
                    let userData = JSON.parse(response.data.data);
                    if (userData.length > 0 && userData[0].ResponseMsg != undefined && userData[0].ResponseMsg == "Login Successfully") {
                        showSuccessMsg("Login successfully!");

                        //--save user data in session
                        localStorage.setItem("user", JSON.stringify(userData[0]));
                        dispatch(rootAction.userAction.setUser(JSON.stringify(userData[0])));

                        //--set Token in local storage
                        localStorage.setItem("Token", response.data.token ?? "");

                        navigate('/' + getLanguageCodeFromSession() + '/');

                    } else {
                        showErrorMsg("Incorrect email or password!");
                        return false;
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            showErrorMsg("An error occured. Please try again!");

            //--empty existing user data if set at some level in above line of code
            localStorage.setItem("user", '{}');
            dispatch(rootAction.userAction.setUser('{}'));

            return false;
        } finally {
            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

        }


    }

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Login"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])


    return (
        <>
            <Helmet>
                <title>{siteTitle} - Login</title>
                <meta name="description" content={siteTitle + " - Login"} />
                <meta name="keywords" content="Login"></meta>
            </Helmet>

            <SiteBreadcrumb title="Login" />

            <section className="login-area ptb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="login-content">
                                <div className="section-title">
                                    <h2>
                                        <span className="dot"></span>
                                        <span id="lbl_login_title">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Login", "lbl_login_title")
                                                :
                                                "Login"
                                            }
                                        </span>
                                    </h2>
                                </div>

                                <form className="login-form" onSubmit={submitLoginForm}>
                                    <div className="form-group">
                                        <label>
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Email", "lbl_login_email")
                                                :
                                                "Email"
                                            }
                                        </label>
                                        <input type="email" className="form-control" placeholder="Enter your email" id="name" name="name"
                                            required={true}
                                            value={Email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, "Password", "lbl_login_password")
                                                :
                                                "Password"
                                            }
                                        </label>
                                        <input type="password" className="form-control" placeholder="Enter your password" id="password" name="password"
                                            required={true}
                                            value={Password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary" id="lbl_login_loginbtn">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "Login", "lbl_login_loginbtn")
                                            :
                                            "Login"
                                        }
                                    </button>

                                    <Link to={`/${getLanguageCodeFromSession()}/reset-password`} className="forgot-password">
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "Lost your password?", "lbl_login_lostpass")
                                            :
                                            "Lost your password?"
                                        }

                                    </Link>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="new-customer-content">
                                <div className="section-title">
                                    <h2><span className="dot"></span>
                                        <span id="lbl_login_newcustomer">
                                            {LocalizationLabelsArray.length > 0 ?
                                                replaceLoclizationLabel(LocalizationLabelsArray, " New Customer", "lbl_login_newcustomer")
                                                :
                                                " New Customer"
                                            }
                                        </span>
                                    </h2>
                                </div>

                                <span>
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Create an Account", "lbl_login_createacnt")
                                        :
                                        "Create an Account"
                                    }
                                </span>
                                <p id="lbl_login_inst_singup">
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Sign up for a free account at our store. Registration is quick and easy. It allows you to be able to order from our shop. To start shopping click register.", "lbl_login_inst_singup")
                                        :
                                        "Sign up for a free account at our store. Registration is quick and easy. It allows you to be able to order from our shop. To start shopping click register."
                                    }
                                </p>
                                <Link to={`/${getLanguageCodeFromSession()}/signup`} className="btn btn-light" id="lbl_login_createacnt_2">
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Create an Account", "lbl_login_createacnt_2")
                                        :
                                        "Create an Account"
                                    }

                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BestFacilities />


        </>
    );
}

export default Login;
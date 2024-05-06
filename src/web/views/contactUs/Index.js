import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MakeApiCallSynchronous , MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import BestFacilities from '../../components/shared/BestFacilities';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { reduxStore } from '../../../stateManagment/reduxStore';
import { Helmet } from 'react-helmet';
import { GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';

const ContactUs = () => {
  const dispatch = useDispatch();
  const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
  const [FullName, setFullName] = useState('');
  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Subject, setSubject] = useState('');
  const [Message, setMessage] = useState('');


  const handleContactUsForm = async (event) => {
    event.preventDefault();

    try {


         //--start loader
         dispatch(rootAction.commonAction.setLoading(true));


      let isValid = false;
      let validationArray = [];


      isValid = validateAnyFormField('Name', FullName, 'text', null, 200, true);
      if (isValid == false) {
        validationArray.push({
          isValid: isValid
        });
      }


      isValid = validateAnyFormField('Email', Email, 'email', null, 100, true);
      if (isValid == false) {
        validationArray.push({
          isValid: isValid
        });
      }

      isValid = validateAnyFormField('Phone Number', PhoneNumber, 'text', null, 20, true);
      if (isValid == false) {
        validationArray.push({
          isValid: isValid
        });
      }

      isValid = validateAnyFormField('Subject', Subject, 'text', null, 150, true);
      if (isValid == false) {
        validationArray.push({
          isValid: isValid
        });
      }

      isValid = validateAnyFormField('Message', Message, 'text', null, 2000, true);
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
            FullName: FullName,
            Email: Email,
            PhoneNumber: PhoneNumber,
            Subject: Subject,
            Message: Message

          },
        };


        //--make api call for data operation
        const response = await MakeApiCallAsync(Config.END_POINT_NAMES['CONTACT_US'], null, param, headers, "POST", true);
        if (response != null && response.data != null) {
          let userData = JSON.parse(response.data.data);
          if (userData.length > 0 && userData[0].ResponseMsg != undefined && userData[0].ResponseMsg == "Saved Successfully") {
            showSuccessMsg("Message sent successfully!");

            //--Empty form fields
            setFullName('');
            setEmail('');
            setPhoneNumber('');
            setSubject('');
            setMessage('');

          }
          else {
            showErrorMsg("An error occured. Please try again!");
            return false;
          }
        }
      }



    } catch (err) {
      console.log(err);
      showErrorMsg("An error occured. Please try again!");

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
    const dataOperationInUseEffect= async () => {
      
        let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Index_Contact_Us"], null);
        if(arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0){
          await replaceLoclizationLabel(arryRespLocalization);
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
}, [])


  return (
    <>

      <Helmet>
        <title>{siteTitle} - Contact Us</title>
        <meta name="description" content={siteTitle + " - Contact Us"} />
        <meta name="keywords" content="Contact Us"></meta>
      </Helmet>

      <SiteBreadcrumb title="Contact Us" />

      <section className="contact-area ptb-60">
        <div className="container">
          <div className="section-title">
            <h2><span className="dot"></span> <span id="lbl_contactus_title"> Contact Us</span></h2>
          </div>

          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="contact-info">
                <h3 id="lbl_contact_here_help">Here to Help</h3>
                <p>Have a question? You may find an answer in our FAQs. But you can also contact us.</p>

                <ul className="contact-list">
                  <li><i className="fas fa-map-marker-alt"></i><span id="lbl_cont_location">Location:</span>  3179 Naya Nazimabad Streed Karachi, Pakistan</li>
                  <li><i className="fas fa-phone"></i><span id="lbl_cont_callus">Call Us:</span>  <a href="#">(+92) 3433219800</a></li>
                  <li><i className="far fa-envelope"></i><span id="lbl_cont_email">Email Us:</span>  <a href="#">nooruddin.9800@gmail.com</a></li>
                  <li><i className="fas fa-fax"></i><span id="lbl_cont_fax">Fax:</span>  <a href="#">+123456</a></li>
                </ul>

                <h3>Opening Hours:</h3>
                <ul className="opening-hours">
                  <li><span id="lbl_cont_mon">Monday:</span> <span>8AM - 6AM</span> </li>
                  <li><span id="lbl_cont_tues">Tuesday:</span> <span>8AM - 6AM</span></li>
                  <li><span id="lbl_cont_wed">Wednesday:</span><span>8AM - 6AM</span></li>
                  <li><span id="lbl_cont_thurs">Thursday:</span> <span>8AM - 6AM</span></li>
                  <li><span id="lbl_cont_frid">Friday:</span> <span>8AM - 6AM</span></li>
                  <li><span id="lbl_cont_sat">Saturday:</span> Closed</li>
                  <li><span id="lbl_cont_sund">Sunday:</span> Closed</li>
                </ul>

                <h3>Follow Us:</h3>
                <ul className="social">
                  <li>
                    <Link to="#"><i className="fab fa-facebook-f"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-twitter"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-instagram"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-behance"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-skype"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-pinterest-p"></i></Link>
                  </li>
                  <li>
                    <Link to="#"><i className="fab fa-youtube"></i></Link>
                  </li>

                </ul>
              </div>
            </div>

            <div className="col-lg-7 col-md-12">
              <div className="contact-form">
                <h3 id="lbl_cont_drop_us">Drop Us A Line</h3>
                <p>We’re happy to answer any questions you have or provide you with an estimate. Just send us a message in the form below with any questions you may have.</p>

                <form id="contactForm" onSubmit={handleContactUsForm}>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label id="lbl_cont_form_name">Name <span className='required-field'>*</span></label>
                        <input type="text" name="FullName" id="FullName" className="form-control"
                          required={true}
                          data-error="Please enter your name"
                          placeholder="Enter your name"
                          value={FullName}
                          onChange={(e) => setFullName(e.target.value)}

                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label id="lbl_cont_form_email">Email <span className='required-field'>*</span></label>
                        <input type="email" name="Email" id="Email" className="form-control" required={true}
                          data-error="Please enter your email"
                          placeholder="Enter your Email Address"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}

                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label id="lbl_cont_form_phon">Phone Number <span className='required-field'>*</span></label>
                        <input type="text" name="PhoneNumber" id="PhoneNumber" className="form-control"
                          required={true}
                          data-error="Please enter your phone number"
                          placeholder="Enter your Phone Number"
                          value={PhoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}

                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label id="lbl_cont_form_subj">Subject <span className='required-field'>*</span></label>
                        <input type="text" name="Subject" id="Subject" className="form-control"
                          required={true}
                          data-error="Please enter subject"
                          placeholder="Enter subject here"
                          value={Subject}
                          onChange={(e) => setSubject(e.target.value)}

                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label id="lbl_cont_form_msg">Your Message <span className='required-field'>*</span></label>
                        <textarea name="Message" id="message" cols="30" rows="8"
                          required={true}
                          data-error="Please enter your message"
                          className="form-control"
                          placeholder="Enter your Message"
                          value={Message}
                          onChange={(e) => setMessage(e.target.value)}

                        />
                        <div className="help-block with-errors"></div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <button type="submit" className="btn btn-primary" id="lbl_cont_btn_sndmsg">Send Message</button>
                      <div id="msgSubmit" className="h3 text-center hidden"></div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BestFacilities />

    </>
  );

}

export default ContactUs;

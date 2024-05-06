
import { MakeApiCallAsync } from "./ApiHelpers";
import Config from "./Config";
import { checkIfStringIsEmtpy } from "./ValidationHelper";

export const RedirectToWhatsAppPage = () => {
    window.open('https://wa.me/923128545494', '_blank');
}



export const GetDefaultCurrencySymbol = () => {
    let DefaultCurrencySymbol = "$";  //--USD is consider as default if there is no setting in appsetting.json file
    DefaultCurrencySymbol = Config.APP_SETTING['DefaultCurrencySymbol'] ?? "$";
    return DefaultCurrencySymbol;


}

export const GetDefaultCurrencyCode = () => {
    let DefaultCurrencyCode = "USD";  //--USD is consider as default if there is no setting in appsetting.json file
    DefaultCurrencyCode = Config.APP_SETTING['DefaultCurrencyCode'] ?? "USD";
    return DefaultCurrencyCode;


}



export const GetTokenForHeader = async () => {


    try {
        let Token = "";

        let tokenFromStorage = localStorage.getItem("Token");

        if (tokenFromStorage != null && tokenFromStorage != undefined && tokenFromStorage != "") {

            Token = tokenFromStorage;
        }
        return Token;
    }
    catch (err) {
        console.error(err.message);
        return "";
    }

}

export const GetUserIdForHeader = async () => {


    try {
        let UserID = "";

        let loginUserDataJson = localStorage.getItem("user");
        const loginUser = JSON.parse(loginUserDataJson ?? "{}");

        if (loginUser != null && loginUser != undefined && loginUser != "") {

            UserID = loginUser.UserID;
        }
        return UserID;
    }
    catch (err) {
        console.error(err.message);
        return "";
    }

}

export const setLanguageCodeInSession = async (LangCode) => {


    try {
        let lCode = LangCode ?? "en";
        localStorage.setItem("langCode", lCode);
    }
    catch (err) {
        console.error(err.message);
    }

}

export const getLanguageCodeFromSession = () => {
    let langCode = "en";

    try {
        langCode = localStorage.getItem("langCode");
    }
    catch (err) {
        console.error(err.message);
    }
    if (!checkIfStringIsEmtpy(langCode)) {
        return ("en");
    } else {
        return (langCode);
    }

}

export const GetLocalizationControlsJsonDataForScreen = async (entityId, htmlElementId = null) => {

    let responseArray = [];


    try {

        let languageCode = getLanguageCodeFromSession();


        if (languageCode == undefined || languageCode == null || languageCode == "") {
            return responseArray;
        }

        if (languageCode == "en") { //-- do not perform localization for english
            return responseArray;
        }

        if (entityId == undefined || entityId == null || entityId == "" || entityId < 1) {
            return responseArray;
        }

        const headerLocalization = {
            Accept: 'application/json',
            'Content-Type': 'application/json',

        }


        const paramLocalization = {
            requestParameters: {
                entityId: entityId,
                languageCode: languageCode,
                recordValueJson: "[]",
            },
        };



        const localizationResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_LOCALIZATION_CSTM_PORTAL'], Config['COMMON_CONTROLLER_SUB_URL'], paramLocalization, headerLocalization, "POST", true);
        if (localizationResponse != null && localizationResponse.data != null) {

            let finalData = JSON.parse(localizationResponse.data.data);
            responseArray = finalData.labelsJsonData;

        }

    } catch (error) {
        console.log(error.message);

    }
    return responseArray;
}


export const replaceLoclizationLabel = (labelsJsonData, defaultTxt, labelHtmlId) => {

    let labelTxt = "";
    try {


        if (labelsJsonData == null || labelsJsonData == undefined || labelsJsonData.length == 0) {
            return (defaultTxt);
        }

        let foundObj = labelsJsonData.find(elem => elem.labelHtmlId === labelHtmlId);
        labelTxt = !checkIfStringIsEmtpy(foundObj?.text) === true ? defaultTxt : foundObj?.text;
    }
    catch (err) {
        console.error(err.message);
        labelTxt = defaultTxt;
    }

    return (labelTxt);


    // try {
    //     if (htmlElementId == null || htmlElementId == undefined) { //-- if htmlElementId is null, then its mean to run for whole body
    //         for (let itm = 0; itm <= labelsJsonData.length - 1; itm ++) {
    //             let htmlElement = document.getElementById(labelsJsonData[itm].labelHtmlId);
    //             if (htmlElement != null && htmlElement != undefined && checkIfStringIsEmtpy(labelsJsonData[itm].text)) {
    //                 let labelHtmlId = labelsJsonData[itm].labelHtmlId;
    //                 document.getElementById(labelHtmlId).innerHTML = labelsJsonData[itm].text;
    //             }
    //         }
    //     }
    //     else {//--if htmlElementId param is not null then only check localization for this specific html tag

    //         let parentElement = document.getElementById(htmlElementId);

    //         for (let itm = 0; itm <= labelsJsonData.length - 1; itm++) {
    //             let htmlElement = document.getElementById(labelsJsonData[itm].labelHtmlId);
    //             if (htmlElement != null && htmlElement != undefined && checkIfStringIsEmtpy(labelsJsonData[itm].text) && parentElement.contains(htmlElement)) {
    //                 let labelHtmlId = labelsJsonData[itm].labelHtmlId;
    //                 document.getElementById(labelHtmlId).innerHTML = labelsJsonData[itm].text;
    //             }
    //         }
    //     }
    // }
    // catch (err) {
    //     console.error(err.message);

    // }

}


export const ScrollIntoSpecificDiv = (divId, behaviorParam) => {
    try {
        document.getElementById(divId).scrollIntoView({
            behavior: behaviorParam ?? 'smooth',
            // block: 'center',
            // inline: 'start'
        });
      } catch (error) {
        console.error("An error occurred:", error);
      }
}



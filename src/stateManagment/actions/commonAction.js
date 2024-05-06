import * as actionType from '../actionTypes';

const setLoading = (loading) => {
    return {
        type: actionType.SET_LOADING,
        loading
    }
}

const setWebsiteLogo = (webLogo) => {
    return {
        type: actionType.SET_WEBSITE_LOGO,
        payload: webLogo
    }
}
const setLangCodeInRedux = (langCode) => {
    return {
        type: actionType.SET_LANGUAGE_CODE,
        payload: langCode
    }
}

export default {
    setLoading,
    setWebsiteLogo,
    setLangCodeInRedux
}
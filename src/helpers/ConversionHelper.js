import React from 'react';
import Config from './Config';

export const makeProductShortDescription = (inputString, length) => {

    length = parseInt(length) ?? 50;

    if (inputString != undefined && inputString != null && inputString.length > 0) {
        let newString = inputString.length > length ? (inputString.substring(0, length) + '...') : (inputString.substring(0, length))
        return newString;
    } else {
        return "";
    }

}

export const makeAnyStringLengthShort = (inputString, length) => {

    length = parseInt(length) ?? 50;

    if (inputString != undefined && inputString != null && inputString.length > 0) {
        let newString = inputString.length > length ? (inputString.substring(0, length) + '...') : (inputString.substring(0, length))
        return newString;
    } else {
        return "";
    }


}


export const replaceWhiteSpacesWithDashSymbolInUrl = (inputString) => {
    if (inputString != undefined && inputString != null && inputString.length > 0) {

        //--replace extra space with one space
        let newString = inputString.replace(/\s\s+/g, ' ');

        //--replace space with '-' character
        newString = newString.replace(/\s+/g, '-').toLowerCase();

        //--replace '/' with '-' character
        return newString.replaceAll('/', '-').toLowerCase();

    } else {
        return inputString;
    }
}

export const convertDateToDifferentFormats = (inputDate, format) => {
    let formattedDate = inputDate;

    if (inputDate == undefined || inputDate == null || inputDate == "") {
        return formattedDate;
    }

    if (format == "dd/mm/yyyy") {
        let today = new Date(inputDate);
        let yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        formattedDate = dd + '/' + mm + '/' + yyyy;
    } else if (format == "dd-mm-yyyy") {
        let today = new Date(inputDate);
        let yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        formattedDate = dd + '-' + mm + '-' + yyyy;
    } else {
        let today = new Date(inputDate);
        let yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        formattedDate = dd + '-' + mm + '-' + yyyy;
    }

    return formattedDate;
}


export const makePriceRoundToTwoPlaces = (price) => {
    price = price ?? 0;
    return +(Math.round(price + "e+2") + "e-2");

}

export const setProductDescriptionImagesUrl = (FullDescription) => {

    try {
        if (FullDescription != undefined && FullDescription != null && FullDescription != '') {
            if (FullDescription.includes('<img src="/content/commonImages/')) {
                let adminPanelBaseURL = Config['ADMIN_BASE_URL'];
                let replaceText = '<img src="' + adminPanelBaseURL + "content/commonImages/";
                FullDescription = FullDescription.replace('<img src="/content/commonImages/', replaceText);
            }

        }
    }
    catch (err) {
        console.log(err.message);
    }

    return FullDescription;

}


export const getFileExtensionFromContentType=(contentType) => {
    switch (contentType) {
      case "application/pdf":
        return ".pdf";
      case "application/msword":
        return ".doc";
      case "application/vnd.ms-excel":
        return ".xls";
      case "application/vnd.ms-powerpoint":
        return ".ppt";
      case "image/jpeg":
        return ".jpg";
      case "image/png":
        return ".png";
      case "image/bmp":
        return ".bmp";
      case "image/gif":
        return ".gif";
      case "text/plain":
        return ".txt";
      case "text/csv":
        return ".csv";
      case "text/html":
        return ".html";
      case "application/zip":
        return ".zip";
      case "application/x-rar-compressed":
        return ".rar";
      case "application/x-7z-compressed":
        return ".7z";
      case "application/x-tar":
        return ".tar";
      case "application/gzip":
        return ".gz";
      case "audio/mpeg":
        return ".mp3";
      case "audio/wav":
        return ".wav";
      case "audio/ogg":
        return ".ogg";
      case "video/mp4":
        return ".m4v";
      case "video/x-msvideo":
        return ".avi";
      case "video/x-ms-wmv":
        return ".wmv";
      case "video/x-flv":
        return ".flv";
      case "video/quicktime":
        return ".mov";
      case "video/x-matroska":
        return ".mkv";
      case "application/illustrator":
        return ".ai";
      case "application/postscript":
        return ".eps";
      case "image/vnd.adobe.photoshop":
        return ".psd";
      case "application/x-indesign":
        return ".indd";
      case "image/svg+xml":
        return ".svg";
      case "text/javascript":
        return ".js";
      case "text/css":
        return ".css";
      case "application/json":
        return ".json";
      case "application/xml":
        return ".xml";
      default:
        return "application/octet-stream";
    }
  }
  


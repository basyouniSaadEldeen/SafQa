import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLanguageCodeFromSession } from '../../../helpers/CommonHelper';



const SiteBreadcrumb = (props) => {

    return (
        <>
            <div className="page-title-area">
                <div className="container">
                    <ul>
                        <li>
                            <Link to={`/${getLanguageCodeFromSession()}/`}>
                                <a>Home</a>
                            </Link>
                        </li>
                        <li>{props.title}</li>
                    </ul>
                </div>
            </div>
        </>
    );

}

export default SiteBreadcrumb;
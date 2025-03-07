"use client"

import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function Analytics() {
    useEffect(() => {
        if(!ReactGA.isInitialized) {
            ReactGA.initialize('G-D7QR2BL0BT');
        }

        ReactGA.send({
            hitType: 'pageview',
            page: location.pathname,
        });
    }, []);

    return <></>;
}
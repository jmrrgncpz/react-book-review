import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface SpinnerProps {
    size?: SizeProp,
    className?: string
}

export default function Spinner({ size, className}: SpinnerProps) {
    return (
        <FontAwesomeIcon spin icon={faSpinner} size={size || '1x'} className={className} />
    )
}
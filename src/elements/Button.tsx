import React from "react";

enum ButtonType {
    primary = 1,
    secondary = 2,
    success = 3,
    danger = 4,
    warning = 5    
}

enum ButtonAppearance {
    filled = 1,
    outlined = 2,
    ghost = 3
}

interface Props {
    type?: ButtonType,
    appearance?: ButtonAppearance
}

const Button: React.FC<Props> = ({ children, type, appearance}) =>{
    return (
        <button
            className="
            bg-primary 
            py-2 px-8 
            rounded 
            font-bold text-white 
            shadow
            ">
         {children}
        </button>
    )
}

export default Button;


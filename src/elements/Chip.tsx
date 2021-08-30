import React from "react";

interface ChipProps {
    className?: string
}

const Chip: React.FC<ChipProps> = ({ children, className }) => {
    return (
        <p className={['px-4 py-1 bg-primary text-white rounded-full shadow text-xs inline whitespace-nowrap', className].join(' ')}>
            { children }
        </p>   
    )
}

export default Chip;
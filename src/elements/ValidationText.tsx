import React from 'react';

interface ValidationTextProps { 
    text: string;
}

export default function ValidationText({ text }: ValidationTextProps) {
    return (
        <span className="text-danger text-xs">{ text }</span>
    )
}
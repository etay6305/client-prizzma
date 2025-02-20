import React from 'react';

interface Props {
    className: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    type: string;
    value: string | number;
    placeHolder: string; 
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; 
}

const GenericSideButton: React.FC<Props> = (props) => {
    const { className, onChange, type, value, placeHolder, onKeyDown } = props;

    return (
        <input className = {className}
        onChange = {onChange}
        type = {type}
        value = {value}
        placeholder = {placeHolder}
        onKeyDown = {onKeyDown}
        />
    )
}

export default GenericSideButton;

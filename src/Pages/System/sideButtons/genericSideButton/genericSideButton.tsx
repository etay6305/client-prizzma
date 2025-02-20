import React from 'react';

interface Props {
    className: string;
    onClick: () => void;
}

const GenericSideButton: React.FC<Props> = (props) => {
    const { className, onClick } = props;

    return (
        <button
        className={className}
        onClick={onClick}
      >
        +
      </button>
    )
}

export default GenericSideButton;

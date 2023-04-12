import React from "react"

const Button = ({ name, onClick, color }) => {
    return (
        <button
            className={`text-${color}-600 py-2 px-4 rounded-md font-medium border-2 border-${color}-600`}
            onClick={onClick}
            >
            {name}
            </button>
    )
}

export default Button;
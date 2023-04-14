import React from "react"
import Link from "next/link";
const Button = ({ name, onClick, color, templateId }) => {
    return (
        <Link
            className={`text-${color}-600 py-2 px-4 rounded-md font-medium border-2 border-${color}-600`}
            // onClick={onClick}
            href={`/templates/${templateId}`}
            >
            {name}
            </Link>
    )
}

export default Button;
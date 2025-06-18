import { Link } from "react-router-dom";

const LinkSection = ({ linkToSection }) => {

    const { id, text } = linkToSection;

    return (
        <Link
            to={`#${id}`}
            onClick={(e) => {
                e.preventDefault();
                document.getElementById(id).scrollIntoView({
                    behavior: 'smooth'
                });
            }}
        >
            {text}
        </Link>
    )
}

export default LinkSection

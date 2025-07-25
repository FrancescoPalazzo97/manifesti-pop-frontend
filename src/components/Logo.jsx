import { NavLink } from "react-router-dom"
import logoHeader from "/logo-header.png"
import logoFooter from "/logo-manifesti-pop.png"

const Logo = ({ where }) => {

    const renderLogo = (where) => {
        const position = {
            navbar: { logo: logoHeader, imageSize: `img-size`, span: true },
            footer: { logo: logoFooter, imgageSize: `img-flluid`, span: false }
        }
        return position[where];
    }

    return (
        <NavLink to="/" className="text-decoration-none text-white">
            <div className="d-flex align-items-center">
                <img src={renderLogo(where).logo} alt="" className={renderLogo(where).imageSize} />
                {renderLogo(where).span ? (
                    <div className="ms-3 title-style d-none d-md-block">Manifesti Pop</div>
                ) : (null)}
            </div>
        </NavLink>
    )
}

export default Logo

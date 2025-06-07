import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className='footerComp'>
      <span>Debo job Application</span>
      <span>All right reserved</span>
      <div className="footerMediaLink">
      <Link><img src="./../../../../public/facebook.svg" className="w-6 h-6"/></Link>
      <Link><img src="./../../../../public/instagram.svg" className="w-6 h-6"/></Link>
      </div>
     
    </div>
  )
}

export default Footer
import "./Navbar.css"
import { Link } from 'react-router-dom';
const Navbar = () => {
    return(
        <nav className='navbar'>
		    <ul>
			    <li><Link to='/main'>Trang chủ</Link></li> 
			    <li><Link to ='/about'>Nhóm</Link></li>
			    <li><Link to ='/dashboard'>Tổng quan</Link></li>
		    </ul>
	    </nav>
    );
}
export default Navbar;
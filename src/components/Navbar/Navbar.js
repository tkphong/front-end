import "./Navbar.css"
import { Link } from 'react-router-dom';
const Navbar = () => {
    return(
        <nav className='navbar'>
		    <ul>
			    <li><Link to='/main'>main</Link></li> 
			    <li><Link to ='/about'>about</Link></li>
			    <li><Link to ='/dashboard'>dashboard</Link></li>
		    </ul>
	    </nav>
    );
}
export default Navbar;
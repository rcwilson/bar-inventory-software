import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './NavTop.css';


function NavTop({ user, ...props }) {

    function Links(){
      if( user ) {
        return (
          <>
            <Link className='nav-link' to={"/products"}>Products</Link>
            <Link className='nav-link' to={"/distributors"}>Distributors</Link>
            <Dropdown>
              <Dropdown.Toggle>
              &nbsp;&nbsp; <FaUser /> &nbsp; {user.first_name} &nbsp;&nbsp;
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )
      } else {
        return (<></>)
      }
    }
  
    return (
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>
              &nbsp;&nbsp;
              <Link className='nav-link' to="/"><img alt="company logo" width="50" height="50" className="me-4" src="/union_logo.jpg" />
               Inventory Manager
              </Link>
            </Navbar.Brand>
            <Links />
            { !user ? <h3 style={ {color: "white"} }>Please Login</h3> : "" }
          </Container>
        </Navbar>
    )
}

export default NavTop;

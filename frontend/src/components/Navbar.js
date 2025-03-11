import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/theme.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container d-flex justify-content-center">
        <Link className="navbar-brand fw-bold text-center" to="/">
          Smart To-Do
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

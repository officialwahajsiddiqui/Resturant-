import React, { useContext } from 'react'
import Navbar from './miniComponents/Navbar'
import Service from './miniComponents/Service'
import About from './miniComponents/About'
import Menu from './miniComponents/Menu'
import Reservation from './miniComponents/Reservation'
import Team from './miniComponents/Team'
import Footer from './miniComponents/Footer'
import { heroImage } from '../utils/imageUtils'
// import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'
import Reviews from './miniComponents/Reviews'

const Main = () => {

  return (
    <>
      <div className="container-xxl bg-white p-0">
        <Navbar />
        <div className="container-xxl py-5 bg-dark hero-header mb-5">
          <div className="container my-5 py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 className="display-3 text-white animated slideInLeft">
                  Enjoy Our
                  <br />
                  Delicious Meal
                </h1>
                <p className="text-white animated slideInLeft mb-4 pb-2">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
                  diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet
                  lorem sit clita duo justo magna dolore erat amet
                </p>
                <Link to={'/booking'}
                  className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft"
                >
                  Book A Table
                </Link>
              </div>
              <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                <img className="img-fluid" src={heroImage} alt="Restaurant Hero" />
              </div>
            </div>
          </div>
        </div>
        <Service />
        <About />
        <Menu />
        <Team />
        <Reviews/>
        <Footer />

        {/* Back to Top */}

        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
          <i className="bi bi-arrow-up" />
        </a>

      </div>
    </>
  )
}

export default Main

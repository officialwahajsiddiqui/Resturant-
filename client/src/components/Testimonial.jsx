import React from 'react'
import HeroSection from './miniComponents/HeroSection'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TestimonialItem from './ui/TestimonialItem';

const testimonials = [
  {
    id: 1,
    name: 'Client Name',
    profession: 'Profession',
    quote: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
    image: 'img/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Client Name',
    profession: 'Profession',
    quote: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
    image: 'img/testimonial-2.jpg',
  },
  {
    id: 3,
    name: 'Client Name',
    profession: 'Profession',
    quote: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
    image: 'img/testimonial-3.jpg',
  },
  {
    id: 4,
    name: 'Client Name',
    profession: 'Profession',
    quote: 'Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam',
    image: 'img/testimonial-4.jpg',
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        }
      }
    ]
  };

  return (
    <>
      <HeroSection heading={'Testimonial'} breadcrumbLast={'Testimonial'} />
      {/* Testimonial Start */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">
              Testimonial
            </h5>
            <h1 className="mb-5">Our Clients Say!!!</h1>
          </div>

          <Slider {...settings} className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="p-2">
                <TestimonialItem
                  name={testimonial.name}
                  profession={testimonial.profession}
                  quote={testimonial.quote}
                  image={testimonial.image}
                  delay={index * 0.1}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* Testimonial End */}



    </>
  )
}

export default Testimonial

import { motion } from 'framer-motion';

const TestimonialItem = ({ image, name, profession, quote, delay = 0 }) => {
  return (
    <motion.div
      className="testimonial-item bg-transparent border rounded p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
      <p>{quote}</p>
      <div className="d-flex align-items-center">
        <img
          className="img-fluid flex-shrink-0 rounded-circle"
          src={image}
          style={{ width: '50px', height: '50px' }}
          alt={name}
        />
        <div className="ps-3">
          <h5 className="mb-1">{name}</h5>
          <small>{profession}</small>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialItem;
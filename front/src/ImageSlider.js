// ImageSlider.js
import React, { useState, useEffect } from 'react';

const images = [
  `${process.env.PUBLIC_URL}/images/1731806820349.jpg`,
  `${process.env.PUBLIC_URL}/images/1731806825200.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807191481.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807231234.jpg`
];

function ImageSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <div className="image-slider-wrapper">
      <div className="image-slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`슬라이드 ${index + 1}`}
            className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
            onLoad={handleImageLoad}
          />
        ))}
      </div>
      {!imagesLoaded && <div className="loading">Loading...</div>}
    </div>
  );
}

export default ImageSlider;
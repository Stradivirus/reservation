// ImageSlider.js
import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

// 이미지 배열 정의
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
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
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
        
        <div className="slider-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
      {!imagesLoaded && <div className="loading">Loading...</div>}
    </div>
  );
}

export default ImageSlider; // ImageSlider 컴포넌트를 기본 내보내기
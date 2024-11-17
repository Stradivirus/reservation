// ImageSlider.js
import React, { useState, useEffect } from 'react'; // React 및 필요한 훅 임포트

// 이미지 배열 정의
const images = [
  `${process.env.PUBLIC_URL}/images/1731806820349.jpg`,
  `${process.env.PUBLIC_URL}/images/1731806825200.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807191481.jpg`,
  `${process.env.PUBLIC_URL}/images/1731807231234.jpg`
];

function ImageSlider() {
  // 현재 이미지 인덱스 상태와 이미지 로드 상태 정의
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 컴포넌트가 마운트될 때 이미지 슬라이드 자동 전환 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1 // 마지막 이미지에서 첫 이미지로 돌아감
      );
    }, 5000); // 5초마다 이미지 변경

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 이미지 로드 완료 시 호출되는 함수
  const handleImageLoad = () => {
    setImagesLoaded(true); // 모든 이미지가 로드되었음을 상태로 설정
  };

  return (
    <div className="image-slider-wrapper">
      <div className="image-slider">
        {/* 이미지 배열을 맵핑하여 각각의 이미지를 렌더링 */}
        {images.map((image, index) => (
          <img
            key={index} // 고유 키 설정
            src={image} // 이미지 소스 설정
            alt={`슬라이드 ${index + 1}`} // 접근성을 위한 대체 텍스트
            className={`slider-image ${index === currentImageIndex ? 'active' : ''}`} // 현재 활성화된 이미지에 클래스 추가
            onLoad={handleImageLoad} // 이미지 로드 시 핸들러 호출
          />
        ))}
      </div>
      {/* 이미지가 로드되지 않았을 경우 로딩 메시지 표시 */}
      {!imagesLoaded && <div className="loading">Loading...</div>}
    </div>
  );
}

export default ImageSlider; // ImageSlider 컴포넌트를 기본 내보내기

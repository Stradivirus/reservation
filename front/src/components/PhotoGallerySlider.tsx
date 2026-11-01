import React, { useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Sparkles, ZoomIn, X } from 'lucide-react';

interface SlideItem {
  src: string;
  title: string;
  caption: string;
  tag: string;
}

const SLIDES: SlideItem[] = [
  {
    src: '/images/1759659528457.jpg',
    title: '황금빛 가을 햇살과 코스모스 정원',
    caption: '가을 바람에 일렁이는 꽃길 산책로 메인 포토존',
    tag: 'Zone 01 · 메인 플라워 가든',
  },
  {
    src: '/images/1731807191481.jpg',
    title: '오색 찬란한 가을 단풍과 꽃물결',
    caption: '붉고 노란 가을 색채가 어우러진 파노라마 산책 코스',
    tag: 'Zone 02 · 오텀 블라썸 힐',
  },
  {
    src: '/images/1731806820349.jpg',
    title: '가을 정취가 머무는 야외 힐링 가든',
    caption: '가족·연인과 함께 쉬어가는 자연 속 피크닉 라운지',
    tag: 'Zone 03 · 선셋 가든 라운지',
  },
  {
    src: '/images/1731807231234.jpg',
    title: '청명한 가을 하늘 아래 펼쳐진 축제장',
    caption: '직접 촬영한 현장 풍경 그대로 만나는 가을 페스티벌',
    tag: 'Zone 04 · 스카이 뷰 포인트',
  },
  {
    src: '/images/1731806825200.jpg',
    title: '노을빛에 물드는 가을 꽃 산책길',
    caption: '오후의 따뜻한 햇살과 어우러진 감성 포토 스팟',
    tag: 'Zone 05 · 골든 아워 트레일',
  },
];

const PhotoGallerySlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (isHovered || lightboxOpen) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4200);
    return () => clearInterval(timer);
  }, [isHovered, lightboxOpen]);

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/70 shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setZoomOrigin({ x: 50, y: 50 });
        }}
      >
        {/* Main Image Frame with Interactive Hover Zoom */}
        <div
          className="relative aspect-[16/11] w-full cursor-zoom-in overflow-hidden bg-stone-950"
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          {SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                  className={`h-full w-full object-cover transition-transform duration-300 ease-out ${
                    isActive && isHovered ? 'scale-125' : 'scale-100'
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-60' : 'opacity-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Top Left Badge */}
          <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium text-stone-100 backdrop-blur-md">
            <Camera className="h-3.5 w-3.5 text-amber-400" />
            <span>직접 촬영한 축제 현장 원본 갤러리 ({current + 1} / {SLIDES.length})</span>
          </div>

          {/* Top Right Zoom Indicator Badge */}
          <div className="pointer-events-none absolute right-4 top-4 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-amber-300 backdrop-blur-md transition group-hover:bg-amber-500 group-hover:text-stone-950">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>{isHovered ? '마우스 이동으로 디테일 확대 중 (클릭 시 전체화면)' : '마우스 오버 시 확대'}</span>
          </div>

          {/* Prev / Next Controls */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2.5 text-white opacity-80 backdrop-blur-md transition hover:bg-amber-500 hover:text-stone-950 group-hover:opacity-100"
            aria-label="이전 사진"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2.5 text-white opacity-80 backdrop-blur-md transition hover:bg-amber-500 hover:text-stone-950 group-hover:opacity-100"
            aria-label="다음 사진"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Caption Overlay */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20 p-5 sm:p-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {SLIDES[current].tag}
            </span>
            <h3 className="mt-1.5 text-lg sm:text-xl font-bold text-white drop-shadow">
              {SLIDES[current].title}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-stone-300">
              {SLIDES[current].caption}
            </p>
          </div>
        </div>

        {/* Thumbnail Strip (5 Original Photos with Hover Zoom) */}
        <div className="grid grid-cols-5 gap-2 border-t border-stone-800/80 bg-stone-950/90 p-3">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`group/thumb relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition ${
                idx === current
                  ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={slide.src}
                alt={`썸네일 ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-115"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal on Click */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-stone-900/80 p-2.5 text-white transition hover:bg-amber-500 hover:text-stone-950"
            aria-label="원본 보기 닫기"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-stone-900/80 p-3 text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="max-h-[88vh] max-w-5xl overflow-hidden rounded-3xl border border-stone-700 bg-stone-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SLIDES[current].src}
              alt={SLIDES[current].title}
              className="max-h-[75vh] w-full object-contain bg-black"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-800 bg-stone-900 px-6 py-4">
              <div>
                <span className="text-xs font-bold text-amber-400">{SLIDES[current].tag}</span>
                <h4 className="text-base font-bold text-white">{SLIDES[current].title}</h4>
              </div>
              <span className="text-xs text-stone-400">{SLIDES[current].caption}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-stone-900/80 p-3 text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoGallerySlider;

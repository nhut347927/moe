import React, { useContext, CSSProperties } from 'react';
import { FilterContext, FilterType } from '../../common/context/FilterContext'; // Import FilterType

interface BackgroundComponentProps {
  videoSrc?: string;
  imgSrc?: string;
}

const BackgroundComponent: React.FC<BackgroundComponentProps> = ({ videoSrc, imgSrc }) => {
  const { filters } = useContext(FilterContext) ?? { filters: {} as FilterType }; // Safe fallback with type assertion

  const filterString = ` 
    sepia(${filters.sepia || 0}) 
    saturate(${filters.saturate || 1}) 
    opacity(${filters.opacity || 1}) 
    invert(${filters.invert || 0}) 
    hue-rotate(${filters.hueRotate || 0}deg) 
    grayscale(${filters.grayscale || 0}) 
    contrast(${filters.contrast || 1}) 
    brightness(${filters.brightness || 1}) 
    blur(${filters.blur || 0}px)
  `.trim();

  const styles: Record<string, CSSProperties> = {
    backgroundContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
    },
    backgroundVideo: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%)',
      zIndex: -1,
      filter: filterString,
      WebkitFilter: filterString,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: -1,
      backgroundImage: `url(${imgSrc})`,
      filter: filterString,
      WebkitFilter: filterString,
    },
    backgroundBlack: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: -1,
    },
  };

  const backgroundKey = videoSrc || imgSrc || 'defaultBackground';

  return (
    <div key={backgroundKey} style={styles.backgroundContainer}>
      {videoSrc ? (
        <video autoPlay muted loop style={styles.backgroundVideo}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : imgSrc ? (
        <div style={styles.backgroundImage}></div>
      ) : (
        <div style={styles.backgroundBlack}></div>
      )}
    </div>
  );
};

export default BackgroundComponent;

import React from 'react';

interface BgNoiseProps {
  videoSrc?: string; // Đầu vào videoSrc có thể là string hoặc không
  imgSrc?: string;   // Đầu vào imgSrc có thể là string hoặc không
}

const BgNoise: React.FC<BgNoiseProps> = ({ videoSrc, imgSrc }) => {
  // Cấu trúc filter
  const filterString = `
  brightness(0.5) 
  blur(10px)
  `.trim();

  const styles = {
    backgroundContainer: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
    },
    backgroundVideo: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      objectFit: 'cover' as 'cover',
      transform: 'translate(-50%, -50%)',
      zIndex: -1,
      filter: filterString,
      WebkitFilter: filterString,
    },
    backgroundImage: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover' as 'cover',
      backgroundPosition: 'center' as 'center',
      backgroundRepeat: 'no-repeat' as 'no-repeat',
      zIndex: -1,
      backgroundImage: `url(${imgSrc})`,
      filter: filterString,
      WebkitFilter: filterString,
    },
    backgroundBlack: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: -1,
    },
  };

  return (
    <div key={videoSrc || imgSrc} style={styles.backgroundContainer}>
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

export default BgNoise;

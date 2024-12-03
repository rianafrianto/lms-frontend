import React from 'react';
import { Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const MediaDisplay = ({ mediaUrl, mediaType, selectedSubLesson, selectedLesson, setMediaUrl }) => {
  const isImageContent =
    mediaType === "image" &&
    (selectedSubLesson?.content_type === "image" || selectedLesson?.content_type === "image");
  const isVideoContent =
    mediaType === "video" &&
    (selectedSubLesson?.content_type === "video" || selectedLesson?.content_type === "video");

  const isPdfContent =
    mediaType === "pdf" &&
    (selectedSubLesson?.content_type === "pdf" || selectedLesson?.content_type === "pdf");

    const handleDeleteMedia = () => {
    setMediaUrl(null);
  };

  if (!mediaUrl || (!isImageContent && !isVideoContent && !isPdfContent)) return null;

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        {isImageContent && (
          <Image
            src={mediaUrl}
            alt="Uploaded Media"
            width="100%"
            height="70%"
            style={{ borderRadius: 8 }}
            preview={true}
          />
        )}
        {isVideoContent && (
          <video
            src={mediaUrl}
            controls
            style={{ width: '100%', height: '70%', borderRadius: 8 }}
          />
        )}
        {isPdfContent && (
          <iframe
            src={mediaUrl}
            title="Uploaded PDF"
            style={{ width: '100%', height: '70%', borderRadius: 8, border: 'none' }}
          />
        )}
        <DeleteOutlined
          onClick={handleDeleteMedia}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'red',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default MediaDisplay;

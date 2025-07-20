import axios, { AxiosProgressEvent } from 'axios';

interface UploadResult {
  url: string;
  publicId: string;
  assetType: 'image' | 'video';
}

const uploadToCloudinary = async (
  file: File,
  cloudName: string,
  uploadPreset: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  // Kiểm tra loại file
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  if (!isImage && !isVideo) {
    throw new Error('Chỉ hỗ trợ ảnh hoặc video');
  }

  // Kiểm tra kích thước file (1GB cho video, 10MB cho ảnh)
  const maxSize = isVideo ? 1024 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File quá lớn (tối đa ${isVideo ? '1GB' : '10MB'})`);
  }

  // Tạo FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('resource_type', isVideo ? 'video' : 'image');
  formData.append('folder', isVideo ? 'videos' : 'images'); // Chỉ định folder

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData,
      {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    const { secure_url, public_id, resource_type } = response.data;
    return {
      url: secure_url,
      publicId: public_id,
      assetType: resource_type,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || 'Lỗi khi upload file';
    throw new Error(errorMessage);
  }
};

export default uploadToCloudinary;

import React, { useRef, useCallback } from 'react';

type ImageState = {
  file: File;
  base64: string;
} | null;

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  image: ImageState;
  onImageSelect: (imageState: ImageState) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, image, onImageSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelect({ file, base64 });
      } catch (error) {
        console.error("Error converting file to base64", error);
        onImageSelect(null);
      }
    }
  }, [onImageSelect]);
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mb-2 text-center">{description}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-48 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:bg-gray-700 transition-all duration-300 relative group"
      >
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
        {image ? (
          <>
            <img src={image.base64} alt={title} className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

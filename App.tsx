
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateNailArtImage } from './services/geminiService';

// Define a type for the image state
type ImageState = {
  file: File;
  base64: string;
} | null;

const App: React.FC = () => {
  const [destinationImage, setDestinationImage] = useState<ImageState>(null);
  const [sourceImage, setSourceImage] = useState<ImageState>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!destinationImage || !sourceImage) {
      setError('Please upload both a model hand image and a nail design image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateNailArtImage(destinationImage.base64, sourceImage.base64);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [destinationImage, sourceImage]);
  
  const handleReset = () => {
    setDestinationImage(null);
    setSourceImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Nail Style AI
          </h1>
          <p className="mt-2 text-lg text-gray-400">Transfer nail art designs onto any hand with the power of AI.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">1. Upload Your Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                id="destination-uploader"
                title="Model's Hand"
                description="The hand you want to apply the style to."
                onImageSelect={setDestinationImage}
                image={destinationImage}
              />
              <ImageUploader
                id="source-uploader"
                title="Nail Art Design"
                description="The style you want to copy."
                onImageSelect={setSourceImage}
                image={sourceImage}
              />
            </div>
             <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGenerate}
                disabled={!destinationImage || !sourceImage || isLoading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
              >
                {isLoading ? <Spinner /> : 'Generate Style'}
              </button>
              {(destinationImage || sourceImage || generatedImage) && (
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
                >
                  Start Over
                </button>
              )}
            </div>
             {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">2. View Result</h2>
            <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg p-2">
              {isLoading && (
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="mt-4 text-lg text-gray-400 animate-pulse">AI is working its magic...</p>
                </div>
              )}
              {!isLoading && generatedImage && (
                <img src={generatedImage} alt="Generated nail art" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              )}
              {!isLoading && !generatedImage && (
                 <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useRef } from 'react';
import { Upload, Music, X, Check, AlertCircle } from 'lucide-react';
import { musicAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface FileUploadStatus {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface MusicUploadProps {
  onUploadComplete: () => void;
}

const MusicUpload: React.FC<MusicUploadProps> = ({ onUploadComplete }) => {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<FileUploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const audioFiles = files.filter(file => {
      const isAudio = file.type.startsWith('audio/') || 
                     /\.(mp3|wav|ogg|flac|m4a|aac)$/i.test(file.name);
      return isAudio;
    });

    if (audioFiles.length === 0) {
      alert(t.upload.invalidFormat);
      return;
    }

    audioFiles.forEach(uploadFile);
  };

  const uploadFile = async (file: File) => {
    const uploadStatus: FileUploadStatus = {
      file,
      status: 'uploading',
      progress: 0
    };

    setUploads(prev => [...prev, uploadStatus]);

    try {
      // Simulated progress update
      const updateProgress = (progress: number) => {
        setUploads(prev => 
          prev.map(upload => 
            upload.file === file 
              ? { ...upload, progress }
              : upload
          )
        );
      };

      // Start with some progress
      updateProgress(10);

      await musicAPI.uploadSong(file);
      
      updateProgress(100);
      
      setUploads(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { ...upload, status: 'success', progress: 100 }
            : upload
        )
      );

      onUploadComplete();

    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { 
                ...upload, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : upload
        )
      );
    }
  };

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status === 'uploading'));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{t.upload.title}</h1>
        <p className="text-gray-400">
          {t.upload.description}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {t.upload.dragHere}
          </h3>
          <p className="text-gray-400 mb-4">
            veya <span className="text-primary-500">{t.upload.browseClick}</span>
          </p>
          <p className="text-sm text-gray-500">
            {t.upload.supportedFormats}
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">{t.upload.uploadedFiles}</h3>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t.upload.clearCompleted}
            </button>
          </div>

          <div className="space-y-3">
            {uploads.map((upload, index) => (
              <div
                key={index}
                className="bg-dark-200 rounded-lg p-4 flex items-center space-x-4"
              >
                {/* File Icon */}
                <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  {upload.status === 'uploading' && (
                    <>
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12">
                        {upload.progress}%
                      </span>
                    </>
                  )}

                  {upload.status === 'success' && (
                    <div className="flex items-center space-x-2 text-green-500">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">{t.upload.success}</span>
                    </div>
                  )}

                  {upload.status === 'error' && (
                    <div className="flex items-center space-x-2 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{t.upload.errorText}</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeUpload(upload.file)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-8 p-4 bg-dark-200 rounded-lg">
        <h4 className="text-white font-medium mb-2">{t.upload.tipsTitle}</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• {t.upload.tips.quality}</li>
          <li>• {t.upload.tips.metadata}</li>
          <li>• {t.upload.tips.multiple}</li>
          <li>• {t.upload.tips.maxSize}</li>
        </ul>
      </div>
    </div>
  );
};

export default MusicUpload;

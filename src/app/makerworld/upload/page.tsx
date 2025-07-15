'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, Loader2, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface FileWithPreview extends File {
  preview?: string;
}

const ACCEPTED_3D_FORMATS = {
  'model/stl': ['.stl'],
  'model/obj': ['.obj'],
  'model/gltf': ['.gltf', '.glb'],
  'model/step': ['.step', '.stp'],
  'model/x.stl-ascii': ['.stl'],
  'model/x.stl-binary': ['.stl'],
};

const ACCEPTED_IMAGE_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export default function UploadDesignPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Print settings
  const [layerHeight, setLayerHeight] = useState('0.2');
  const [infillPercent, setInfillPercent] = useState('20');
  const [printTime, setPrintTime] = useState('');
  const [filamentUsage, setFilamentUsage] = useState('');
  
  // Files
  const [modelFiles, setModelFiles] = useState<FileWithPreview[]>([]);
  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);

  const onDropModels = useCallback((acceptedFiles: File[]) => {
    setModelFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const onDropImages = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setImageFiles((prev) => [...prev, ...filesWithPreview]);
  }, []);

  const {
    getRootProps: getModelRootProps,
    getInputProps: getModelInputProps,
    isDragActive: isModelDragActive,
  } = useDropzone({
    onDrop: onDropModels,
    accept: ACCEPTED_3D_FORMATS,
    multiple: true,
  });

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImages,
    accept: ACCEPTED_IMAGE_FORMATS,
    multiple: true,
  });

  const removeModelFile = (index: number) => {
    setModelFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImageFile = (index: number) => {
    const file = imageFiles[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/makerworld/upload');
      return;
    }

    if (!title || !description || modelFiles.length === 0) {
      alert('Please fill in all required fields and upload at least one 3D model file.');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));
      formData.append('layerHeight', layerHeight);
      formData.append('infillPercent', infillPercent);
      formData.append('printTime', printTime);
      formData.append('filamentUsage', filamentUsage);

      // Add model files
      modelFiles.forEach((file) => {
        formData.append('modelFiles', file);
      });

      // Add image files
      imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
      });

      const response = await fetch('/api/makerworld/designs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      router.push(`/makerworld/design/${data.designId}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload design. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Upload Your Design</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a descriptive title for your design"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your design, its purpose, and any special instructions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Model Files */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">3D Model Files *</h2>
          
          <div
            {...getModelRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isModelDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getModelInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {isModelDragActive
                ? 'Drop the files here...'
                : 'Drag & drop 3D model files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: STL, OBJ, GLTF/GLB, STEP
            </p>
          </div>

          {modelFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {modelFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModelFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Preview Images</h2>
          
          <div
            {...getImageRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isImageDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getImageInputProps()} />
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {isImageDragActive
                ? 'Drop the images here...'
                : 'Drag & drop preview images here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: JPEG, PNG, WebP
            </p>
          </div>

          {imageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Print Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Print Settings (Optional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Layer Height (mm)
              </label>
              <input
                type="number"
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
                step="0.05"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Infill Percentage (%)
              </label>
              <input
                type="number"
                value={infillPercent}
                onChange={(e) => setInfillPercent(e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Print Time (minutes)
              </label>
              <input
                type="number"
                value={printTime}
                onChange={(e) => setPrintTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Filament Usage (grams)
              </label>
              <input
                type="number"
                value={filamentUsage}
                onChange={(e) => setFilamentUsage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              These settings are recommendations for other users. They can adjust them based on their printer and preferences.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Design
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
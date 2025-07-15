'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Download,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Layers,
  Package,
  Clock,
  Weight,
  ChevronLeft,
  Send,
  MoreVertical,
  Flag,
  Trash2,
  Edit,
  FileText,
} from 'lucide-react';
import Image from 'next/image';

interface DesignFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  replies?: Comment[];
}

interface Design {
  id: string;
  title: string;
  description: string;
  status: string;
  user: User;
  files: DesignFile[];
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  tags: string[];
  layerHeight?: number;
  infillPercent?: number;
  printTime?: number;
  filamentUsage?: number;
  createdAt: string;
  publishedAt?: string;
  isLiked?: boolean;
  remixOf?: {
    id: string;
    title: string;
    user: User;
  };
}

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [design, setDesign] = useState<Design | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchDesign();
      fetchComments();
    }
  }, [params.id]);

  const fetchDesign = async () => {
    try {
      const response = await fetch(`/api/makerworld/designs/${params.id}`);
      if (!response.ok) throw new Error('Design not found');
      const data = await response.json();
      setDesign(data);
      
      // Track view
      fetch(`/api/makerworld/designs/${params.id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Error fetching design:', error);
      router.push('/makerworld');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/makerworld/designs/${params.id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/makerworld/designs/${params.id}/like`, {
        method: design?.isLiked ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setDesign((prev) =>
          prev
            ? {
                ...prev,
                isLiked: !prev.isLiked,
                likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDownload = async (file: DesignFile) => {
    try {
      // Track download
      await fetch(`/api/makerworld/designs/${params.id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id }),
      });

      // Download file
      window.open(file.fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    try {
      const response = await fetch(`/api/makerworld/designs/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrintTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!design) return null;

  const imageFiles = design.files.filter((f) => f.thumbnailUrl);
  const modelFiles = design.files.filter((f) => !f.thumbnailUrl);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/makerworld"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to MakerWorld
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Info */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="aspect-square relative bg-gray-100">
              {imageFiles.length > 0 ? (
                <img
                  src={imageFiles[selectedImage].thumbnailUrl}
                  alt={design.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-24 h-24" />
                </div>
              )}
            </div>
            
            {imageFiles.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {imageFiles.map((file, index) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={file.thumbnailUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{design.description}</p>
            
            {design.remixOf && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Remixed from{' '}
                  <Link
                    href={`/makerworld/design/${design.remixOf.id}`}
                    className="font-medium hover:underline"
                  >
                    {design.remixOf.title}
                  </Link>{' '}
                  by {design.remixOf.user.username}
                </p>
              </div>
            )}
          </div>

          {/* Print Settings */}
          {(design.layerHeight ||
            design.infillPercent ||
            design.printTime ||
            design.filamentUsage) && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Print Settings</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-500">Layer Height</p>
                  <p className="font-semibold">
                    {design.layerHeight ? `${design.layerHeight}mm` : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-500">Infill</p>
                  <p className="font-semibold">
                    {design.infillPercent ? `${design.infillPercent}%` : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-500">Print Time</p>
                  <p className="font-semibold">{formatPrintTime(design.printTime)}</p>
                </div>
                <div className="text-center">
                  <Weight className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-500">Filament</p>
                  <p className="font-semibold">
                    {design.filamentUsage ? `${design.filamentUsage}g` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Comments ({comments.length})
            </h2>

            {session ? (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-3">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-center text-gray-500 mb-6">
                <Link href="/auth/signin" className="text-blue-600 hover:underline">
                  Sign in
                </Link>{' '}
                to comment
              </p>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {comment.user.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user.username}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Actions and Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h1 className="text-2xl font-bold mb-4">{design.title}</h1>

            {/* Creator */}
            <div className="flex items-center gap-3 mb-6">
              {design.user.avatarUrl ? (
                <img
                  src={design.user.avatarUrl}
                  alt={design.user.username}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              )}
              <div>
                <p className="font-medium">{design.user.username}</p>
                <p className="text-sm text-gray-500">
                  Published {formatDate(design.publishedAt || design.createdAt)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <p className="text-2xl font-bold">{design.viewCount}</p>
                <p className="text-sm text-gray-500">Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{design.downloadCount}</p>
                <p className="text-sm text-gray-500">Downloads</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{design.likeCount}</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleLike}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
                  design.isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${design.isLiked ? 'fill-current' : ''}`} />
                {design.isLiked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Download Files */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Download Files</h3>
              <div className="space-y-2">
                {modelFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleDownload(file)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div className="text-left">
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {file.fileType.toUpperCase()} • {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-blue-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {design.tags.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/makerworld?tag=${tag}`}
                      className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Upload, Filter, Heart, Download, Eye } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import SectionSeparator from '@/components/ui/SectionSeparator';

interface Design {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  user: {
    username: string;
    avatarUrl?: string;
  };
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  tags: string[];
  createdAt: string;
}

export default function MakerWorldPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'downloads'>('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, [searchQuery, selectedTags, sortBy]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        tags: selectedTags.join(','),
        sortBy,
      });
      
      const response = await fetch(`/api/makerworld/designs?${params}`);
      const data = await response.json();
      setDesigns(data.designs || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const popularTags = ['functional', 'art', 'tools', 'toys', 'household', 'hobby', 'mechanical', 'electronics'];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">MakerWorld</h1>
            <p className="text-gray-600 text-lg">
              Discover and share amazing 3D designs with the community
            </p>
          </div>

          <SectionSeparator spacing="sm" variant="gradient" />

          {/* Search and Upload */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Link
              href="/makerworld/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Upload className="w-5 h-5" />
              Upload Design
            </Link>
          </div>

          <SectionSeparator spacing="sm" variant="line" />

          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Filters:</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex gap-4">
              <span className="font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloads</option>
              </select>
            </div>
          </div>

          <SectionSeparator spacing="md" variant="dots" />

          {/* Designs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <Link
                  key={design.id}
                  href={`/makerworld/design/${design.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
                    {design.thumbnailUrl ? (
                      <img
                        src={design.thumbnailUrl}
                        alt={design.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition">
                    {design.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    {design.user.avatarUrl ? (
                      <img
                        src={design.user.avatarUrl}
                        alt={design.user.username}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                    )}
                    <span>{design.user.username}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {design.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {design.downloadCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {design.likeCount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && designs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No designs found</p>
              <Link
                href="/makerworld/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Upload className="w-5 h-5" />
                Be the first to upload
              </Link>
            </div>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="gradient" />
        </div>
      </main>
      <Footer />
    </>
  );
} 
import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { categories, colors } from '../services/mockData';

const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange, 
  totalProducts 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value === 'all' ? '' : value
    };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const emptyFilters = {
      category: '',
      color: '',
      brand: '',
      minPrice: '',
      maxPrice: ''
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '' && value !== undefined).length;
  };

  const getActiveFiltersList = () => {
    const activeFilters = [];
    if (filters.category) activeFilters.push({ key: 'category', value: filters.category });
    if (filters.color) activeFilters.push({ key: 'color', value: filters.color });
    if (filters.brand) activeFilters.push({ key: 'brand', value: filters.brand });
    if (filters.minPrice) activeFilters.push({ key: 'minPrice', value: `Min: $${filters.minPrice}` });
    if (filters.maxPrice) activeFilters.push({ key: 'maxPrice', value: `Max: $${filters.maxPrice}` });
    return activeFilters;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-4 h-12 text-base"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge 
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600"
              >
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersList().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFiltersList().map((filter, index) => (
            <Badge
              key={`${filter.key}-${index}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter.value}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => {
                  const newFilters = { ...filters };
                  newFilters[filter.key] = '';
                  onFiltersChange(newFilters);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border-2 border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select
                  value={localFilters.category || 'all'}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <Select
                  value={localFilters.color || 'all'}
                  onValueChange={(value) => handleFilterChange('color', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colors</SelectItem>
                    {colors.map(color => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <Input
                  placeholder="Enter brand name"
                  value={localFilters.brand || ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Min Price</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Max Price</label>
                <Input
                  type="number"
                  placeholder="999.99"
                  step="0.01"
                  min="0"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowFilters(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilter;
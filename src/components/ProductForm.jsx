import React, { useState, useEffect } from 'react';
import { X, Save, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { categories, colors } from '../services/mockData';
import { useToast } from '../hooks/use-toast';
import CameraCapture from './CameraCapture';
import { getImageSize } from '../utils/imageUtils';

const ProductForm = ({ product, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    weight: '',
    size: '',
    brand: '',
    category: '',
    pricePerPiece: '',
    pricePerWeight: '',
    image: '',
    notes: ''
  });
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: '',
        color: '',
        weight: '',
        size: '',
        brand: '',
        category: '',
        pricePerPiece: '',
        pricePerWeight: '',
        image: '',
        notes: ''
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageCapture = (imageDataUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageDataUrl
    }));
    toast({
      title: "Image captured",
      description: `Image size: ${getImageSize(imageDataUrl)}`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image) {
      toast({
        title: "Validation Error",
        description: "Product image is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        pricePerPiece: formData.pricePerPiece ? parseFloat(formData.pricePerPiece) : 0,
        pricePerWeight: formData.pricePerWeight ? parseFloat(formData.pricePerWeight) : 0,
      };
      
      await onSave(productData);
      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product added successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Section */}
              <div className="space-y-3">
                <Label>Product Image *</Label>
                <div className="flex flex-col items-center space-y-3">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {formData.image ? 'Retake Photo' : 'Take Photo'}
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => handleInputChange('color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Physical Properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="e.g., 250g, 1.2kg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="e.g., Small, Medium, Large"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerPiece">Price per Piece</Label>
                  <Input
                    id="pricePerPiece"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerPiece}
                    onChange={(e) => handleInputChange('pricePerPiece', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricePerWeight">Price per Weight Unit</Label>
                  <Input
                    id="pricePerWeight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerWeight}
                    onChange={(e) => handleInputChange('pricePerWeight', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about the product..."
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {product ? 'Update Product' : 'Save Product'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <CameraCapture
        isOpen={showCamera}
        onImageCapture={handleImageCapture}
        onClose={() => setShowCamera(false)}
      />
    </>
  );
};

export default ProductForm;
import React from 'react';
import { Edit, Trash2, Package, DollarSign, Palette, Scale } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleEdit}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs bg-white/90">
              {product.category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Name & Brand */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-gray-600">{product.brand}</p>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          {/* Color & Size */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {product.color && (
              <div className="flex items-center gap-1">
                <Palette className="w-3 h-3" />
                <span>{product.color}</span>
              </div>
            )}
            {product.size && (
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>{product.size}</span>
              </div>
            )}
          </div>

          {/* Weight */}
          {product.weight && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Scale className="w-3 h-3" />
              <span>{product.weight}</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-600">
              ${product.pricePerPiece ? product.pricePerPiece.toFixed(2) : '0.00'}
            </span>
          </div>
          {product.pricePerWeight && product.pricePerWeight > 0 && (
            <div className="text-xs text-gray-500">
              ${product.pricePerWeight.toFixed(2)}/unit
            </div>
          )}
        </div>

        {/* Notes Preview */}
        {product.notes && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 line-clamp-2">{product.notes}</p>
          </div>
        )}

        {/* Date Added */}
        <div className="mt-2 text-xs text-gray-400">
          Added {new Date(product.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
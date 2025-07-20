import React, { useState } from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, Package, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent } from './ui/card';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (aString < bString) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const handleEdit = (product) => {
    onEdit(product);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '$0.00';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (products.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20">Image</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('name')}
                >
                  Name
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('brand')}
                >
                  Brand
                  {getSortIcon('brand')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('category')}
                >
                  Category
                  {getSortIcon('category')}
                </Button>
              </TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('pricePerPiece')}
                >
                  Price/Piece
                  {getSortIcon('pricePerPiece')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('pricePerWeight')}
                >
                  Price/Weight
                  {getSortIcon('pricePerWeight')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600"
                  onClick={() => handleSort('createdAt')}
                >
                  Added
                  {getSortIcon('createdAt')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow 
                key={product.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  {product.notes && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.notes}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{product.brand || '-'}</span>
                </TableCell>
                <TableCell>
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{product.color || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{product.size || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{product.weight || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">
                    {formatPrice(product.pricePerPiece)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">
                    {formatPrice(product.pricePerWeight)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(product.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ProductTable;
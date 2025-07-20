import React from 'react';
import { Grid3X3, Table } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ViewToggle = ({ currentView, onViewChange, totalProducts }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">View:</span>
        <div className="flex items-center border rounded-lg p-1 bg-gray-50">
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
            className={`flex items-center gap-2 px-3 py-2 ${
              currentView === 'grid' 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Cards
          </Button>
          <Button
            variant={currentView === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-2 px-3 py-2 ${
              currentView === 'table' 
                ? 'bg-white shadow-sm text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table className="w-4 h-4" />
            Table
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {totalProducts} product{totalProducts !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ViewToggle;
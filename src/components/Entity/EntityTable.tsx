// EntityTable.tsx
import React, { useState, useEffect } from 'react';
import { Switch, Skeleton } from 'antd';
import './EntityTable.css';
import { Entity } from '../../types/EntityTypes';
import Pagination from '../Pagination/Pagination'; 

interface EntityTableProps {
  entities: Entity[];
  selectedEntities: string[];
  toggleCheckbox: (_id: string) => void;
  toggleActive: (_id: string) => void;
  setSelectedEntities: (selectedEntities: string[]) => void;
}

const EntityTable: React.FC<EntityTableProps> = ({
  entities = [],
  selectedEntities,
  toggleCheckbox,
  toggleActive,
  setSelectedEntities,
}) => {
  const isEntitiesArray = Array.isArray(entities);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>({});
  const [isTableLoading, setIsTableLoading] = useState(true);

  
  useEffect(() => {
    setIsTableLoading(true);
    const newLoadingRows = entities.reduce((acc, entity) => {
      acc[entity._id] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setLoadingRows(newLoadingRows);

    const timeout = setTimeout(() => {
      setLoadingRows(
        entities.reduce((acc, entity) => {
          acc[entity._id] = false;
          return acc;
        }, {} as { [key: string]: boolean })
      );
      setIsTableLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [entities, currentPage]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectedEntities(isChecked ? entities.map((entity) => entity._id) : []);
  };

  if (!isEntitiesArray) {
    return <div>Invalid data for entities</div>;
  }

  // Pagination logic
  const totalRows = entities.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedEntities = entities.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <table className="w-full border-collapse shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="p-3 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAllChange}
                checked={selectedEntities.length === entities.length && entities.length > 0}
                disabled={isTableLoading}
              />
            </th>
            <th className="p-3 text-left text-gray-500">Code</th>
            <th className="p-3 text-left text-gray-500">Name</th>
            <th className="p-3 text-left text-gray-500">Description</th>
            <th className="p-3 text-left text-gray-500">Created By</th>
            <th className="p-3 text-left text-gray-500">Created On</th>
            <th className="p-3 text-left text-gray-500">Active</th>
            <th className="p-3 text-left text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isTableLoading ? (
            <tr>
              <td colSpan={8} className="p-3">
                <Skeleton active paragraph={{ rows: 5 }} />
              </td>
            </tr>
          ) : paginatedEntities.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-3 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            paginatedEntities.map((entity) => (
              <tr key={entity._id} className="border-t hover:bg-gray-50">
                {loadingRows[entity._id] ? (
                  <td colSpan={8} className="p-3">
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </td>
                ) : (
                  <>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedEntities.includes(entity._id)}
                        onChange={() => toggleCheckbox(entity._id)}
                      />
                    </td>
                    <td className="p-3 font-bold">{entity.code}</td>
                    <td className="p-3">{entity.name}</td>
                    <td className="p-3">{entity.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                          entity.createdBy === 'Admin'
                            ? 'text-blue-500 bg-blue-50'
                            : entity.createdBy === 'Member'
                            ? 'text-dark-blue bg-blue-100'
                            : 'text-black bg-gray-200'
                        }`}
                      >
                        {entity.createdBy}
                      </span>
                    </td>
                    <td className="p-3">{entity.createdOn}</td>
                    <td className="p-3">
                      <Switch
                        checked={entity.isActive}
                        onChange={() => toggleActive(entity._id)}
                        className={`custom-switch ${
                          entity.isActive ? 'active-switch' : 'inactive-switch'
                        }`}
                      />
                    </td>
                    <td className="p-3">
                      <button className="text-blue-500 hover:underline">Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isTableLoading && (
        <Pagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}
    </div>
  );
};

export default EntityTable;
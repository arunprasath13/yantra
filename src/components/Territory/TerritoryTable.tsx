// TerritoryTable.tsx
import React, { useState, useEffect } from 'react';
import { Switch, Skeleton, message } from 'antd';
import axios from 'axios'; // Import Axios
import './TeriritoryTable.css';
import { TerritoryType } from '../../types/TerritoryType';
import { Link } from 'react-router-dom';
import Pagination from "../Pagination/Pagination"
import { toast } from 'react-toastify';

interface TerritoryTableProps {
  entities: TerritoryType[];
  selectedEntities: string[];
  toggleCheckbox: (_id: string) => void;
  toggleActive: (_id: string) => void;
  setSelectedEntities: (selectedEntities: string[]) => void;
}

const TerritoryTable: React.FC<TerritoryTableProps> = ({
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
  const [switchLoading, setSwitchLoading] = useState<{ [key: string]: boolean }>({});

  
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


  const handleToggleStatus = async (id: string) => {
    setSwitchLoading(prev => ({ ...prev, [id]: true }));
    const currentEntity = entities.find(e => e._id === id);
    const newStatus = !currentEntity?.status;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/territories/${id}/status`,
        { status: newStatus }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toggleActive(id); 
      toast.success("Status updated succesfully")
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    } finally {
      setSwitchLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (!isEntitiesArray) {
    return <div>Invalid data for entities</div>;
  }

 
  const totalRows = entities.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedEntities = entities.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg p-4 mt-4 w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-lg table-auto">
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
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Code</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Name</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">District</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Manager</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Longitude</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Latitude</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Created By</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Created On</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Active</th>
              <th className="p-3 text-center text-gray-500 whitespace-nowrap">Edit</th>
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              <tr>
                <td colSpan={11} className="p-3">
                  <Skeleton active paragraph={{ rows: 5 }} />
                </td>
              </tr>
            ) : paginatedEntities.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-3 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedEntities.map((entity) => (
                <tr key={entity._id} className="border-t hover:bg-gray-50">
                  {loadingRows[entity._id] ? (
                    <td colSpan={11} className="p-3">
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </td>
                  ) : (
                    <>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEntities.includes(entity._id)}
                          onChange={() => toggleCheckbox(entity._id)}
                        />
                      </td>
                      <td className="p-3 font-bold text-center">{entity.code}</td>
                      <td className="p-3 text-center whitespace-nowrap">{entity.name}</td>
                      <td className="p-3 text-center whitespace-nowrap">{entity.district}</td>
                      <td className="p-3 text-center whitespace-nowrap">{entity.territoryManager}</td>
                      <td className="p-3 text-center whitespace-nowrap">{entity.longitude}</td>
                      <td className="p-3 text-center whitespace-nowrap">{entity.latitude}</td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                            entity.createdBy === 'Owner'
                              ? 'text-blue-500 bg-blue-50'
                              : entity.createdBy === 'Member'
                              ? 'text-dark-blue bg-blue-100'
                              : 'text-black bg-gray-200'
                          }`}
                        >
                          {entity.createdBy}
                        </span>
                      </td>
                      <td className="p-3 text-center">{entity.createdOn}</td>
                      <td className="p-3 text-center">
                        <Switch
                          checked={entity.status}
                          onChange={() => handleToggleStatus(entity._id)}
                          loading={switchLoading[entity._id] || false}
                          className={`custom-switch ${
                            entity.status ? 'active-switch' : 'inactive-switch'
                          }`}
                        />
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/edit-territory/${entity._id}`}>
                          <button className="text-blue-500 hover:underline">Edit</button>
                        </Link>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

export default TerritoryTable;
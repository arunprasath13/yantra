import React from 'react';
import { Switch } from 'antd';
import "./TeriritoryTable.css";
import { TerritoryType } from '../../types/TerritoryType';
import { Link } from 'react-router-dom';
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

    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSelectedEntities(isChecked ? entities.map((entity) => entity._id) : []);
    };

    if (!isEntitiesArray) {
        return <div>Invalid data for entities</div>;
    }

    console.log("Entities: ", entities);

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
                                />
                            </th>
                            <th className="p-3 text-left text-gray-500">Territory Code</th>
                            <th className="p-3 text-left text-gray-500">Territory Name</th>
                            <th className="p-3 text-left text-gray-500">District</th>
                            <th className="p-3 text-left text-gray-500">Territory Manager</th>
                            <th className="p-3 text-left text-gray-500">Longitude</th>
                            <th className="p-3 text-left text-gray-500">Latitude</th>
                            <th className="p-3 text-left text-gray-500">Created By</th>
                            <th className="p-3 text-left text-gray-500">Created On</th>
                            <th className="p-3 text-left text-gray-500">Active</th>
                            <th className="p-3 text-left text-gray-500">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entities.map((entity) => (
                            <tr key={entity._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedEntities.includes(entity._id)}
                                        onChange={() => toggleCheckbox(entity._id)}
                                    />
                                </td>
                                <td className="p-3 font-bold">{entity.code}</td>
                                <td className="p-3">{entity.name}</td>
                                <td className="p-3">{entity.district}</td>
                                <td className="p-3">{entity.territoryManager}</td>
                                <td className="p-3">{entity.longitude}</td>
                                <td className="p-3">{entity.latitude}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-sm font-semibold ${entity.createdBy === 'Owner'
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
                                        checked={entity.status}
                                        onChange={() => toggleActive(entity._id)}
                                        className={`custom-switch ${entity.status ? 'active-switch' : 'inactive-switch'
                                            }`} 
                                    />
                                </td>
                                <Link to = {`/edit-territory/${entity._id}`}>
                                    <td className="p-3">
                                        <button className="text-blue-500 hover:underline">Edit</button>
                                    </td>
                                </Link>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-600">No of rows per page</label>
                    <select
                        defaultValue={10}
                        className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                        1
                    </button>
                    <button className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-100 rounded">
                        2
                    </button>
                    <button className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-100 rounded">
                        3
                    </button>
                    <button className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-100 rounded">
                        4
                    </button>
                    <span className="px-2 text-sm">...</span>
                    <button className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-100 rounded">
                        10
                    </button>
                    <button className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-100 rounded">
                        11
                    </button>
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TerritoryTable;
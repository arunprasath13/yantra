import React, { useState, useEffect } from 'react';
import { Switch, Modal, Pagination, Skeleton } from 'antd';
import { TerritoryMappingType } from '../../types/TerritoryMappingType';
import { Link } from 'react-router-dom';
import History from "../../assets/history.png";
import { CheckSquareOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios'; 
import dayjs from 'dayjs'; 

interface TerritoryTableProps {
    entities: TerritoryMappingType[];
    selectedEntities: string[];
    toggleCheckbox: (_id: string) => void;
    toggleActive: (_id: string) => void;
    setSelectedEntities: (selectedEntities: string[]) => void;
}

interface AssignmentHistory {
    date: string;
    reassignedFrom: string;
    reassignedTo: string;
    reason: string;
    _id: string;
}

const TerritoryMappingTable: React.FC<TerritoryTableProps> = ({
    entities = [],
    selectedEntities,
    toggleCheckbox,
    toggleActive,
    setSelectedEntities,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTerritory, setSelectedTerritory] = useState<TerritoryMappingType | null>(null);
    const [assignmentHistory, setAssignmentHistory] = useState<AssignmentHistory[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false); // Loading state for history fetch
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>({});
    const pageSize = 5;

    const isEntitiesArray = Array.isArray(entities);

    useEffect(() => {
        const newLoadingRows = entities.reduce((acc, entity) => {
            acc[entity._id] = true;
            return acc;
        }, {} as { [key: string]: boolean });

        setLoadingRows(newLoadingRows);

        
        entities.forEach((entity) => {
            setTimeout(() => {
                setLoadingRows((prev) => ({
                    ...prev,
                    [entity._id]: false,
                }));
            }, Math.random() * 1000 + 500);
        });
    }, [entities, currentPage]);

    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEntities = entities.slice(startIndex, endIndex);

    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSelectedEntities(isChecked ? paginatedEntities.map((entity) => entity._id) : []);
    };

    const showHistoryModal = async (entity: TerritoryMappingType) => {
        setSelectedTerritory(entity);
        setIsModalVisible(true);
        setHistoryLoading(true);

        try {
           
            const response = await axios.get(`http://localhost:4000/api/territory-mappings/${entity._id}`);
            const territoryData = response.data;
            setAssignmentHistory(territoryData.assignmentHistory || []);
        } catch (error) {
            console.error("Error fetching assignment history:", error);
            setAssignmentHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedTerritory(null);
        setAssignmentHistory([]);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedEntities([]);
    };

    
    const formatDate = (date: string) => {
        return dayjs(date).format('DD MMM YYYY');
    };

    if (!isEntitiesArray) {
        return <div>Invalid data for entities</div>;
    }

    return (
        <div className="bg-white rounded-lg p-4 mt-4 w-full">
            <div
                className="overflow-x-auto transition-opacity duration-300"
                style={{ opacity: isModalVisible ? 0.5 : 1 }}
            >
                <table className="w-full border-collapse shadow-md rounded-lg table-auto">
                    <thead>
                        <tr>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAllChange}
                                    checked={paginatedEntities.length > 0 && selectedEntities.length === paginatedEntities.length}
                                    disabled={paginatedEntities.length === 0}
                                />
                            </th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Code</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Name</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Executive</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Territory Manager</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Created By</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Created On</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">From Date</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">To Date</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Active</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">Edit</th>
                            <th className="p-3 text-center text-gray-500 whitespace-nowrap">History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEntities.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="p-3 text-center text-gray-500">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            paginatedEntities.map((entity) => (
                                <tr key={entity._id} className="border-t hover:bg-gray-50">
                                    {loadingRows[entity._id] ? (
                                        <td colSpan={12} className="p-3">
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
                                            <td className="p-3 text-center">{entity.name}</td>
                                            <td className="p-3 text-center">{entity.executive}</td>
                                            <td className="p-3 text-center">{entity.territoryManager}</td>
                                            <td className="p-3 text-center">{entity.createdBy}</td>
                                            <td className="p-3 text-center">{formatDate(entity.createdOn)}</td>
                                            <td className="p-3 text-center">{formatDate(entity.fromDate)}</td>
                                            <td className="p-3 text-center">{formatDate(entity.toDate)}</td>
                                            <td className="p-3 text-center">
                                                <Switch
                                                    checked={entity.status}
                                                    onChange={() => toggleActive(entity._id)}
                                                />
                                            </td>
                                            <td className="p-3 text-center">
                                                <Link to={`/edit-territory/${entity._id}`}>
                                                    <button className="text-blue-500 hover:underline">Edit</button>
                                                </Link>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => showHistoryModal(entity)}>
                                                    <img src={History} alt="history" className="mx-auto" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {entities.length > pageSize && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={entities.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}

            <Modal
                title={`Assignment History - ${selectedTerritory?.name || ''}`}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                <div className="max-h-[400px] overflow-y-auto">
                    {historyLoading ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : assignmentHistory.length > 0 ? (
                        assignmentHistory.map((history, index, array) => {
                            const isLastItem = index === array.length - 1;
                            return (
                                <div key={history._id} className="mb-4 flex items-start">
                                    <div className="flex flex-col items-center mr-4">
                                        {isLastItem ? (
                                            <ClockCircleOutlined
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#1890ff',
                                                    backgroundColor: '#e6f7ff',
                                                    borderRadius: '50%',
                                                    padding: '4px',
                                                }}
                                            />
                                        ) : (
                                            <CheckSquareOutlined
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#1890ff',
                                                    backgroundColor: '#e6f7ff',
                                                    borderRadius: '50%',
                                                    padding: '4px',
                                                }}
                                            />
                                        )}
                                        {index < array.length - 1 && (
                                            <div
                                                className="w-0.5 h-16 mt-1"
                                                style={{
                                                    background: index === array.length - 2 ? 'none' : '#d9d9d9',
                                                    borderLeft: index === array.length - 2 ? '1px dashed #d9d9d9' : 'none',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{formatDate(history.date)}</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">
                                            {`Reassigned from ${history.reassignedFrom} to ${history.reassignedTo}\n${history.reason}`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No history available</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default TerritoryMappingTable;
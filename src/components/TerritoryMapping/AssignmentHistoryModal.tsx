import React from 'react';
import { Modal } from 'antd';

interface HistoryEntry {
    date: string;
    description: string;
    createdBy: string;
    createdOn: string;
}

interface AssignmentHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    territoryName: string;
    historyData: HistoryEntry[];
}

const AssignmentHistoryModal: React.FC<AssignmentHistoryModalProps> = ({
    visible,
    onClose,
    territoryName,
    historyData,
}) => {
    return (
        <Modal
            title={`Assignment History - ${territoryName}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div className="max-h-[400px] overflow-y-auto">
                {historyData.length === 0 ? (
                    <p>No history available</p>
                ) : (
                    historyData.map((history, index) => (
                        <div key={index} className="mb-4 flex items-start">
                            <div className="flex flex-col items-center mr-4">
                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                {index < historyData.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{history.date}</p>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{history.description}</p>
                                <div className="flex justify-between mt-2">
                                    <p className="text-xs text-gray-500">{history.createdBy}</p>
                                    <p className="text-xs text-gray-500">{history.createdOn}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
};

export default AssignmentHistoryModal;
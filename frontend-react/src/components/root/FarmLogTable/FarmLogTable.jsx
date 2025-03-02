import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

// FilterInput với màu vintage (focus ring thay đổi)
const FilterInput = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col w-full md:w-auto mb-4 md:mb-0">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      className="block w-full md:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D]"
    />
  </div>
);

// DeviceSelect dành cho thiết bị Smart Farm
const DeviceSelect = ({ value, onChange, devices }) => (
  <div className="w-full md:w-auto mb-4 md:mb-0">
    <label className="block text-sm font-medium text-gray-700 mb-1">CHỌN THIẾT BỊ</label>
    <select
      value={value}
      onChange={onChange}
      className="block w-full md:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A0522D] focus:border-[#A0522D]"
    >
      <option value="reset">Tất cả thiết bị</option>
      {devices.length > 0 ? (
        devices.map((device) => (
          <option key={device.device_id} value={device.device_id}>
            {`${device.device_name} - ${device.khuVuc}`}
          </option>
        ))
      ) : (
        <option value="" disabled>Không có thiết bị nào</option>
      )}
    </select>
  </div>
);

// MobileTableRow hiển thị thông tin trên mobile với phong cách vintage
const MobileTableRow = ({ row, headers, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#FAF0E6] p-4 rounded-lg shadow-sm mb-4 border border-[#8B4513] cursor-pointer hover:bg-[#F5F5DC]"
  >
    {headers.map(({ key, label }) => (
      <div key={key} className="flex justify-between py-1">
        <span className="font-medium text-[#8B4513]">{label}:</span>
        <span className="text-[#4B3621]">{row[key]}</span>
      </div>
    ))}
  </div>
);

// Modal chi tiết lịch sử sử dụng thiết bị (Smart Farm)
const UsageHistoryDetail = React.memo(({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const DetailSection = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-[#8B4513] mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:justify-between border-b border-[#8B4513] py-2">
            <span className="font-medium text-[#8B4513]">{label}</span>
            <span className="text-[#4B3621]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const sections = {
    basic: {
      title: "Thông tin cơ bản",
      items: [
        ['ID thiết bị', data.device_id],
        ['Tên thiết bị', data.device_name],
        ['Khu vực', data.khuVuc]
      ]
    },
    details: {
      title: "Chi tiết sử dụng",
      items: [
        ['Giờ bắt đầu', data.usage_start],
        ['Giờ kết thúc', data.usage_end],
        ['Năng lượng tiêu thụ', data.energy_consumption]
      ]
    },
    time: {
      title: "Thời gian",
      items: [
        ['Ngày sử dụng', data.usage_date]
      ]
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-[#F5F5DC] rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#8B4513] hover:text-[#A0522D]"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#8B4513]">
            Chi tiết lịch sử sử dụng thiết bị Smart Farm
          </h2>
          <div className="overflow-y-auto max-h-[70vh] px-2">
            {Object.values(sections).map((section) => (
              <DetailSection key={section.title} {...section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Dummy data cho lịch sử sử dụng thiết bị Smart Farm
const dummyLogs = [
  {
    device_id: "D001",
    device_name: "Máy bơm tưới 1",
    khuVuc: "Khu A",
    usage_start: "06:00",
    usage_end: "06:30",
    usage_date: "2025-02-23",
    energy_consumption: "3 kWh"
  },
  {
    device_id: "D002",
    device_name: "Hệ thống chiếu sáng",
    khuVuc: "Khu A",
    usage_start: "18:00",
    usage_end: "23:00",
    usage_date: "2025-02-23",
    energy_consumption: "5 kWh"
  },
  // Có thể thêm dữ liệu mẫu khác nếu cần
];

// Dummy data cho danh sách thiết bị (dùng trong filter)
const dummyDevices = [
  {
    device_id: "D001",
    device_name: "Máy bơm tưới 1",
    khuVuc: "Khu A"
  },
  {
    device_id: "D002",
    device_name: "Hệ thống chiếu sáng",
    khuVuc: "Khu A"
  }
];

const DeviceUsageHistory = () => {
  // Giả sử role có thể là 'ADMIN' hoặc 'USER'
  const role = "ADMIN";

  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    deviceName: '',
    deviceId: 'reset',
    dateStart: '',
    dateEnd: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedDeviceName, setDebouncedDeviceName] = useState(filters.deviceName);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const rowsPerPage = isMobile ? 5 : 7;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowDetail(true);
  };

  // Lọc dữ liệu từ dummyLogs dựa trên filters
  const logs = useMemo(() => {
    let filtered = dummyLogs;
    if (filters.deviceName.trim()) {
      filtered = filtered.filter(log =>
        log.device_name.toLowerCase().includes(filters.deviceName.toLowerCase())
      );
    }
    if (filters.deviceId !== 'reset') {
      filtered = filtered.filter(log => log.device_id === filters.deviceId);
    }
    if (filters.dateStart) {
      filtered = filtered.filter(log => log.usage_date >= filters.dateStart);
    }
    if (filters.dateEnd) {
      filtered = filtered.filter(log => log.usage_date <= filters.dateEnd);
    }
    return filtered;
  }, [filters]);

  const tableHeaders = useMemo(() => {
    const headers = [
      { key: 'device_id', label: 'ID thiết bị' },
      { key: 'device_name', label: 'Tên thiết bị' },
      { key: 'khuVuc', label: 'Khu vực' },
      { key: 'usage_start', label: 'Giờ bắt đầu' },
      { key: 'usage_end', label: 'Giờ kết thúc' },
      { key: 'usage_date', label: 'Ngày sử dụng' }
    ];
    return headers;
  }, []);

  const handleFilterChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  }, []);

  // Debounce cho trường Tên thiết bị
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDeviceName(filters.deviceName);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filters.deviceName]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = logs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(logs.length / rowsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-8 text-[#8B4513]">
        LỊCH SỬ SỬ DỤNG THIẾT BỊ SMART FARM
      </h1>

      {/* Bộ lọc */}
      <div className="rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {role === "ADMIN" && (
            <FilterInput
              label="Tên thiết bị"
              value={filters.deviceName}
              onChange={handleFilterChange('deviceName')}
            />
          )}
          <DeviceSelect
            value={filters.deviceId}
            onChange={handleFilterChange('deviceId')}
            devices={dummyDevices}
          />
          <FilterInput
            label="TỪ"
            value={filters.dateStart}
            onChange={handleFilterChange('dateStart')}
            type="date"
          />
          <FilterInput
            label="ĐẾN"
            value={filters.dateEnd}
            onChange={handleFilterChange('dateEnd')}
            type="date"
          />
        </div>
      </div>

      {/* Hiển thị bảng dữ liệu */}
      {logs.length > 0 ? (
        <>
          {isMobile ? (
            <div className="space-y-4">
              {currentRows.map((row, index) => (
                <MobileTableRow
                  key={index}
                  row={row}
                  headers={tableHeaders}
                  onClick={() => handleRowClick(row)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#FAF0E6] rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#8B4513]">
                    {tableHeaders.map(({ key, label }) => (
                      <th key={key} className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider text-white">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8B4513]">
                  {currentRows.map((row, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(row)}
                      className={`${index % 2 === 0 ? 'bg-[#F5F5DC] hover:bg-[#EED6C4]' : 'bg-[#FAF0E6] hover:bg-[#F0D6B8]'} cursor-pointer transition-colors duration-150`}
                    >
                      {tableHeaders.map(({ key }) => (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#4B3621]">
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân trang */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md bg-[#FAF0E6] disabled:bg-gray-100 disabled:text-gray-400"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <span className="text-sm text-[#8B4513]">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md bg-[#FAF0E6] disabled:bg-gray-100 disabled:text-gray-400"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-600 bg-[#FAF0E6] rounded-lg shadow">
          Không có dữ liệu lịch sử sử dụng thiết bị
        </div>
      )}

      {/* Modal chi tiết */}
      <UsageHistoryDetail
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedRow || {}}
      />
    </div>
  );
};

export default DeviceUsageHistory;

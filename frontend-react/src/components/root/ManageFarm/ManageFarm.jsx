import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Thermometer, Droplets, Gauge, Sun, Settings, ChevronDown, X } from 'lucide-react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllNotificationsAsRead } from '../../../store/LogSlice';

const EnvironmentalDashboard = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "Khu vực 1",
      metrics: {
        light: { 
          value: 33.3, 
          unit: "%", 
          status: "normal", 
          thresholds: { low: 10, normal: 20, high: 50 },
          history: [29.5, 30.2, 31.8, 32.5, 33.3]
        },
        temperature: { 
          value: 33, 
          unit: "°C", 
          status: "normal", 
          thresholds: { low: 20, normal: 30, high: 35 },
          history: [31, 31.5, 32, 32.5, 33]
        },
        humidity: { 
          value: 60.2, 
          unit: "%", 
          status: "normal", 
          thresholds: { low: 40, normal: 60, high: 80 },
          history: [58.7, 59.1, 59.8, 60.0, 60.2]
        },
        soil: { 
          value: 55, 
          unit: "%", 
          status: "high", 
          thresholds: { low: 30, normal: 45, high: 55 },
          history: [51, 52, 53, 54, 55]
        }
      }
    }
  ]);

  const dispatch = useDispatch();
  const { notifications, notificationLoading, error } = useSelector(state => state.log);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [currentSetup, setCurrentSetup] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [viewMode, setViewMode] = useState("compact");
  const [collapsedZones, setCollapsedZones] = useState({});

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(notif => notif.newFlag === true);
  }, [notifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prevZones => {
        return prevZones.map(zone => {
          const updatedMetrics = { ...zone.metrics };
          Object.keys(updatedMetrics).forEach(metricKey => {
            const metric = updatedMetrics[metricKey];
            const randomChange = (Math.random() * 2 - 1) * 0.5;
            const newValue = Math.max(0, parseFloat((metric.value + randomChange).toFixed(1)));
            const newHistory = [...metric.history.slice(1), newValue];
            let newStatus = "normal";
            if (newValue <= metric.thresholds.low) newStatus = "low";
            else if (newValue >= metric.thresholds.high) newStatus = "high";
            updatedMetrics[metricKey] = {
              ...metric,
              value: newValue,
              status: newStatus,
              history: newHistory
            };
          });
          return { ...zone, metrics: updatedMetrics };
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleZoneCollapse = (zoneId) => {
    setCollapsedZones(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const handleMarkAllAsRead = () => {
    if (unreadNotifications.length > 0) {
      dispatch(markAllNotificationsAsRead())
        .then(() => {
          toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
        })
        .catch((error) => {
          toast.error("Không thể đánh dấu thông báo: " + error);
        });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "low":
        return "bg-blue-500";
      case "normal":
        return "bg-green-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMetricIcon = (type) => {
    switch (type) {
      case "light":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "temperature":
        return <Thermometer className="w-5 h-5 text-orange-500" />;
      case "humidity":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case "soil":
        return <Gauge className="w-5 h-5 text-brown-500" />;
      default:
        return null;
    }
  };

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'pump':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'light':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'fan':
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-500"><path d="M12 11C9.5 11 7.5 9 7.5 6.5S9.5 2 12 2s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path><path d="M12 22c-2.5 0-4.5-2-4.5-4.5S9.5 13 12 13s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path><path d="M19.6 6.5c1.2 2.1.1 4.8-2 6s-4.8.1-6-2-.1-4.8 2-6 4.8-.1 6 2z"></path><path d="M4.4 17.5c-1.2-2.1-.1-4.8 2-6s4.8-.1 6 2 .1 4.8-2 6-4.8.1-6-2z"></path></svg>;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMetricLabel = (type) => {
    switch (type) {
      case "light":
        return "Cường độ ánh sáng";
      case "temperature":
        return "Nhiệt độ";
      case "humidity":
        return "Độ ẩm không khí";
      case "soil":
        return "Độ ẩm đất";
      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "low":
        return "Thấp";
      case "normal":
        return "Bình thường";
      case "high":
        return "Cao";
      default:
        return "";
    }
  };

  const openSetupModal = (zoneId, metricType) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      setCurrentZone(zone);
      setCurrentSetup({
        metricType,
        thresholds: { ...zone.metrics[metricType].thresholds }
      });
      setShowSetupModal(true);
    }
  };

  const updateThresholds = () => {
    if (!currentZone || !currentSetup) return;
    const { low, normal, high } = currentSetup.thresholds;
    if (low >= normal || normal >= high) {
      toast.error("Các ngưỡng phải được đặt theo thứ tự tăng dần (Thấp < Bình thường < Cao)");
      return;
    }
    const updatedZones = zones.map(zone => {
      if (zone.id === currentZone.id) {
        const updatedMetrics = { ...zone.metrics };
        updatedMetrics[currentSetup.metricType].thresholds = currentSetup.thresholds;
        const value = updatedMetrics[currentSetup.metricType].value;
        const thresholds = currentSetup.thresholds;
        let newStatus = "normal";
        if (value <= thresholds.low) newStatus = "low";
        else if (value >= thresholds.high) newStatus = "high";
        updatedMetrics[currentSetup.metricType].status = newStatus;
        return { ...zone, metrics: updatedMetrics };
      }
      return zone;
    });
    setZones(updatedZones);
    toast.success("Đã cập nhật ngưỡng thành công");
    setShowSetupModal(false);
  };

  const renderMiniTrend = (history, status) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    return (
      <div className="flex items-end h-8 space-x-1 mt-1">
        {history.map((value, index) => {
          const height = Math.max(10, ((value - min) / range) * 25 + 5);
          return (
            <div 
              key={index}
              className={`w-1 rounded-t ${getStatusBgColor(status)} opacity-${index * 20 + 20}`} 
              style={{ height: `${height}px` }}
            ></div>
          );
        })}
      </div>
    );
  };

  const renderDetailedView = (zone) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {Object.entries(zone.metrics).map(([key, metric]) => (
          <div 
            key={key} 
            className={`p-4 rounded-lg border ${getStatusColor(metric.status)} shadow-sm`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                {getMetricIcon(key)}
                <h3 className="ml-2 font-medium">{getMetricLabel(key)}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {getStatusLabel(metric.status)}
              </span>
            </div>
            
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold">{metric.value}</span>
              <span className="ml-1 text-lg mb-1">{metric.unit}</span>
            </div>
            
            <div className="mt-4 mb-3">
              <p className="text-xs text-gray-500 mb-1">Xu hướng gần đây</p>
              {renderMiniTrend(metric.history, metric.status)}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-4 border-t pt-3">
              <div>
                <p className="font-medium">Ngưỡng thấp</p>
                <p className="text-blue-600">{metric.thresholds.low}{metric.unit}</p>
              </div>
              <div>
                <p className="font-medium">Ngưỡng BT</p>
                <p className="text-green-600">{metric.thresholds.normal}{metric.unit}</p>
              </div>
              <div>
                <p className="font-medium">Ngưỡng cao</p>
                <p className="text-red-600">{metric.thresholds.high}{metric.unit}</p>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md py-1 px-3 hover:bg-blue-50 transition-colors"
              onClick={() => openSetupModal(zone.id, key)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Thiết lập ngưỡng
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderCompactView = (zone) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {Object.entries(zone.metrics).map(([key, metric]) => (
          <div 
            key={key} 
            className={`p-3 rounded-lg border ${getStatusColor(metric.status)} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getMetricIcon(key)}
                <h3 className="ml-2 text-sm font-medium">{getMetricLabel(key)}</h3>
              </div>
              <button 
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => openSetupModal(zone.id, key)}
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className="ml-1 text-sm">{metric.unit}</span>
              <span className="ml-auto text-xs font-medium">{getStatusLabel(metric.status)}</span>
            </div>
            {renderMiniTrend(metric.history, metric.status)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-blue-800">Bảng điều khiển môi trường</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                className={`px-3 py-1 rounded text-sm font-medium ${viewMode === "compact" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setViewMode("compact")}
              >
                Thu gọn
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm font-medium ${viewMode === "detailed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setViewMode("detailed")}
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {unreadNotifications.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-0 mb-4 max-h-40 overflow-y-auto">
          <div className="px-4 py-3 flex justify-between items-center border-b border-red-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="ml-2 text-sm font-medium text-red-800">Cảnh báo ({unreadNotifications.length})</h3>
            </div>
            <button 
              className="text-blue-600 font-medium hover:bg-blue-100 p-1 rounded text-xs"
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="divide-y divide-red-100">
            {unreadNotifications.map((notification, index) => (
              <div 
                key={index} 
                className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-red-100"
              >
                <div className="flex items-center">
                  {getDeviceIcon(notification.device)}
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{notification.title}</p>
                    <p className="text-xs text-red-500">{notification.dtime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto py-6 px-4">
        {zones.map((zone) => (
          <div key={zone.id} className="mb-6 border rounded-lg overflow-hidden bg-white shadow">
            <div 
              className="bg-blue-50 px-4 py-3 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleZoneCollapse(zone.id)}
            >
              <h2 className="text-lg font-medium text-blue-800">{zone.name}</h2>
              <ChevronDown 
                className={`w-5 h-5 text-blue-600 transition-transform ${collapsedZones[zone.id] ? 'rotate-180' : ''}`} 
              />
            </div>
            
            {!collapsedZones[zone.id] && (
              viewMode === "detailed" ? renderDetailedView(zone) : renderCompactView(zone)
            )}
          </div>
        ))}
      </div>

      {showSetupModal && currentSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Thiết lập ngưỡng cho {getMetricLabel(currentSetup.metricType)}
              </h3>
              <button onClick={() => setShowSetupModal(false)} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Đóng</span>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngưỡng thấp</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentSetup.thresholds.low}
                  onChange={(e) => setCurrentSetup({
                    ...currentSetup,
                    thresholds: {
                      ...currentSetup.thresholds,
                      low: parseFloat(e.target.value)
                    }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">Giá trị dưới mức này được xem là thấp</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngưỡng bình thường</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentSetup.thresholds.normal}
                  onChange={(e) => setCurrentSetup({
                    ...currentSetup,
                    thresholds: {
                      ...currentSetup.thresholds,
                      normal: parseFloat(e.target.value)
                    }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">Giá trị tham chiếu cho mức bình thường</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngưỡng cao</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentSetup.thresholds.high}
                  onChange={(e) => setCurrentSetup({
                    ...currentSetup,
                    thresholds: {
                      ...currentSetup.thresholds,
                      high: parseFloat(e.target.value)
                    }
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">Giá trị trên mức này được xem là cao</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
                <p>Lưu ý: Các ngưỡng phải được đặt theo thứ tự tăng dần (Thấp &lt; Bình thường &lt; Cao)</p>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowSetupModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                onClick={updateThresholds}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalDashboard;
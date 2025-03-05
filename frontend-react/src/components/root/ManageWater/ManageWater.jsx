import React, { useState, useEffect } from 'react';
import { Settings, Clock, Droplet, Save, Plus, X, Thermometer, AlertTriangle } from 'lucide-react';
import { toast } from "react-toastify";

const OptimizedIrrigationSystem = () => {
  const [activeZone, setActiveZone] = useState('A');
  const [autoMode, setAutoMode] = useState(true);
  const [schedulingMethod, setSchedulingMethod] = useState('time');
  const [systemStatus, setSystemStatus] = useState('normal'); // 'normal', 'warning', 'error'
  const [lastWatered, setLastWatered] = useState('08:15 AM');
  const [nextScheduled, setNextScheduled] = useState('03:30 PM');
  const [waterSaved, setWaterSaved] = useState(24); // Percentage
  
  // Pumps state
  const [pumps, setPumps] = useState([
    { id: 1, name: 'Máy bơm 1', zone: 'A', isOn: true, isActive: true, pressure: 2.8, flow: 12 },
    { id: 2, name: 'Máy bơm 2', zone: 'A', isOn: false, isActive: false, pressure: 3.0, flow: 14 },
    { id: 3, name: 'Máy bơm 1', zone: 'B', isOn: true, isActive: true, pressure: 2.7, flow: 11 },
    { id: 4, name: 'Máy bơm 2', zone: 'B', isOn: false, isActive: false, pressure: 2.9, flow: 13 }
  ]);

  // Schedule times
  const [scheduleTimes, setScheduleTimes] = useState([
    { id: 1, time: '05:30 AM', duration: 30, active: true },
    { id: 2, time: '03:30 PM', duration: 20, active: true }
  ]);

  // Sensor settings
  const [sensorSettings, setSensorSettings] = useState({
    soilMoisture: 30,
    maxTemperature: 35,
    rainProbability: 60
  });

  // Weather data
  const [weather, setWeather] = useState({
    temperature: 31,
    humidity: 72,
    rainChance: 30,
    soilMoisture: 42
  });

  const togglePump = (id) => {
    setPumps(pumps.map(pump => 
      pump.id === id ? { ...pump, isOn: !pump.isOn } : pump
    ));
    toast.success(`Đã ${pumps.find(p => p.id === id).isOn ? 'tắt' : 'bật'} ${pumps.find(p => p.id === id).name}`);
  };

  const togglePumpActive = (id) => {
    setPumps(pumps.map(pump => 
      pump.id === id ? { ...pump, isActive: !pump.isActive, isOn: !pump.isActive ? false : pump.isOn } : pump
    ));
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    toast.info(`Đã chuyển sang chế độ ${!autoMode ? 'tự động' : 'thủ công'}`);
  };

  const changeZone = (zone) => {
    setActiveZone(zone);
  };

  const changeSchedulingMethod = (method) => {
    setSchedulingMethod(method);
  };

  const addScheduleTime = () => {
    const newId = scheduleTimes.length > 0 ? Math.max(...scheduleTimes.map(s => s.id)) + 1 : 1;
    setScheduleTimes([...scheduleTimes, { id: newId, time: '12:00 PM', duration: 15, active: true }]);
  };

  const removeScheduleTime = (id) => {
    setScheduleTimes(scheduleTimes.filter(time => time.id !== id));
    toast.info("Đã xóa lịch tưới");
  };

  const updateScheduleTime = (id, time) => {
    setScheduleTimes(scheduleTimes.map(schedule => 
      schedule.id === id ? { ...schedule, time } : schedule
    ));
  };

  const updateScheduleDuration = (id, duration) => {
    setScheduleTimes(scheduleTimes.map(schedule => 
      schedule.id === id ? { ...schedule, duration } : schedule
    ));
  };

  const saveSchedule = () => {
    toast.success("Đã lưu lịch tưới thành công");
  };

  const saveSensorSettings = () => {
    toast.success("Đã lưu cài đặt cảm biến thành công");
  };

  const updateSensorSetting = (setting, value) => {
    setSensorSettings({
      ...sensorSettings,
      [setting]: value
    });
  };

  const runManualIrrigation = () => {
    toast.success("Đã bắt đầu tưới thủ công");
    // Logic to start manual irrigation would go here
  };

  const filteredPumps = pumps.filter(pump => pump.zone === activeZone);

  // Simulating weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        soilMoisture: Math.max(20, Math.min(90, prev.soilMoisture - 0.2))
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getSystemStatusColor = () => {
    switch(systemStatus) {
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Hệ Thống Tưới Tự Động</h1>
            <p className="text-blue-600 mt-1">Tối ưu hóa sử dụng nước và bảo vệ cây trồng</p>
          </div>
          <div className="flex items-center mt-3 md:mt-0">
            <div className={`flex items-center mr-4 ${getSystemStatusColor()}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${systemStatus === 'normal' ? 'bg-green-500' : systemStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
              <span>Hệ thống {systemStatus === 'normal' ? 'hoạt động bình thường' : systemStatus === 'warning' ? 'cần chú ý' : 'có lỗi'}</span>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Weather & System Stats Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-lg font-medium">Thông tin hệ thống</h2>
            </div>
            
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Nhiệt độ</span>
                    <span className="text-blue-900 font-medium">{weather.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(weather.temperature / 45) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Độ ẩm không khí</span>
                    <span className="text-blue-900 font-medium">{weather.humidity}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${weather.humidity}%` }}></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Độ ẩm đất</span>
                    <span className="text-blue-900 font-medium">{weather.soilMoisture}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${weather.soilMoisture}%` }}></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Khả năng mưa</span>
                    <span className="text-blue-900 font-medium">{weather.rainChance}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${weather.rainChance}%` }}></div>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-blue-100 pt-4">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-blue-800">Lần tưới cuối:</span>
                    <span className="text-blue-900 font-medium">{lastWatered}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-blue-800">Lần tưới tiếp theo:</span>
                    <span className="text-blue-900 font-medium">{nextScheduled}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">Tiết kiệm nước:</span>
                    <span className="text-green-600 font-medium">{waterSaved}%</span>
                  </div>
                </div>
                
                {!autoMode && (
                  <button 
                    onClick={runManualIrrigation}
                    className="mt-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Droplet size={16} className="mr-2" />
                    Tưới ngay
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Control Panel */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
            {/* Zone Controls */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    className={`px-4 py-2 rounded-lg transition-all ${activeZone === 'A' ? 'bg-white text-blue-800 font-medium' : 'bg-blue-700 hover:bg-blue-600'}`}
                    onClick={() => changeZone('A')}
                  >
                    Khu A
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-all ${activeZone === 'B' ? 'bg-white text-blue-800 font-medium' : 'bg-blue-700 hover:bg-blue-600'}`}
                    onClick={() => changeZone('B')}
                  >
                    Khu B
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <span className="font-medium">Tự động</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={autoMode} 
                      onChange={toggleAutoMode}
                    />
                    <div className="relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out bg-blue-900">
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${autoMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Pump Controls */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Điều khiển máy bơm - Khu {activeZone}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPumps.map(pump => (
                  <div 
                    key={pump.id}
                    className={`rounded-xl p-5 transition-all ${!pump.isActive ? 'bg-gray-100' : 'bg-white'} border ${pump.isOn && pump.isActive ? 'border-blue-400 shadow-md' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{pump.name}</h3>
                      <div className="flex items-center">
                        <span className="text-sm mr-2 text-gray-500">Kích hoạt</span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={pump.isActive} 
                            onChange={() => togglePumpActive(pump.id)}
                          />
                          <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${pump.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${pump.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-center my-6">
                      <div className={`p-4 rounded-full ${pump.isOn && pump.isActive ? 'bg-blue-50' : ''}`}>
                        <div className="relative">
                          <svg viewBox="0 0 100 100" width="80" height="80" className={`${pump.isOn && pump.isActive ? 'text-blue-600' : 'text-gray-300'}`}>
                            <rect x="30" y="20" width="40" height="50" rx="2" fill="currentColor" />
                            <rect x="70" y="30" width="10" height="10" rx="1" fill="currentColor" />
                            <path d="M20 70 L80 70 L80 80 L85 80 L85 90 L15 90 L15 80 L20 80 Z" fill="currentColor" />
                          </svg>
                          
                          {pump.isOn && pump.isActive && (
                            <>
                              <Droplet className="absolute -top-2 -right-2 h-6 w-6 text-blue-400 animate-pulse" />
                              <Droplet className="absolute -top-1 right-8 h-4 w-4 text-blue-300 animate-pulse" style={{animationDelay: '0.2s'}} />
                              <Droplet className="absolute top-4 -right-4 h-5 w-5 text-blue-500 animate-pulse" style={{animationDelay: '0.4s'}} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        className={`py-2 px-6 rounded-lg ${pump.isActive ? (pump.isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600') : 'bg-gray-300 cursor-not-allowed'} text-white font-medium transition-colors`}
                        onClick={() => togglePump(pump.id)}
                        disabled={!pump.isActive}
                      >
                        {pump.isOn ? 'Tắt máy bơm' : 'Bật máy bơm'}
                      </button>
                    </div>
                    
                    {pump.isOn && pump.isActive && (
                      <div className="mt-4 pt-3 border-t border-blue-100">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center text-blue-800">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-blue-600">
                              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Áp suất: {pump.pressure} bar</span>
                          </div>
                          <div className="flex items-center text-blue-800">
                            <Droplet className="h-4 w-4 mr-1 text-blue-600" />
                            <span>Lưu lượng: {pump.flow} L/phút</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scheduling Panel */}
            <div className="border-t border-blue-100 p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Lịch trình tưới</h2>
              
              <div className="flex space-x-3 mb-6">
                <button 
                  className={`py-2 px-6 rounded-lg transition-all flex-1 ${schedulingMethod === 'time' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 text-blue-800 hover:bg-blue-50'}`}
                  onClick={() => changeSchedulingMethod('time')}
                >
                  <Clock className="h-4 w-4 inline mr-2" />
                  Theo thời gian
                </button>
                <button 
                  className={`py-2 px-6 rounded-lg transition-all flex-1 ${schedulingMethod === 'sensor' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 text-blue-800 hover:bg-blue-50'}`}
                  onClick={() => changeSchedulingMethod('sensor')}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 inline mr-2">
                    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  Theo cảm biến
                </button>
              </div>
              
              {schedulingMethod === 'time' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduleTimes.map(schedule => (
                      <div key={schedule.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-blue-800 font-medium">{schedule.time}</span>
                          </div>
                          <button 
                            className="p-1.5 rounded-full text-red-500 hover:bg-red-50"
                            onClick={() => removeScheduleTime(schedule.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="mb-2">
                          <label className="block text-sm text-gray-600 mb-1">Thời gian tưới (phút)</label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              min="5" 
                              max="60" 
                              value={schedule.duration}
                              onChange={(e) => updateScheduleDuration(schedule.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-blue-800 font-medium ml-2 w-8">{schedule.duration}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-blue-600 mt-2">
                          <span className="block">• Khu vực: {activeZone}</span>
                          <span className="block">• Tổng lượng nước: ~{schedule.duration * 10} lít</span>
                        </div>
                      </div>
                    ))}
                    
                    <div 
                      className="border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={addScheduleTime}
                    >
                      <div className="text-center">
                        <Plus size={24} className="mx-auto mb-2 text-blue-500" />
                        <span className="text-blue-700">Thêm lịch tưới</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-6 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={saveSchedule}
                  >
                    <Save size={16} className="mr-2" />
                    Lưu lịch trình
                  </button>
                </div>
              )}
              
              {schedulingMethod === 'sensor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2 flex items-center">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-blue-500">
                          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" stroke-linecap="round" />
                        </svg>
                        Độ ẩm đất tối thiểu (%)
                      </label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          min="10" 
                          max="70" 
                          value={sensorSettings.soilMoisture}
                          onChange={(e) => updateSensorSetting('soilMoisture', parseInt(e.target.value))}
                          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-blue-800 font-medium ml-3 w-8">{sensorSettings.soilMoisture}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Khô (10%)</span>
                        <span>Ẩm (70%)</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2 flex items-center">
                        <Thermometer size={16} className="mr-1 text-blue-500" />
                        Nhiệt độ tối đa (°C)
                      </label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          min="25" 
                          max="40" 
                          value={sensorSettings.maxTemperature}
                          onChange={(e) => updateSensorSetting('maxTemperature', parseInt(e.target.value))}
                          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-blue-800 font-medium ml-3 w-8">{sensorSettings.maxTemperature}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>25°C</span>
                        <span>40°C</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2 flex items-center">
                        <AlertTriangle size={16} className="mr-1 text-blue-500" />
                        Khả năng mưa tối đa (%)
                      </label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          min="20" 
                          max="80" 
                          value={sensorSettings.rainProbability}
                          onChange={(e) => updateSensorSetting('rainProbability', parseInt(e.target.value))}
                          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-blue-800 font-medium ml-3 w-8">{sensorSettings.rainProbability}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Ít khả năng (20%)</span>
                        <span>Khả năng cao (80%)</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Hệ thống sẽ không tưới nếu khả năng mưa cao hơn ngưỡng cài đặt
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-3">
                      <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn sử dụng</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Hệ thống sẽ tưới khi độ ẩm đất thấp hơn ngưỡng cài đặt</li>
                        <li>• Khi nhiệt độ cao hơn ngưỡng cài đặt, hệ thống sẽ tưới thêm</li>
                        <li>• Tự động tạm dừng khi trời mưa hoặc có khả năng mưa cao</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    className="md:col-span-2 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    onClick={saveSensorSettings}
                  >
                    <Save size={16} className="mr-2" />
                    Lưu cài đặt cảm biến
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedIrrigationSystem;
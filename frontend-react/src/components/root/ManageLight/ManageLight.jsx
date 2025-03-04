import React, { useState, useEffect } from 'react';
import {
    LightbulbOff,
    LightbulbIcon,
    Clock,
    AlertTriangle,
    History,
    Battery,
    PieChart,
    Power
} from 'lucide-react';
import { toast } from "react-toastify";

const OptimizedLightControlSystem = () => {
    const [activeZone, setActiveZone] = useState('A');
    const [autoMode, setAutoMode] = useState(true);
    const [schedulingMethod, setSchedulingMethod] = useState('time');
    const [timeSchedule, setTimeSchedule] = useState({ start: '05:30', end: '18:30' });
    const [energyData, setEnergyData] = useState({ today: 2.4, week: 14.8, month: 58.6 });
    const [showEnergyStats, setShowEnergyStats] = useState(false);

    // Lights state with enhanced properties
    const [lights, setLights] = useState([
        { id: 1, name: 'Đèn 1', zone: 'A', isOn: true, isActive: true, brightness: 80, lastActivity: '10 phút trước', batteryLevel: 85 },
        { id: 2, name: 'Đèn 2', zone: 'A', isOn: false, isActive: false, brightness: 0, lastActivity: '2 giờ trước', batteryLevel: 92 },
        { id: 3, name: 'Đèn 1', zone: 'B', isOn: true, isActive: true, brightness: 60, lastActivity: '5 phút trước', batteryLevel: 73 },
        { id: 4, name: 'Đèn 2', zone: 'B', isOn: false, isActive: false, brightness: 0, lastActivity: '1 giờ trước', batteryLevel: 68 }
    ]);

    // Simulate auto mode behavior
    useEffect(() => {
        if (!autoMode) return;

        const interval = setInterval(() => {
            const currentHour = new Date().getHours();
            const [startHour] = timeSchedule.start.split(':').map(Number);
            const [endHour] = timeSchedule.end.split(':').map(Number);

            const shouldBeOn = currentHour >= startHour && currentHour < endHour;

            if (schedulingMethod === 'time') {
                setLights(prevLights =>
                    prevLights.map(light => ({
                        ...light,
                        isOn: light.isActive ? shouldBeOn : light.isOn
                    }))
                );
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [autoMode, schedulingMethod, timeSchedule]);

    const toggleLight = (id) => {
        setLights(lights.map(light =>
            light.id === id ? { ...light, isOn: !light.isOn } : light
        ));

        // Show toast notification
        const light = lights.find(l => l.id === id);
        toast.success(`${light.name} đã được ${!light.isOn ? 'bật' : 'tắt'}`);
    };

    const toggleLightActive = (id) => {
        setLights(lights.map(light =>
            light.id === id ? { ...light, isActive: !light.isActive, isOn: !light.isActive ? false : light.isOn } : light
        ));

        const light = lights.find(l => l.id === id);
        toast.info(`${light.name} đã được ${!light.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`);
    };

    const toggleAutoMode = () => {
        setAutoMode(!autoMode);
        toast.info(`Chế độ tự động đã được ${!autoMode ? 'bật' : 'tắt'}`);
    };

    const changeZone = (zone) => {
        setActiveZone(zone);
    };

    const changeSchedulingMethod = (method) => {
        setSchedulingMethod(method);
        toast.info(`Phương pháp lập lịch đã chuyển sang ${method === 'time' ? 'theo thời gian' : 'theo cảm biến'}`);
    };

    const adjustBrightness = (id, value) => {
        setLights(lights.map(light =>
            light.id === id ? { ...light, brightness: value, isOn: value > 0 } : light
        ));
    };

    const handleTimeChange = (type, value) => {
        setTimeSchedule(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const filteredLights = lights.filter(light => light.zone === activeZone);

    // Calculate energy statistics
    const activeLights = lights.filter(light => light.isOn).length;
    const energySavingPercentage = ((lights.length - activeLights) / lights.length) * 100;

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-green-800">Hệ Thống Điều Khiển Đèn</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowEnergyStats(!showEnergyStats)}
                            className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100"
                        >
                            <PieChart className="h-5 w-5 mr-2" />
                            Tiết kiệm năng lượng
                        </button>
                    </div>
                </div>

                {showEnergyStats && (
                    <div className="bg-white rounded-xl shadow-md border border-green-100 p-5 mb-6">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Số liệu tiết kiệm năng lượng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm text-green-600 mb-1">Tiết kiệm hôm nay</div>
                                <div className="text-2xl font-bold text-green-800">{energyData.today} kWh</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm text-green-600 mb-1">Tiết kiệm tuần này</div>
                                <div className="text-2xl font-bold text-green-800">{energyData.week} kWh</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm text-green-600 mb-1">Tiết kiệm tháng này</div>
                                <div className="text-2xl font-bold text-green-800">{energyData.month} kWh</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className="text-green-700 font-medium">Đèn đang hoạt động: {activeLights}/{lights.length}</div>
                                <div className="ml-auto text-green-700 font-medium">Tiết kiệm: {energySavingPercentage.toFixed(0)}%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${energySavingPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                    {/* Control Panel */}
                    <div className="p-4 bg-gradient-to-r from-green-600 to-green-800 text-white">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="flex space-x-4">
                                <button
                                    className={`px-4 py-2 rounded-lg transition-all ${activeZone === 'A' ? 'bg-white text-green-800 font-medium' : 'bg-green-700 hover:bg-green-600'}`}
                                    onClick={() => changeZone('A')}
                                >
                                    Khu A
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg transition-all ${activeZone === 'B' ? 'bg-white text-green-800 font-medium' : 'bg-green-700 hover:bg-green-600'}`}
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
                                    <div className="relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out bg-green-900">
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${autoMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Auto Mode Controls */}
                    {autoMode && (
                        <div className="bg-green-50 p-4 flex flex-wrap items-center gap-3 border-b border-green-100">
                            <button
                                className={`py-2 px-6 rounded-lg transition-all ${schedulingMethod === 'time' ? 'bg-green-600 text-white' : 'bg-white border border-green-300 text-green-800 hover:bg-green-100'}`}
                                onClick={() => changeSchedulingMethod('time')}
                            >
                                <Clock className="h-4 w-4 inline mr-2" />
                                Theo thời gian
                            </button>
                            <button
                                className={`py-2 px-6 rounded-lg transition-all ${schedulingMethod === 'sensor' ? 'bg-green-600 text-white' : 'bg-white border border-green-300 text-green-800 hover:bg-green-100'}`}
                                onClick={() => changeSchedulingMethod('sensor')}
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4 inline mr-2">
                                    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                                </svg>
                                Theo cảm biến
                            </button>

                            {schedulingMethod === 'time' && (
                                <div className="flex flex-wrap items-center ml-auto bg-white px-3 py-2 rounded-lg border border-green-200">
                                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                                    <div className="flex items-center">
                                        <input
                                            type="time"
                                            className="w-20 p-1 text-sm border border-green-200 rounded mr-2"
                                            value={timeSchedule.start}
                                            onChange={(e) => handleTimeChange('start', e.target.value)}
                                        />
                                        <span className="mx-1 text-green-800">-</span>
                                        <input
                                            type="time"
                                            className="w-20 p-1 text-sm border border-green-200 rounded"
                                            value={timeSchedule.end}
                                            onChange={(e) => handleTimeChange('end', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {schedulingMethod === 'sensor' && (
                                <div className="ml-auto text-green-800 bg-white px-3 py-2 rounded-lg border border-green-200">
                                    <AlertTriangle className="h-4 w-4 inline mr-1 text-yellow-500" />
                                    Cảm biến hoạt động
                                </div>
                            )}
                        </div>
                    )}

                    {/* Light Controls */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Điều khiển đèn - Khu {activeZone}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredLights.map(light => (
                                <div
                                    key={light.id}
                                    className={`rounded-xl p-6 transition-all ${!light.isActive ? 'bg-gray-100' : 'bg-white'} border ${light.isOn && light.isActive ? 'border-green-400 shadow-md' : 'border-gray-200'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-medium">{light.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-center">Kích hoạt</span>
                                            <button
                                                className={`p-1.5 rounded-md ${light.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                onClick={() => toggleLightActive(light.id)}
                                                title={light.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                            >
                                                <Power size={16} />
                                            </button>
                                        </div>
                                    </div>


                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <History className="h-3 w-3 mr-1" />
                                        <span>{light.lastActivity}</span>
                                        <div className="ml-auto flex items-center">
                                            <Battery className="h-3 w-3 mr-1" />
                                            <span>{light.batteryLevel}%</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center my-4">
                                        {light.isActive ? (
                                            <div className={`p-4 rounded-full ${light.isOn ? 'bg-yellow-50' : ''}`}>
                                                <LightbulbIcon
                                                    size={70}
                                                    className={`${light.isOn ? 'text-yellow-500' : 'text-gray-300'}`}
                                                />
                                                {light.isOn && (
                                                    <div className="w-full mt-2 flex justify-center">
                                                        <div className="animate-pulse bg-yellow-200 h-2 w-24 rounded-full opacity-75"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-full">
                                                <LightbulbOff size={70} className="text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {light.isActive && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Độ sáng</span>
                                                <span>{light.brightness}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={light.brightness}
                                                onChange={(e) => adjustBrightness(light.id, parseInt(e.target.value))}
                                                disabled={!light.isActive}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-center mt-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={light.isOn}
                                                onChange={() => toggleLight(light.id)}
                                                disabled={!light.isActive}
                                            />
                                            <div className={`relative w-16 h-8 rounded-full transition-colors duration-200 ease-in-out ${light.isActive ? (light.isOn ? 'bg-green-500' : 'bg-gray-300') : 'bg-gray-200'}`}>
                                                <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${light.isOn ? 'translate-x-8' : 'translate-x-0'}`}></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizedLightControlSystem;
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSystemStats } from '../../../store/SystemSlice';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const PlantMonitoringDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.system);
  
  // State management
  const [chartType, setChartType] = useState('line');
  const [selectedMetrics, setSelectedMetrics] = useState({
    temperature: true,
    airHumidity: true,
    soilMoisture: true,
    light: true
  });
  const [dateRange, setDateRange] = useState('all');
  
  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchSystemStats());
  }, [dispatch]);

  // Enhanced colors with better contrast
  const colors = {
    temperature: '#E53935', // Darker red for better visibility
    airHumidity: '#1976D2', // Darker blue
    soilMoisture: '#2E7D32', // Darker green
    light: '#F57F17' // Darker amber
  };

  // Labels and units for metrics
  const metricInfo = {
    temperature: { label: 'Nhiệt độ', unit: '°C', idealRange: [22, 30], key: 'temperature' },
    airHumidity: { label: 'Độ ẩm không khí', unit: '%', idealRange: [40, 60], key: 'humidity' },
    soilMoisture: { label: 'Độ ẩm đất', unit: '%', idealRange: [60, 80], key: 'moisture' },
    light: { label: 'Ánh sáng', unit: 'lux', idealRange: [80, 120], key: 'light' }
  };

  // Format date 
  const formatDate = useCallback((daysAgo) => {
    const date = subDays(new Date(), daysAgo);
    return format(date, 'dd/MM', { locale: vi });
  }, []);

  // Prepare data for charts from API response
  const processedData = useMemo(() => {
    if (!stats) return [];
    
    // Determine the total number of days based on data length
    const totalDays = 5; // Assuming we want to show 5 days worth of data
    const dataPointsPerDay = Math.floor(stats.temperature?.length / totalDays) || 1;
    
    // Create data points for visualization
    const dataPoints = [];
    for (let i = totalDays-1; i >= 0; i--) {
      const index = i * dataPointsPerDay;
      if (index < 0 || index >= stats.temperature?.length) continue;
      
      dataPoints.push({
        date: formatDate(i),
        temperature: stats.temperature?.[index] || 0,
        airHumidity: stats.humidity?.[index] || 0,
        soilMoisture: stats.moisture?.[index] || 0,
        light: stats.light?.[index] || 0
      });
    }
    
    return dataPoints;
  }, [stats, formatDate]);
  
  // Filtered data based on selected date range
  const filteredData = useMemo(() => {
    if (dateRange === 'all' || processedData.length === 0) return processedData;
    const days = parseInt(dateRange);
    return processedData.slice(-days);
  }, [dateRange, processedData]);

  // Calculate statistics for each metric
  const statistics = useMemo(() => {
    if (!stats) return {};
    
    const calculateStats = (data) => {
      const values = data.filter(v => typeof v === 'number' && !isNaN(v));
      if (values.length === 0) return { current: 0, avg: 0, min: 0, max: 0, trend: 'stable' };
      
      const current = values[values.length - 1];
      const prev = values[values.length - 2] || current;
      return {
        current,
        avg: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 10) / 10,
        min: Math.min(...values),
        max: Math.max(...values),
        trend: current > prev ? 'up' : current < prev ? 'down' : 'stable'
      };
    };

    return {
      temperature: calculateStats(stats.temperature || []),
      airHumidity: calculateStats(stats.humidity || []),
      soilMoisture: calculateStats(stats.moisture || []),
      light: calculateStats(stats.light || [])
    };
  }, [stats]);

  // Check if current value is within ideal range
  const getStatusIndicator = useCallback((metric, value) => {
    const [min, max] = metricInfo[metric].idealRange;
    if (value < min) return { color: '#FFC107', text: 'Thấp' }; // Yellow for low
    if (value > max) return { color: '#F44336', text: 'Cao' }; // Red for high
    return { color: '#4CAF50', text: 'Tốt' }; // Green for good
  }, [metricInfo]);

  // Toggle chart type handler
  const handleChartTypeChange = useCallback((type) => {
    setChartType(type);
  }, []);

  // Toggle metric visibility handler
  const toggleMetric = useCallback((metric) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  }, []);

  // Change date range handler
  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Giám sát Môi trường Cây trồng</h1>
              <p className="text-gray-600">Dữ liệu từ hệ thống Smart Farm</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              {/* Date range selector */}
              <div className="flex bg-gray-100 rounded-lg">
                <button 
                  className={`px-3 py-2 text-sm rounded-l-lg ${dateRange === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleDateRangeChange('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={`px-3 py-2 text-sm ${dateRange === '3' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleDateRangeChange('3')}
                >
                  3 ngày
                </button>
                <button 
                  className={`px-3 py-2 text-sm rounded-r-lg ${dateRange === '2' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleDateRangeChange('2')}
                >
                  2 ngày
                </button>
              </div>
              
              {/* Chart type selector */}
              <div className="flex bg-gray-100 rounded-lg">
                <button 
                  className={`px-3 py-2 text-sm rounded-l-lg ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleChartTypeChange('line')}
                >
                  Biểu đồ đường
                </button>
                <button 
                  className={`px-3 py-2 text-sm rounded-r-lg ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => handleChartTypeChange('bar')}
                >
                  Biểu đồ cột
                </button>
              </div>
            </div>
          </div>
          
          {/* Chart legend with toggles */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.keys(metricInfo).map(metric => (
                <div 
                  key={metric} 
                  className={`flex items-center px-3 py-2 rounded-full cursor-pointer ${selectedMetrics[metric] ? 'border-2' : 'opacity-50 border'}`} 
                  style={{ borderColor: colors[metric] }}
                  onClick={() => toggleMetric(metric)}
                >
                  <div className="w-4 h-4 mr-2" style={{ backgroundColor: colors[metric] }}></div>
                  <span>{metricInfo[metric].label} ({metricInfo[metric].unit})</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            {chartType === 'line' && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">Xu hướng Môi trường</h2>
                <div className="h-64 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
                    <span>140</span>
                    <span>120</span>
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute left-10 right-0 top-0 bottom-0">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-200"
                        style={{ top: `${i * 14.28}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <svg className="absolute left-10 right-0 top-0 h-full w-[calc(100%-2.5rem)]" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Draw colored bands for ideal ranges */}
                    {Object.keys(metricInfo).map(metric => {
                      if (!selectedMetrics[metric]) return null;
                      const [min, max] = metricInfo[metric].idealRange;
                      return (
                        <rect
                          key={`range-${metric}`}
                          x="0"
                          y={200 - (max / 140) * 200}
                          width="400"
                          height={(max - min) / 140 * 200}
                          fill={`${colors[metric]}20`}
                          opacity="0.3"
                        />
                      );
                    })}
                    
                    {/* Chart lines */}
                    {Object.keys(metricInfo).map(metric => {
                      if (!selectedMetrics[metric]) return null;
                      const dataKey = metricInfo[metric].key === 'airHumidity' ? 'airHumidity' : metricInfo[metric].key;
                      
                      return (
                        <g key={`line-${metric}`}>
                          <polyline
                            points={filteredData.map((d, i) => `${i * (400 / (filteredData.length - 1 || 1))},${200 - (d[dataKey] / 140) * 200}`).join(' ')}
                            fill="none"
                            stroke={colors[metric]}
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          
                          {/* Data points */}
                          {filteredData.map((d, i) => (
                            <circle
                              key={i}
                              cx={i * (400 / (filteredData.length - 1 || 1))}
                              cy={200 - (d[dataKey] / 140) * 200}
                              r="4"
                              fill={colors[metric]}
                            />
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-gray-500 translate-y-6">
                    {filteredData.map((d, i) => (
                      <span key={i}>{d.date}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Bar Chart */}
            {chartType === 'bar' && (
              <div className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">Đo lường Hàng ngày</h2>
                <div className="h-64 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
                    <span>140</span>
                    <span>120</span>
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute left-10 right-0 top-0 bottom-0">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-200"
                        style={{ top: `${i * 14.28}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <div className="absolute left-10 right-0 top-0 bottom-0 flex justify-around items-end">
                    {filteredData.map((d, i) => (
                      <div key={i} className="flex h-full" style={{ width: `${80 / filteredData.length}%` }}>
                        <div className="flex justify-around items-end h-full w-full">
                          {Object.keys(metricInfo).map(metric => {
                            if (!selectedMetrics[metric]) return null;
                            const dataKey = metricInfo[metric].key === 'airHumidity' ? 'airHumidity' : metricInfo[metric].key;
                            
                            return (
                              <div 
                                key={`bar-${metric}`}
                                className={`mx-px rounded-t-sm transition-all duration-300`}
                                style={{ 
                                  backgroundColor: colors[metric], 
                                  height: `${(d[dataKey] / 140) * 100}%`,
                                  width: `${80 / Object.keys(selectedMetrics).filter(k => selectedMetrics[k]).length}%`
                                }} 
                                title={`${metricInfo[metric].label}: ${d[dataKey]} ${metricInfo[metric].unit}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute left-10 right-0 bottom-0 flex justify-around text-xs text-gray-500 translate-y-6">
                    {filteredData.map((d, i) => (
                      <span key={i}>{d.date}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Current measurements & statistics */}
            <div className="bg-white p-4 rounded-lg shadow border">
              <h2 className="text-lg font-semibold mb-4">Đo lường Chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(metricInfo).map(metric => {
                  const stats = statistics[metric];
                  if (!stats) return null;
                  
                  const status = getStatusIndicator(metric, stats.current);
                  return (
                    <div key={metric} className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: colors[metric] }}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[metric] }}></div>
                          <span className="font-medium">{metricInfo[metric].label}</span>
                        </div>
                        <div 
                          className="px-2 py-1 text-xs rounded-full text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          {status.text}
                        </div>
                      </div>
                      
                      <div className="flex items-baseline mb-3">
                        <span className="text-3xl font-bold">{stats.current}</span>
                        <span className="ml-1 text-gray-500 text-lg">{metricInfo[metric].unit}</span>
                        <span className="ml-2 text-xs px-1 rounded" style={{ 
                          color: stats.trend === 'up' ? '#E53935' : stats.trend === 'down' ? '#2E7D32' : '#757575',
                          backgroundColor: stats.trend === 'up' ? '#FFEBEE' : stats.trend === 'down' ? '#E8F5E9' : '#F5F5F5'
                        }}>
                          {stats.trend === 'up' ? '▲' : stats.trend === 'down' ? '▼' : '•'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 text-center text-xs text-gray-600">
                        <div>
                          <div className="font-medium">TB</div>
                          <div>{stats.avg} {metricInfo[metric].unit}</div>
                        </div>
                        <div>
                          <div className="font-medium">Min</div>
                          <div>{stats.min} {metricInfo[metric].unit}</div>
                        </div>
                        <div>
                          <div className="font-medium">Max</div>
                          <div>{stats.max} {metricInfo[metric].unit}</div>
                        </div>
                      </div>
                      
                      {/* Mini progress bar showing range */}
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2 relative">
                        {/* Ideal range indicator */}
                        <div 
                          className="absolute h-1 bg-green-200 rounded-full" 
                          style={{ 
                            left: `${(metricInfo[metric].idealRange[0] / 140) * 100}%`,
                            width: `${((metricInfo[metric].idealRange[1] - metricInfo[metric].idealRange[0]) / 140) * 100}%`
                          }}
                        ></div>
                        {/* Current value indicator */}
                        <div 
                          className="absolute h-3 w-2 bg-gray-800 rounded-full -top-1" 
                          style={{ left: `calc(${(stats.current / 140) * 100}% - 1px)` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Plant health status */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-2">Trạng thái Cây trồng</h2>
            
            {/* Check if all values are within ideal range */}
            {Object.keys(metricInfo).every(metric => {
              const [min, max] = metricInfo[metric].idealRange;
              const current = statistics[metric]?.current || 0;
              return current >= min && current <= max;
            }) ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Điều kiện Lý tưởng</h3>
                  <p className="text-sm text-green-700">Tất cả thông số đang ở trong phạm vi lý tưởng cho sự phát triển của cây trồng.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-yellow-800">Cần Chú ý</h3>
                    <p className="text-sm text-yellow-700">Một số thông số nằm ngoài phạm vi lý tưởng.</p>
                  </div>
                </div>
                
                <div className="mt-2 pl-14">
                  <ul className="text-sm space-y-1">
                    {Object.keys(metricInfo).map(metric => {
                      const [min, max] = metricInfo[metric].idealRange;
                      const current = statistics[metric]?.current || 0;
                      if (current < min || current > max) {
                        return (
                          <li key={`warning-${metric}`} className="text-gray-700">
                            <span className="font-medium">{metricInfo[metric].label}</span>: {current} {metricInfo[metric].unit} 
                            {current < min ? 
                              ` (thấp hơn mức đề nghị ${min} ${metricInfo[metric].unit})` : 
                              ` (cao hơn mức đề nghị ${max} ${metricInfo[metric].unit})`
                            }
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations based on data */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Khuyến nghị Chăm sóc</h2>
          
          <div className="space-y-4">
            {Object.keys(metricInfo).map(metric => {
              const [min, max] = metricInfo[metric].idealRange;
              const current = statistics[metric]?.current || 0;
              
              if (current < min) {
                return (
                  <div key={`rec-${metric}`} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-medium text-blue-800">Tăng {metricInfo[metric].label.toLowerCase()}</h3>
                    {metric === 'temperature' && (
                      <p className="text-blue-700">Nhiệt độ hiện tại thấp hơn mức tối ưu. Hãy di chuyển cây đến khu vực ấm hơn hoặc xa khỏi cửa sổ lạnh.</p>
                    )}
                    {metric === 'airHumidity' && (
                      <p className="text-blue-700">Độ ẩm không khí thấp. Hãy xem xét sử dụng máy tạo độ ẩm hoặc phun sương cho cây.</p>
                    )}
                    {metric === 'soilMoisture' && (
                      <p className="text-blue-700">Đất quá khô. Hãy tưới nước cho cây và đảm bảo nước ngấm sâu vào đất.</p>
                    )}
                    {metric === 'light' && (
                      <p className="text-blue-700">Cây cần nhiều ánh sáng hơn. Di chuyển cây đến vị trí có nhiều ánh sáng tự nhiên hơn.</p>
                    )}
                  </div>
                );
              }
              
              if (current > max) {
                return (
                  <div key={`rec-${metric}`} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                    <h3 className="font-medium text-orange-800">Giảm {metricInfo[metric].label.toLowerCase()}</h3>
                    {metric === 'temperature' && (
                      <p className="text-orange-700">Nhiệt độ cao hơn mức tối ưu. Hãy di chuyển cây đến nơi mát mẻ hơn và tránh ánh nắng trực tiếp.</p>
                    )}
                    {metric === 'airHumidity' && (
                      <p className="text-orange-700">Độ ẩm không khí cao. Cải thiện lưu thông không khí hoặc sử dụng máy hút ẩm.</p>
                    )}
                    {metric === 'soilMoisture' && (
                      <p className="text-orange-700">Đất quá ẩm. Giảm tần suất tưới nước và đảm bảo thoát nước tốt.</p>
                    )}
                    {metric === 'light' && (
                      <p className="text-orange-700">Cây đang nhận quá nhiều ánh sáng. Di chuyển đến vị trí có ánh sáng gián tiếp hoặc bổ sung rèm cửa.</p>
                    )}
                  </div>
                );
              }
              
              return null;
            })}
            
            {Object.keys(metricInfo).every(metric => {
              const [min, max] = metricInfo[metric].idealRange;
              const current = statistics[metric]?.current || 0;
              return current >= min && current <= max;
            }) && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <h3 className="font-medium text-green-800">Duy trì Điều kiện Hiện tại</h3>
                <p className="text-green-700">Tất cả các thông số đều trong phạm vi lý tưởng. Tiếp tục chế độ chăm sóc hiện tại.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantMonitoringDashboard;
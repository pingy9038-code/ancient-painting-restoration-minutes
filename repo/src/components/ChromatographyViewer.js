import React, { useState } from 'react';
import { 
  Microscope, Ruler, Upload, Plus, Trash2, Eye, 
  BarChart3, Activity, Layers, Info
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const mockColorimeterData = [
  { point: 'A1-斗拱', L: 45.2, a: 12.8, b: -32.5, delta_E: 2.3 },
  { point: 'A2-额枋', L: 48.6, a: 15.2, b: -28.7, delta_E: 3.1 },
  { point: 'A3-柱头', L: 42.1, a: 10.5, b: -35.8, delta_E: 1.8 },
  { point: 'B1-梁架', L: 52.3, a: 8.9, b: -22.4, delta_E: 4.5 },
  { point: 'B2-檩条', L: 47.8, a: 14.1, b: -30.2, delta_E: 2.7 },
  { point: 'C1-垫板', L: 50.5, a: 11.3, b: -26.9, delta_E: 3.6 },
];

const mockSpectrumData = [
  { wavelength: 400, reflectance: 12.5, sample: '样品1' },
  { wavelength: 450, reflectance: 18.2, sample: '样品1' },
  { wavelength: 500, reflectance: 25.6, sample: '样品1' },
  { wavelength: 550, reflectance: 32.1, sample: '样品1' },
  { wavelength: 600, reflectance: 28.9, sample: '样品1' },
  { wavelength: 650, reflectance: 22.4, sample: '样品1' },
  { wavelength: 700, reflectance: 18.7, sample: '样品1' },
  { wavelength: 400, reflectance: 15.3, sample: '样品2' },
  { wavelength: 450, reflectance: 22.1, sample: '样品2' },
  { wavelength: 500, reflectance: 28.9, sample: '样品2' },
  { wavelength: 550, reflectance: 35.2, sample: '样品2' },
  { wavelength: 600, reflectance: 31.8, sample: '样品2' },
  { wavelength: 650, reflectance: 25.6, sample: '样品2' },
  { wavelength: 700, reflectance: 21.3, sample: '样品2' },
];

const mockRadarData = [
  { subject: '耐光性', A: 85, B: 78, fullMark: 100 },
  { subject: '耐酸性', A: 72, B: 88, fullMark: 100 },
  { subject: '耐碱性', A: 90, B: 75, fullMark: 100 },
  { subject: '耐磨性', A: 68, B: 82, fullMark: 100 },
  { subject: '色彩稳定性', A: 75, B: 70, fullMark: 100 },
  { subject: '附着力', A: 82, B: 65, fullMark: 100 },
];

const mockMicroscopeImages = [
  { id: 1, name: '样品1-显微照片1', magnification: '200x', scale: '50μm', date: '2024-01-15' },
  { id: 2, name: '样品1-显微照片2', magnification: '500x', scale: '20μm', date: '2024-01-15' },
  { id: 3, name: '样品2-显微照片1', magnification: '200x', scale: '50μm', date: '2024-01-15' },
  { id: 4, name: '样品2-显微照片2', magnification: '1000x', scale: '10μm', date: '2024-01-15' },
];

function ChromatographyViewer() {
  const [activeTab, setActiveTab] = useState('colorimeter');
  const [selectedImage, setSelectedImage] = useState(null);
  const [samples, setSamples] = useState([
    {
      id: 1,
      sampleId: 'SPL_20240115_001',
      location: '太和殿-明间-斗拱',
      type: '石青颜料层',
      thickness: '0.08mm',
      layers: 3,
      date: '2024-01-15'
    },
    {
      id: 2,
      sampleId: 'SPL_20240115_002',
      location: '太和殿-东次间-额枋',
      type: '石绿颜料层',
      thickness: '0.12mm',
      layers: 4,
      date: '2024-01-15'
    }
  ]);

  const tabs = [
    { id: 'samples', label: '样品管理', icon: Layers },
    { id: 'colorimeter', label: '色度计数据', icon: BarChart3 },
    { id: 'spectrum', label: '光谱分析', icon: Activity },
    { id: 'microscope', label: '显微图像', icon: Microscope },
  ];

  const handleAddSample = () => {
    const newSample = {
      id: samples.length + 1,
      sampleId: `SPL_${Date.now().toString().slice(-8)}_${String(samples.length + 1).padStart(3, '0')}`,
      location: '',
      type: '',
      thickness: '',
      layers: 1,
      date: new Date().toISOString().split('T')[0]
    };
    setSamples([...samples, newSample]);
  };

  const handleDeleteSample = (id) => {
    setSamples(samples.filter(s => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">色谱检测数据</h2>
        <p className="text-gray-600">查看和管理显微取样与色度计分析数据</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">样品列表</h3>
            <button
              onClick={handleAddSample}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus size={18} />
              添加样品
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">样品编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">取样位置</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">样品类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">厚度</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">层数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {samples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-amber-600">{sample.sampleId}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sample.location || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sample.type || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sample.thickness || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sample.layers}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{sample.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSample(sample.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">取样规范提示</p>
                <p className="text-sm text-blue-600 mt-1">
                  1. 显微取样应在不破坏文物整体的前提下进行,取样面积不超过0.5cm²<br/>
                  2. 每个取样点应记录精确位置、层数、厚度等信息<br/>
                  3. 样品应密封保存,避免污染和光照
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'colorimeter' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lab色彩空间测量数据</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="a" 
                    name="a* (红-绿)" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'a* (红-绿)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="b" 
                    name="b* (黄-蓝)" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'b* (黄-蓝)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="测量点" data={mockColorimeterData} fill="#D97706" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">亮度(L*)对比</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockColorimeterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="point" tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: 'L* (亮度)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="L" name="亮度 L*" fill="#1E88E5" />
                  <Bar dataKey="delta_E" name="色差 ΔE" fill="#E53935" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">测量点</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">L* (亮度)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">a* (红-绿)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">b* (黄-蓝)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ΔE (色差)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockColorimeterData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.point}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.L}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.a}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.b}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.delta_E < 2 ? 'bg-green-100 text-green-700' :
                        row.delta_E < 4 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.delta_E}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'spectrum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">反射光谱曲线</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="wavelength" 
                      name="波长" 
                      unit="nm"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="reflectance" 
                      name="反射率" 
                      unit="%"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="样品1" data={mockSpectrumData.filter(d => d.sample === '样品1')} fill="#1E88E5" />
                    <Scatter name="样品2" data={mockSpectrumData.filter(d => d.sample === '样品2')} fill="#E53935" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">材料性能雷达图</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="传统材料" dataKey="A" stroke="#1E88E5" fill="#1E88E5" fillOpacity={0.5} />
                    <Radar name="现代材料" dataKey="B" stroke="#E53935" fill="#E53935" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">光谱分析说明</p>
                <p className="text-sm text-amber-700 mt-1">
                  反射光谱曲线反映了颜料在不同波长下的反射特性,可用于识别矿物颜料种类。
                  特征吸收峰的位置和形状是鉴定颜料的重要依据。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'microscope' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">显微图像库</h3>
            <label className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer">
              <Upload size={18} />
              上传图像
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockMicroscopeImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                  <Microscope size={48} className="text-gray-400" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{image.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {image.magnification} · {image.scale}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedImage && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-8">
              <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  <Microscope size={96} className="text-gray-300" />
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                    {selectedImage.magnification} · 标尺: {selectedImage.scale}
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedImage.name}</h4>
                    <p className="text-sm text-gray-500">{selectedImage.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">显微分析要点</p>
                <p className="text-sm text-green-700 mt-1">
                  1. 观察颜料颗粒的形态、大小和分布特征<br/>
                  2. 分析颜料层的叠压关系,了解修复历史<br/>
                  3. 结合能谱分析(EDS)确定元素组成<br/>
                  4. 注意保存原始图像和比例尺信息
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChromatographyViewer;

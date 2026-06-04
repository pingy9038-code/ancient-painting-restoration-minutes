import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Palette, Users, Shield, 
  Download, BookOpen, Beaker, Droplets
} from 'lucide-react';

function AnalysisResult({ data, onBack }) {
  const [activeSection, setActiveSection] = useState('summary');

  const sections = [
    { id: 'summary', label: '会议摘要', icon: FileText },
    { id: 'pigments', label: '颜料分析', icon: Beaker },
    { id: 'techniques', label: '传统技法', icon: Palette },
    { id: 'colors', label: '配色方案', icon: Droplets },
    { id: 'maintenance', label: '保养建议', icon: Shield },
    { id: 'transcript', label: '对话记录', icon: Users },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-serif">分析结果</h2>
            <p className="text-gray-500 text-sm">项目编号: {data.project_id}</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = `/static/${data.archive_path?.split('/').pop()}`;
            link.download = true;
            link.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Download size={18} />
          下载 Markdown 报告
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1 sticky top-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-amber-100 text-amber-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {activeSection === 'summary' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-amber-600" />
                  会议摘要
                </h3>
                <p className="text-gray-700 leading-relaxed">{data.summary}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">识别颜料</p>
                  <p className="text-3xl font-bold text-amber-600">{data.pigments?.length || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">传统技法</p>
                  <p className="text-3xl font-bold text-green-600">{data.techniques?.length || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">对话片段</p>
                  <p className="text-3xl font-bold text-blue-600">{data.transcript?.length || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pigments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">矿物颜料成分分析</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.pigments?.map((pigment, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0"
                        style={{ backgroundColor: pigment.color || '#ccc' }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{pigment.chinese_name || pigment.name}</h4>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            {pigment.confidence ? `${(pigment.confidence * 100).toFixed(0)}%` : '高'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {pigment.english_name} · {pigment.chemical_formula}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">来源:</span> {pigment.origin || pigment.source}
                        </p>
                        {pigment.properties && (
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-medium">特性:</span> {pigment.properties}
                          </p>
                        )}
                        {pigment.historical_usage && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">用途:</span> {pigment.historical_usage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'techniques' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">传统技法识别</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.techniques?.map((technique, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200"
                  >
                    <h4 className="font-semibold text-green-800 mb-2">{technique}</h4>
                    <p className="text-sm text-green-700">
                      {technique === '和玺彩画' && '清代最高等级的彩画,用于宫殿、坛庙等重要建筑'}
                      {technique === '旋子彩画' && '清代第二等级彩画,多用于官衙、庙宇的主殿'}
                      {technique === '苏式彩画' && '源于苏州的彩画风格,多用于园林、住宅'}
                      {technique === '沥粉贴金' && '用胶粉混成膏沥出线条,再贴金箔的工艺'}
                      {technique === '叠晕' && '同一颜色由浅到深逐层晕染的技法'}
                      {technique === '退晕' && '颜色由深到浅逐渐过渡的技法'}
                      {!['和玺彩画', '旋子彩画', '苏式彩画', '沥粉贴金', '叠晕', '退晕'].includes(technique) && '传统建筑彩画技法'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'colors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">推荐配色方案</h3>
              {data.color_scheme?.map((group, groupIndex) => (
                <div key={groupIndex} className="bg-white p-5 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-4">{group.name}</h4>
                  <div className="flex gap-4">
                    {group.colors?.map((color, colorIndex) => (
                      <div key={colorIndex} className="flex-1 text-center">
                        <div
                          className="w-full h-20 rounded-lg mb-2 shadow-inner"
                          style={{ backgroundColor: color.hex || '#ccc' }}
                        />
                        <p className="text-sm font-medium text-gray-800">{color.name}</p>
                        <p className="text-xs text-gray-500">{color.hex}</p>
                        <p className="text-xs text-amber-600 font-medium">{color.ratio}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'maintenance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">保养建议</h3>
              <div className="space-y-3">
                {data.maintenance_advice?.map((advice, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-blue-800">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'transcript' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">对话记录</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-2">
                {data.transcript?.map((segment, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      segment.role === '分析检测方'
                        ? 'bg-blue-50 border-blue-200'
                        : segment.role === '修复方'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          segment.role === '分析检测方'
                            ? 'bg-blue-200 text-blue-800'
                            : segment.role === '修复方'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {segment.role || segment.speaker}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
                      </span>
                    </div>
                    <p className="text-gray-700">{segment.text}</p>
                    {segment.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {segment.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;

import React, { useState } from 'react';
import { FileText, Upload, Mic, Palette, BookOpen, Archive, Settings, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import UploadPanel from './components/UploadPanel';
import AnalysisResult from './components/AnalysisResult';
import ArchiveList from './components/ArchiveList';
import ChromatographyViewer from './components/ChromatographyViewer';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);

  const tabs = [
    { id: 'upload', label: '音频分析', icon: Upload },
    { id: 'chromatography', label: '色谱数据', icon: Palette },
    { id: 'archives', label: '档案管理', icon: Archive },
  ];

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
  };

  const handleViewArchive = (archive) => {
    setSelectedArchive(archive);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 heritage-pattern">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-amber-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          {(analysisResult || selectedArchive) && (
            <>
              <ChevronRight size={16} className="text-gray-400" />
              <button
                onClick={() => setActiveTab('result')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'result'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-green-100'
                }`}
              >
                <FileText size={18} />
                分析结果
              </button>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
          {activeTab === 'upload' && (
            <UploadPanel onAnalysisComplete={handleAnalysisComplete} />
          )}
          
          {activeTab === 'chromatography' && (
            <ChromatographyViewer />
          )}
          
          {activeTab === 'archives' && (
            <ArchiveList onViewArchive={handleViewArchive} />
          )}
          
          {activeTab === 'result' && (analysisResult || selectedArchive) && (
            <AnalysisResult 
              data={analysisResult || selectedArchive} 
              onBack={() => setActiveTab('archives')}
            />
          )}
        </div>
      </div>

      <footer className="mt-8 py-6 text-center text-gray-500 text-sm">
        <p>© 2024 古建彩画修复色谱纪要系统 | 建筑遗产保护数字化平台</p>
      </footer>
    </div>
  );
}

export default App;

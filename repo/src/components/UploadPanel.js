import React, { useState } from 'react';
import { Upload, Mic, FileAudio, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

function UploadPanel({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('请上传音频文件');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('请选择音频文件');
      return;
    }
    if (!projectName) {
      setError('请填写项目名称');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('audio_file', file);
    formData.append('project_name', projectName);
    formData.append('building_name', buildingName);
    formData.append('location', location);
    formData.append('notes', notes);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setProgress(100);
      setTimeout(() => {
        onAnalysisComplete(response.data);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.detail || '分析失败，请重试');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-2">音频分析上传</h2>
        <p className="text-gray-600">上传专家论证会录音，系统将自动识别对话、提取颜料成分和传统技法</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="如：故宫太和殿彩画修复工程"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              建筑名称
            </label>
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="如：太和殿"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              地理位置
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="如：北京市东城区景山前街4号"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注信息
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="输入其他需要说明的信息..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            音频文件 <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-amber-500 bg-amber-50'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <CheckCircle size={48} className="text-green-500 mb-3" />
                <p className="text-lg font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-green-600 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <FileAudio size={32} className="text-amber-600" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  拖拽音频文件到此处
                </p>
                <p className="text-sm text-gray-500">
                  或点击选择文件 · 支持 MP3、WAV、M4A 等格式
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-amber-600" />
                <span>正在分析音频...</span>
              </div>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              音频去噪 → 语音识别 → 说话人分离 → 内容分析 → 生成报告
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Mic size={20} />
          {isAnalyzing ? '分析中...' : '开始分析'}
        </button>
      </form>
    </div>
  );
}

export default UploadPanel;

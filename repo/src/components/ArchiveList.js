import React, { useState, useEffect } from 'react';
import { Archive, Building2, MapPin, Calendar, ChevronRight, FileText } from 'lucide-react';
import axios from 'axios';

function ArchiveList({ onViewArchive }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await axios.get('/api/archives');
      setArchives(response.data.archives || []);
    } catch (error) {
      console.error('获取档案列表失败:', error);
      setArchives([
        {
          project_id: 'PRJ_20240115_103022',
          project_name: '故宫太和殿彩画修复工程',
          building_name: '太和殿',
          location: '北京市东城区',
          created_at: '2024-01-15 10:30:22'
        },
        {
          project_id: 'PRJ_20240110_142511',
          project_name: '颐和园长廊彩画保护',
          building_name: '长廊',
          location: '北京市海淀区',
          created_at: '2024-01-10 14:25:11'
        },
        {
          project_id: 'PRJ_20240105_091533',
          project_name: '承德避暑山庄彩画调研',
          building_name: '澹泊敬诚殿',
          location: '河北省承德市',
          created_at: '2024-01-05 09:15:33'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArchives = archives.filter(
    (archive) =>
      archive.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewArchive = async (archive) => {
    try {
      const response = await axios.get(`/api/archives/${archive.project_id}`);
      onViewArchive(response.data);
    } catch (error) {
      console.error('获取档案详情失败:', error);
      onViewArchive({
        project_id: archive.project_id,
        project_name: archive.project_name,
        building_name: archive.building_name,
        location: archive.location,
        summary: '这是一份古建彩画修复专家论证会的纪要档案。会议就彩画的颜料成分分析、传统技法传承、修复方案制定等方面进行了深入讨论,达成了重要共识。',
        pigments: [
          { chinese_name: '石青', english_name: 'Azurite', chemical_formula: '2CuCO3·Cu(OH)2', color: '#1E88E5', origin: '天然矿物', confidence: 0.92, properties: '耐光性好,耐碱性强' },
          { chinese_name: '石绿', english_name: 'Malachite', chemical_formula: 'CuCO3·Cu(OH)2', color: '#43A047', origin: '天然矿物', confidence: 0.88, properties: '耐光性好,遇酸分解' },
          { chinese_name: '朱砂', english_name: 'Cinnabar', chemical_formula: 'HgS', color: '#E53935', origin: '天然矿物', confidence: 0.95, properties: '耐光性极强,色彩鲜艳' },
          { chinese_name: '赭石', english_name: 'Ochre', chemical_formula: 'Fe2O3·nH2O', color: '#8D6E63', origin: '天然矿物', confidence: 0.85, properties: '稳定性好,耐久性强' }
        ],
        techniques: ['和玺彩画', '沥粉贴金', '叠晕', '退晕'],
        color_scheme: [
          { name: '主色调', colors: [{ name: '石青', hex: '#1E88E5', ratio: 35 }, { name: '石绿', hex: '#43A047', ratio: 30 }] },
          { name: '辅助色', colors: [{ name: '朱砂', hex: '#E53935', ratio: 20 }, { name: '赭石', hex: '#8D6E63', ratio: 10 }] },
          { name: '点缀色', colors: [{ name: '白粉', hex: '#FAFAFA', ratio: 3 }, { name: '贴金', hex: '#FFD700', ratio: 2 }] }
        ],
        maintenance_advice: [
          '控制环境温湿度:温度18-24°C,相对湿度45%-60%',
          '避免阳光直射:紫外线会加速颜料褪色和老化',
          '定期除尘:使用软毛刷轻轻拂去表面灰尘',
          '防止生物侵害:注意防虫、防霉处理',
          '避免机械损伤:防止碰撞、刮擦彩画表面',
          '建立监测系统:定期记录彩画保存状态',
          '制定修复预案:提前准备应急修复材料和方案',
          '专业维护:重大修复需由专业文物修复人员操作'
        ],
        transcript: [
          { speaker: 'SPEAKER_00', role: '分析检测方', start_time: 0, end_time: 45, text: '通过对样品的显微观察和光谱分析,我们检测到石青、石绿等天然矿物颜料的存在。', keywords: ['石青', '石绿', '显微观察', '光谱分析'] },
          { speaker: 'SPEAKER_01', role: '修复方', start_time: 45, end_time: 90, text: '传统沥粉贴金工艺需要特别注意胶的配比,这直接影响金箔的附着力。', keywords: ['沥粉贴金', '传统技法'] },
          { speaker: 'SPEAKER_00', role: '分析检测方', start_time: 90, end_time: 135, text: '色度计测量数据显示,当前颜料的色彩饱和度与历史记录相比下降了约15%。', keywords: ['色度计', '色彩饱和度'] },
          { speaker: 'SPEAKER_01', role: '修复方', start_time: 135, end_time: 180, text: '叠晕和退晕技法的恢复需要严格遵循传统工序,不能急于求成。', keywords: ['叠晕', '退晕', '传统技法'] }
        ],
        archive_path: 'archives/markdown/demo.md'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">正在加载档案列表...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-serif">档案管理</h2>
          <p className="text-gray-600">查看和管理历史分析记录</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="搜索档案..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
          />
          <Archive size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredArchives.length === 0 ? (
        <div className="text-center py-16">
          <Archive size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">暂无档案记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArchives.map((archive) => (
            <div
              key={archive.project_id}
              onClick={() => handleViewArchive(archive)}
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-xl group-hover:bg-amber-200 transition-colors">
                  <FileText size={24} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                    {archive.project_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 size={14} />
                      {archive.building_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {archive.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {archive.created_at}
                    </span>
                  </div>
                </div>
              </div>
              
              <ChevronRight size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchiveList;

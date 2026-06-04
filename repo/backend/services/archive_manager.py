import os
import json
import re
from datetime import datetime
from typing import List, Dict, Any, Optional


class ArchiveManager:
    def __init__(self, archive_dir: str = "archives"):
        self.archive_dir = archive_dir
        os.makedirs(self.archive_dir, exist_ok=True)
        os.makedirs(f"{self.archive_dir}/markdown", exist_ok=True)
        os.makedirs(f"{self.archive_dir}/json", exist_ok=True)
    
    def _sanitize_filename(self, filename: str) -> str:
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        filename = filename.strip()
        return filename[:100] if len(filename) > 100 else filename
    
    def create_archive(
        self,
        project_id: str,
        project_name: str,
        building_name: str,
        location: str,
        transcript: List[Dict[str, Any]],
        analysis: Dict[str, Any],
        chromatography_data: Optional[Dict[str, Any]] = None,
        notes: str = ""
    ) -> str:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        markdown_content = self._generate_markdown(
            project_id=project_id,
            project_name=project_name,
            building_name=building_name,
            location=location,
            timestamp=timestamp,
            transcript=transcript,
            analysis=analysis,
            chromatography_data=chromatography_data,
            notes=notes
        )
        
        safe_project_name = self._sanitize_filename(project_name or "未命名项目")
        md_filename = f"{self.archive_dir}/markdown/{project_id}_{safe_project_name}.md"
        with open(md_filename, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        json_data = {
            "project_id": project_id,
            "project_name": project_name,
            "building_name": building_name,
            "location": location,
            "created_at": timestamp,
            "transcript": transcript,
            "analysis": analysis,
            "chromatography_data": chromatography_data,
            "notes": notes
        }
        json_filename = f"{self.archive_dir}/json/{project_id}.json"
        with open(json_filename, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        return md_filename
    
    def _generate_markdown(
        self,
        project_id: str,
        project_name: str,
        building_name: str,
        location: str,
        timestamp: str,
        transcript: List[Dict[str, Any]],
        analysis: Dict[str, Any],
        chromatography_data: Optional[Dict[str, Any]],
        notes: str
    ) -> str:
        lines = []
        
        lines.append("# 古建彩画修复专家论证会色谱纪要")
        lines.append("")
        lines.append(f"**项目编号**: {project_id}")
        lines.append(f"**项目名称**: {project_name or '未命名'}")
        lines.append(f"**建筑名称**: {building_name or '未填写'}")
        lines.append(f"**地理位置**: {location or '未填写'}")
        lines.append(f"**生成时间**: {timestamp}")
        lines.append("")
        lines.append("---")
        lines.append("")
        
        lines.append("## 一、会议摘要")
        lines.append("")
        lines.append(analysis.get("summary", "暂无摘要"))
        lines.append("")
        
        lines.append("## 二、矿物颜料成分分析")
        lines.append("")
        pigments = analysis.get("pigments", [])
        if pigments:
            lines.append("| 颜料名称 | 英文名称 | 化学式 | 颜色 | 来源 | 可信度 |")
            lines.append("|---------|---------|--------|------|------|--------|")
            for p in pigments:
                color_hex = p.get("color", "")
                color_display = f"![{color_hex}](https://via.placeholder.com/20/{color_hex.lstrip('#')}/ffffff?text=+) {color_hex}"
                lines.append(f"| {p.get('chinese_name', p.get('name', ''))} | {p.get('english_name', '')} | {p.get('chemical_formula', '')} | {color_display} | {p.get('origin', '')} | {p.get('confidence', 0):.0%} |")
            lines.append("")
            
            lines.append("### 颜料特性说明")
            lines.append("")
            for p in pigments:
                name = p.get('chinese_name', p.get('name', ''))
                lines.append(f"#### {name}")
                lines.append(f"- **特性**: {p.get('properties', '暂无')}")
                lines.append(f"- **历史用途**: {p.get('historical_usage', '暂无')}")
                lines.append("")
        else:
            lines.append("暂未识别到矿物颜料成分。")
            lines.append("")
        
        lines.append("## 三、传统技法识别")
        lines.append("")
        techniques = analysis.get("techniques", [])
        if techniques:
            for tech in techniques:
                lines.append(f"- **{tech}**")
                tech_desc = self._get_technique_description(tech)
                if tech_desc:
                    lines.append(f"  - {tech_desc}")
            lines.append("")
        else:
            lines.append("暂未识别到传统技法。")
            lines.append("")
        
        lines.append("## 四、推荐配色方案")
        lines.append("")
        color_scheme = analysis.get("color_scheme", [])
        if color_scheme:
            for group in color_scheme:
                group_name = group.get("name", "")
                colors = group.get("colors", [])
                lines.append(f"### {group_name}")
                lines.append("")
                lines.append("| 颜色名称 | 色值 | 比例 |")
                lines.append("|---------|------|------|")
                for c in colors:
                    color_hex = c.get("hex", "")
                    color_display = f"![{color_hex}](https://via.placeholder.com/20/{color_hex.lstrip('#')}/ffffff?text=+) {color_hex}"
                    lines.append(f"| {c.get('name', '')} | {color_display} | {c.get('ratio', 0)}% |")
                lines.append("")
        else:
            lines.append("暂无配色方案。")
            lines.append("")
        
        lines.append("## 五、保养建议")
        lines.append("")
        maintenance = analysis.get("maintenance_advice", [])
        if maintenance:
            for i, advice in enumerate(maintenance, 1):
                lines.append(f"{i}. {advice}")
            lines.append("")
        else:
            lines.append("暂无保养建议。")
            lines.append("")
        
        if chromatography_data:
            lines.append("## 六、色谱检测数据")
            lines.append("")
            lines.append(f"**样品编号**: {chromatography_data.get('sample_id', '')}")
            lines.append(f"**取样位置**: {chromatography_data.get('location', '')}")
            lines.append(f"**检测日期**: {chromatography_data.get('sample_date', '')}")
            lines.append("")
            
            microscope_data = chromatography_data.get("microscope_data", {})
            if microscope_data:
                lines.append("### 6.1 显微分析数据")
                lines.append("")
                for key, value in microscope_data.items():
                    lines.append(f"- **{key}**: {value}")
                lines.append("")
            
            colorimeter_data = chromatography_data.get("colorimeter_data", [])
            if colorimeter_data:
                lines.append("### 6.2 色度计测量数据")
                lines.append("")
                lines.append("| 测量点 | L* | a* | b* | ΔE |")
                lines.append("|-------|----|----|----|----|")
                for point in colorimeter_data:
                    lines.append(f"| {point.get('point', '')} | {point.get('L', '')} | {point.get('a', '')} | {point.get('b', '')} | {point.get('delta_E', '')} |")
                lines.append("")
        
        lines.append("## 七、对话记录")
        lines.append("")
        
        chemist_lines = [seg for seg in transcript if seg.get("role") == "分析检测方"]
        restorer_lines = [seg for seg in transcript if seg.get("role") == "修复方"]
        other_lines = [seg for seg in transcript if seg.get("role") not in ["分析检测方", "修复方"]]
        
        if chemist_lines:
            lines.append("### 7.1 分析检测方发言")
            lines.append("")
            for seg in chemist_lines:
                time_str = self._format_time(seg.get("start_time", 0))
                keywords = seg.get("keywords", [])
                kw_str = f" `[{', '.join(keywords)}]`" if keywords else ""
                lines.append(f"> [{time_str}] {seg.get('text', '')}{kw_str}")
                lines.append("")
        
        if restorer_lines:
            lines.append("### 7.2 修复方发言")
            lines.append("")
            for seg in restorer_lines:
                time_str = self._format_time(seg.get("start_time", 0))
                keywords = seg.get("keywords", [])
                kw_str = f" `[{', '.join(keywords)}]`" if keywords else ""
                lines.append(f"> [{time_str}] {seg.get('text', '')}{kw_str}")
                lines.append("")
        
        if other_lines:
            lines.append("### 7.3 其他发言")
            lines.append("")
            for seg in other_lines:
                time_str = self._format_time(seg.get("start_time", 0))
                role = seg.get("role", seg.get("speaker", "未知"))
                keywords = seg.get("keywords", [])
                kw_str = f" `[{', '.join(keywords)}]`" if keywords else ""
                lines.append(f"> [{time_str}] [{role}] {seg.get('text', '')}{kw_str}")
                lines.append("")
        
        if notes:
            lines.append("## 八、备注")
            lines.append("")
            lines.append(notes)
            lines.append("")
        
        lines.append("---")
        lines.append("")
        lines.append("*本文档由古建彩画修复色谱纪要系统自动生成*")
        
        return "\n".join(lines)
    
    def _format_time(self, seconds: float) -> str:
        mins = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{mins:02d}:{secs:02d}"
    
    def _get_technique_description(self, technique: str) -> str:
        descriptions = {
            "和玺彩画": "清代最高等级的彩画,用于宫殿、坛庙等重要建筑",
            "旋子彩画": "清代第二等级彩画,多用于官衙、庙宇的主殿",
            "苏式彩画": "源于苏州的彩画风格,多用于园林、住宅",
            "沥粉贴金": "用胶粉混成膏沥出线条,再贴金箔的工艺",
            "叠晕": "同一颜色由浅到深逐层晕染的技法",
            "退晕": "颜色由深到浅逐渐过渡的技法",
            "包袱彩画": "苏式彩画的一种,中心为半圆形包袱图案"
        }
        return descriptions.get(technique, "")
    
    def list_archives(self) -> List[Dict[str, Any]]:
        archives = []
        json_dir = f"{self.archive_dir}/json"
        
        if not os.path.exists(json_dir):
            return archives
        
        for filename in os.listdir(json_dir):
            if filename.endswith(".json"):
                filepath = os.path.join(json_dir, filename)
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    archives.append({
                        "project_id": data.get("project_id", filename.replace(".json", "")),
                        "project_name": data.get("project_name", "未命名"),
                        "building_name": data.get("building_name", ""),
                        "location": data.get("location", ""),
                        "created_at": data.get("created_at", "")
                    })
                except Exception as e:
                    print(f"读取档案失败: {e}")
        
        archives.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return archives
    
    def get_archive(self, project_id: str) -> Dict[str, Any]:
        json_path = f"{self.archive_dir}/json/{project_id}.json"
        
        if not os.path.exists(json_path):
            raise FileNotFoundError(f"档案 {project_id} 不存在")
        
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        md_path = f"{self.archive_dir}/markdown/{project_id}_"
        md_files = [f for f in os.listdir(f"{self.archive_dir}/markdown") if f.startswith(project_id)]
        if md_files:
            with open(f"{self.archive_dir}/markdown/{md_files[0]}", "r", encoding="utf-8") as f:
                data["markdown_content"] = f.read()
        
        return data

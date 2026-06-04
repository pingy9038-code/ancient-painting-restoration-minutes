import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

PIGMENT_DATABASE = {
    "石青": {
        "chinese_name": "石青",
        "english_name": "Azurite",
        "chemical_formula": "2CuCO3·Cu(OH)2",
        "color": "#1E88E5",
        "origin": "天然矿物",
        "properties": "耐光性好,耐碱性强",
        "historical_usage": "常用于建筑彩画、壁画的蓝色部位"
    },
    "石绿": {
        "chinese_name": "石绿",
        "english_name": "Malachite",
        "chemical_formula": "CuCO3·Cu(OH)2",
        "color": "#43A047",
        "origin": "天然矿物",
        "properties": "耐光性好,遇酸分解",
        "historical_usage": "常用于建筑彩画、壁画的绿色部位"
    },
    "朱砂": {
        "chinese_name": "朱砂",
        "english_name": "Cinnabar",
        "chemical_formula": "HgS",
        "color": "#E53935",
        "origin": "天然矿物",
        "properties": "耐光性极强,色彩鲜艳",
        "historical_usage": "古代重要的红色颜料,象征尊贵"
    },
    "赭石": {
        "chinese_name": "赭石",
        "english_name": "Ochre",
        "chemical_formula": "Fe2O3·nH2O",
        "color": "#8D6E63",
        "origin": "天然矿物",
        "properties": "稳定性好,耐久性强",
        "historical_usage": "最古老的颜料之一,应用广泛"
    },
    "藤黄": {
        "chinese_name": "藤黄",
        "english_name": "Gamboge",
        "chemical_formula": "C23H28O6",
        "color": "#FFD54F",
        "origin": "植物树脂",
        "properties": "透明性好,耐光性一般",
        "historical_usage": "传统黄色颜料,常用于绘画"
    },
    "花青": {
        "chinese_name": "花青",
        "english_name": "Indigo",
        "chemical_formula": "C16H10N2O2",
        "color": "#3949AB",
        "origin": "植物染料",
        "properties": "耐光性一般,遇碱变色",
        "historical_usage": "传统蓝色颜料,由蓝草提取"
    },
    "胭脂": {
        "chinese_name": "胭脂",
        "english_name": "Carmine",
        "chemical_formula": "C22H20O13",
        "color": "#D81B60",
        "origin": "动物/植物",
        "properties": "色彩鲜艳,耐光性一般",
        "historical_usage": "传统红色颜料,常用于服饰和化妆品"
    },
    "白粉": {
        "chinese_name": "白粉",
        "english_name": "Lead White / Chalk",
        "chemical_formula": "2PbCO3·Pb(OH)2 / CaCO3",
        "color": "#FAFAFA",
        "origin": "矿物/合成",
        "properties": "覆盖力强,铅白有毒",
        "historical_usage": "传统白色颜料,胡粉、蛤粉等"
    }
}

TRADITIONAL_TECHNIQUES = {
    "和玺彩画": "清代最高等级的彩画,用于宫殿、坛庙等重要建筑",
    "旋子彩画": "清代第二等级彩画,多用于官衙、庙宇的主殿",
    "苏式彩画": "源于苏州的彩画风格,多用于园林、住宅",
    "包袱彩画": "苏式彩画的一种,中心为半圆形包袱图案",
    "海墁彩画": "不用枋心包袱,满画图案的苏式彩画",
    "沥粉贴金": "用胶粉混成膏沥出线条,再贴金箔的工艺",
    "扫金": "将金箔扫成金粉使用的工艺",
    "泥金": "将金粉与胶混合使用的工艺",
    "描金": "用金粉直接描绘图案的工艺",
    "平金": "将金箔贴在平整表面的工艺",
    "叠晕": "同一颜色由浅到深逐层晕染的技法",
    "退晕": "颜色由深到浅逐渐过渡的技法",
    "对晕": "两种颜色相对晕染的技法",
    "三晕": "分三个层次晕染的技法",
    "五晕": "分五个层次晕染的技法"
}


class AIAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"OpenAI客户端初始化失败: {e}")
    
    def _call_openai(self, prompt: str, system_prompt: str = "") -> str:
        if not self.client:
            return self._fallback_analysis(prompt)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI调用失败: {e}")
            return self._fallback_analysis(prompt)
    
    def _fallback_analysis(self, prompt: str) -> str:
        return json.dumps({
            "summary": "基于对话内容的自动摘要（模拟数据）",
            "pigments": self._extract_pigments_from_text(prompt),
            "techniques": self._extract_techniques_from_text(prompt),
            "color_scheme": self._generate_color_scheme(),
            "maintenance_advice": self._generate_maintenance_advice()
        }, ensure_ascii=False)
    
    def _extract_pigments_from_text(self, text: str) -> List[Dict[str, Any]]:
        pigments = []
        text_lower = text.lower()
        
        for name, info in PIGMENT_DATABASE.items():
            if name.lower() in text_lower or info["english_name"].lower() in text_lower:
                pigments.append({
                    **info,
                    "confidence": 0.85,
                    "source": "对话内容识别"
                })
        
        if not pigments:
            default_pigments = ["石青", "石绿", "朱砂", "赭石"]
            for name in default_pigments:
                pigments.append({
                    **PIGMENT_DATABASE[name],
                    "confidence": 0.7,
                    "source": "基于传统工艺推荐"
                })
        
        return pigments
    
    def _extract_techniques_from_text(self, text: str) -> List[str]:
        techniques = []
        text_lower = text.lower()
        
        for name, description in TRADITIONAL_TECHNIQUES.items():
            if name.lower() in text_lower:
                techniques.append(name)
        
        if not techniques:
            techniques = ["沥粉贴金", "叠晕", "和玺彩画"]
        
        return techniques
    
    def _generate_color_scheme(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "主色调",
                "colors": [
                    {"name": "石青", "hex": "#1E88E5", "ratio": 35},
                    {"name": "石绿", "hex": "#43A047", "ratio": 30}
                ]
            },
            {
                "name": "辅助色",
                "colors": [
                    {"name": "朱砂", "hex": "#E53935", "ratio": 20},
                    {"name": "赭石", "hex": "#8D6E63", "ratio": 10}
                ]
            },
            {
                "name": "点缀色",
                "colors": [
                    {"name": "白粉", "hex": "#FAFAFA", "ratio": 3},
                    {"name": "贴金", "hex": "#FFD700", "ratio": 2}
                ]
            }
        ]
    
    def _generate_maintenance_advice(self) -> List[str]:
        return [
            "控制环境温湿度:温度18-24°C,相对湿度45%-60%",
            "避免阳光直射:紫外线会加速颜料褪色和老化",
            "定期除尘:使用软毛刷轻轻拂去表面灰尘",
            "防止生物侵害:注意防虫、防霉处理",
            "避免机械损伤:防止碰撞、刮擦彩画表面",
            "建立监测系统:定期记录彩画保存状态",
            "制定修复预案:提前准备应急修复材料和方案",
            "专业维护:重大修复需由专业文物修复人员操作"
        ]
    
    def analyze_dialogue(
        self,
        transcript: List[Dict[str, Any]],
        chromatography_data: Optional[Dict[str, Any]] = None,
        project_name: str = "",
        building_name: str = "",
        location: str = "",
        notes: str = ""
    ) -> Dict[str, Any]:
        dialogue_text = "\n".join([
            f"[{seg.get('role', seg.get('speaker', ''))}] {seg.get('text', '')}"
            for seg in transcript
        ])
        
        all_keywords = set()
        for seg in transcript:
            all_keywords.update(seg.get("keywords", []))
        
        system_prompt = """你是一位古建彩画修复专家,擅长分析专家论证会对话,提取矿物颜料成分和传统技法,
        生成科学的配色方案和保养建议。请以JSON格式输出分析结果。"""
        
        prompt = f"""
        项目名称: {project_name}
        建筑名称: {building_name}
        位置: {location}
        备注: {notes}
        
        对话内容:
        {dialogue_text}
        
        提取的关键词: {', '.join(all_keywords)}
        
        色谱数据: {json.dumps(chromatography_data, ensure_ascii=False) if chromatography_data else '无'}
        
        请分析以上内容,输出JSON格式的结果,包含以下字段:
        1. summary: 会议内容摘要(200-300字)
        2. pigments: 识别到的矿物颜料列表,每个颜料包含:名称、化学式、颜色值、来源、可信度
        3. techniques: 提到的传统技法列表
        4. color_scheme: 推荐配色方案,包含主色调、辅助色、点缀色及其比例
        5. maintenance_advice: 保养建议列表(5-8条)
        
        请严格按照JSON格式输出,不要包含其他文字。
        """
        
        try:
            result_str = self._call_openai(prompt, system_prompt)
            result = json.loads(result_str)
            
            if "pigments" not in result or not result["pigments"]:
                result["pigments"] = self._extract_pigments_from_text(dialogue_text)
            if "techniques" not in result or not result["techniques"]:
                result["techniques"] = self._extract_techniques_from_text(dialogue_text)
            if "color_scheme" not in result or not result["color_scheme"]:
                result["color_scheme"] = self._generate_color_scheme()
            if "maintenance_advice" not in result or not result["maintenance_advice"]:
                result["maintenance_advice"] = self._generate_maintenance_advice()
            if "summary" not in result:
                result["summary"] = self._generate_summary(transcript, project_name, building_name)
            
            return result
            
        except Exception as e:
            print(f"AI分析失败: {e}")
            return {
                "summary": self._generate_summary(transcript, project_name, building_name),
                "pigments": self._extract_pigments_from_text(dialogue_text),
                "techniques": self._extract_techniques_from_text(dialogue_text),
                "color_scheme": self._generate_color_scheme(),
                "maintenance_advice": self._generate_maintenance_advice()
            }
    
    def _generate_summary(self, transcript: List[Dict[str, Any]], project_name: str, building_name: str) -> str:
        chemist_count = sum(1 for seg in transcript if seg.get("role") == "分析检测方")
        restorer_count = sum(1 for seg in transcript if seg.get("role") == "修复方")
        
        all_keywords = set()
        for seg in transcript:
            all_keywords.update(seg.get("keywords", []))
        
        summary_parts = [
            f"本次{project_name or '古建彩画修复'}专家论证会",
            f"针对{building_name or '古建筑'}彩画修复问题展开讨论。",
            f"会议共进行了{len(transcript)}轮发言,",
            f"其中分析检测方发言{chemist_count}次,",
            f"修复方发言{restorer_count}次。",
            f"讨论涉及的关键词包括: {', '.join(list(all_keywords)[:10])}。",
            f"会议就彩画的颜料成分分析、传统技法传承、",
            f"修复方案制定等方面达成了重要共识。"
        ]
        
        return "".join(summary_parts)

import os
import numpy as np
import librosa
import soundfile as sf
import whisper
from typing import List, Dict, Any
import re
from dotenv import load_dotenv

load_dotenv()

PIGMENT_KEYWORDS = [
    "石青", "石绿", "朱砂", "赭石", "藤黄", "花青", "胭脂", "白粉",
    "群青", "钴蓝", "铬黄", "镉红", "铁红", "铁黄", "碳黑", "钛白",
    "金粉", "银粉", "云母", "珍珠粉", "高岭土", "石英", "方解石",
    "azurite", "malachite", "cinnabar", "ochre", "gamboge", "indigo",
    "vermilion", "ultramarine", "cobalt blue", "chrome yellow"
]

TECHNIQUE_KEYWORDS = [
    "和玺彩画", "旋子彩画", "苏式彩画", "包袱彩画", "海墁彩画",
    "碾玉装", "五彩遍装", "青绿彩画", "土朱刷饰", "解绿装饰",
    "叠晕", "间色", "退晕", "对晕", "三晕", "五晕",
    "沥粉贴金", "扫金", "泥金", "描金", "平金",
    "落墨", "勾勒", "填色", "晕染", "罩染",
    "做旧", "仿旧", "修复", "补色", "接色",
    "traditional technique", "color washing", "gold leaf", "gilding"
]


class AudioProcessor:
    def __init__(self):
        self.whisper_model = os.getenv("WHISPER_MODEL", "base")
        self.model = None
        self.pyannote_pipeline = None
    
    def _load_whisper(self):
        if self.model is None:
            self.model = whisper.load_model(self.whisper_model)
        return self.model
    
    def _load_pyannote(self):
        if self.pyannote_pipeline is None:
            try:
                from pyannote.audio import Pipeline
                auth_token = os.getenv("PYANNOTE_AUTH_TOKEN")
                if auth_token:
                    self.pyannote_pipeline = Pipeline.from_pretrained(
                        "pyannote/speaker-diarization-3.1",
                        use_auth_token=auth_token
                    )
            except Exception as e:
                print(f"Pyannote加载失败: {e}")
        return self.pyannote_pipeline
    
    def denoise_audio(self, audio_path: str, output_path: str = None) -> str:
        try:
            y, sr = librosa.load(audio_path, sr=None)
            
            if len(y.shape) > 1:
                y = librosa.to_mono(y)
            
            y_normalized = librosa.util.normalize(y)
            
            S_full, phase = librosa.magphase(librosa.stft(y_normalized))
            
            S_filter = librosa.decompose.nn_filter(
                S_full,
                aggregate=np.median,
                metric='cosine',
                width=int(librosa.time_to_frames(2, sr=sr))
            )
            
            S_filter = np.minimum(S_full, S_filter)
            
            margin_i, margin_v = 2, 10
            power = 2
            
            mask_i = librosa.util.softmask(
                S_filter,
                margin_i * (S_full - S_filter),
                power=power
            )
            
            mask_v = librosa.util.softmask(
                S_full - S_filter,
                margin_v * S_filter,
                power=power
            )
            
            S_foreground = mask_v * S_full
            y_denoised = librosa.istft(S_foreground * phase)
            
            y_denoised = librosa.util.normalize(y_denoised)
            
            if output_path is None:
                base, ext = os.path.splitext(audio_path)
                output_path = f"{base}_denoised{ext}"
            
            sf.write(output_path, y_denoised, sr)
            return output_path
            
        except Exception as e:
            print(f"去噪失败: {e}")
            return audio_path
    
    def transcribe_with_whisper(self, audio_path: str) -> List[Dict[str, Any]]:
        try:
            model = self._load_whisper()
            result = model.transcribe(
                audio_path,
                language="zh",
                task="transcribe",
                verbose=False
            )
            
            segments = []
            for seg in result["segments"]:
                segments.append({
                    "start_time": float(seg["start"]),
                    "end_time": float(seg["end"]),
                    "text": seg["text"].strip(),
                    "speaker": "SPEAKER_00"
                })
            
            return segments
            
        except Exception as e:
            print(f"Whisper转录失败: {e}")
            return []
    
    def diarize_speakers(self, audio_path: str) -> List[Dict[str, Any]]:
        try:
            pipeline = self._load_pyannote()
            if pipeline is None:
                return []
            
            diarization = pipeline(audio_path)
            
            segments = []
            for turn, _, speaker in diarization.itertracks(yield_label=True):
                segments.append({
                    "start_time": float(turn.start),
                    "end_time": float(turn.end),
                    "speaker": speaker
                })
            
            return segments
            
        except Exception as e:
            print(f"说话人分离失败: {e}")
            return []
    
    def merge_transcript_and_diarization(
        self,
        transcript_segments: List[Dict[str, Any]],
        diarization_segments: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        if not diarization_segments:
            for seg in transcript_segments:
                seg["role"] = self._classify_role(seg["text"])
                seg["keywords"] = self._extract_keywords(seg["text"])
            return transcript_segments
        
        merged = []
        for trans_seg in transcript_segments:
            mid_time = (trans_seg["start_time"] + trans_seg["end_time"]) / 2
            
            best_speaker = "SPEAKER_00"
            best_overlap = 0
            
            for dia_seg in diarization_segments:
                overlap_start = max(trans_seg["start_time"], dia_seg["start_time"])
                overlap_end = min(trans_seg["end_time"], dia_seg["end_time"])
                overlap = max(0, overlap_end - overlap_start)
                
                if overlap > best_overlap:
                    best_overlap = overlap
                    best_speaker = dia_seg["speaker"]
            
            merged.append({
                "start_time": trans_seg["start_time"],
                "end_time": trans_seg["end_time"],
                "text": trans_seg["text"],
                "speaker": best_speaker,
                "role": self._classify_role(trans_seg["text"]),
                "keywords": self._extract_keywords(trans_seg["text"])
            })
        
        return merged
    
    def _classify_role(self, text: str) -> str:
        text_lower = text.lower()
        
        chemist_keywords = ["分析", "检测", "成分", "光谱", "色谱", "质谱", "显微镜", "样品",
                           "analysis", "detection", "component", "spectrum", "chromatography",
                           "mass spectrometry", "microscope", "sample"]
        restorer_keywords = ["修复", "技法", "传统", "工艺", "制作", "操作", "经验", "师傅",
                            "restoration", "technique", "traditional", "craft", "process",
                            "master", "experience"]
        
        chemist_score = sum(1 for kw in chemist_keywords if kw in text_lower)
        restorer_score = sum(1 for kw in restorer_keywords if kw in text_lower)
        
        if chemist_score > restorer_score:
            return "分析检测方"
        elif restorer_score > chemist_score:
            return "修复方"
        else:
            return "其他"
    
    def _extract_keywords(self, text: str) -> List[str]:
        text_lower = text.lower()
        keywords = []
        
        for pigment in PIGMENT_KEYWORDS:
            if pigment.lower() in text_lower:
                keywords.append(pigment)
        
        for technique in TECHNIQUE_KEYWORDS:
            if technique.lower() in text_lower:
                keywords.append(technique)
        
        return list(set(keywords))
    
    def process_audio(self, audio_path: str) -> List[Dict[str, Any]]:
        try:
            denoised_path = self.denoise_audio(audio_path)
            
            transcript = self.transcribe_with_whisper(denoised_path)
            
            diarization = self.diarize_speakers(denoised_path)
            
            merged = self.merge_transcript_and_diarization(transcript, diarization)
            
            return merged
            
        except Exception as e:
            print(f"音频处理失败: {e}")
            return []

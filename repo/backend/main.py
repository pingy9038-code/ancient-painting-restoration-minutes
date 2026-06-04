from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from datetime import datetime

from .services.audio_processor import AudioProcessor
from .services.ai_analyzer import AIAnalyzer
from .services.archive_manager import ArchiveManager

app = FastAPI(title="古建彩画修复色谱纪要系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("archives", exist_ok=True)
os.makedirs("static", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

audio_processor = AudioProcessor()
ai_analyzer = AIAnalyzer()
archive_manager = ArchiveManager()


class ChromatographyData(BaseModel):
    sample_id: str
    location: str
    building_name: str
    sample_date: str
    microscope_data: Dict[str, Any]
    colorimeter_data: List[Dict[str, Any]]


class AnalysisRequest(BaseModel):
    project_name: str
    building_name: str
    location: str
    chromatography_data: Optional[ChromatographyData] = None
    notes: Optional[str] = None


class DialogueSegment(BaseModel):
    speaker: str
    role: str
    start_time: float
    end_time: float
    text: str
    keywords: List[str]


class AnalysisResult(BaseModel):
    project_id: str
    transcript: List[DialogueSegment]
    pigments: List[Dict[str, Any]]
    techniques: List[str]
    color_scheme: List[Dict[str, Any]]
    maintenance_advice: List[str]
    summary: str
    archive_path: str


@app.get("/")
async def root():
    return {"message": "古建彩画修复色谱纪要系统 API", "version": "1.0.0"}


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_meeting(
    audio_file: UploadFile = File(...),
    chromatography_data: Optional[ChromatographyData] = None,
    project_name: str = "",
    building_name: str = "",
    location: str = "",
    notes: str = ""
):
    try:
        project_id = f"PRJ_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        audio_path = f"uploads/{project_id}_{audio_file.filename}"
        
        with open(audio_path, "wb") as f:
            content = await audio_file.read()
            f.write(content)
        
        transcript = audio_processor.process_audio(audio_path)
        
        analysis = ai_analyzer.analyze_dialogue(
            transcript=transcript,
            chromatography_data=chromatography_data.dict() if chromatography_data else None,
            project_name=project_name,
            building_name=building_name,
            location=location,
            notes=notes
        )
        
        archive_path = archive_manager.create_archive(
            project_id=project_id,
            project_name=project_name,
            building_name=building_name,
            location=location,
            transcript=transcript,
            analysis=analysis,
            chromatography_data=chromatography_data.dict() if chromatography_data else None,
            notes=notes
        )
        
        return AnalysisResult(
            project_id=project_id,
            transcript=[DialogueSegment(**seg) for seg in transcript],
            pigments=analysis["pigments"],
            techniques=analysis["techniques"],
            color_scheme=analysis["color_scheme"],
            maintenance_advice=analysis["maintenance_advice"],
            summary=analysis["summary"],
            archive_path=archive_path
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chromatography/upload")
async def upload_chromatography(data: ChromatographyData):
    try:
        return {"status": "success", "message": "色谱数据已接收", "sample_id": data.sample_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/archives")
async def list_archives():
    try:
        archives = archive_manager.list_archives()
        return {"archives": archives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/archives/{project_id}")
async def get_archive(project_id: str):
    try:
        archive = archive_manager.get_archive(project_id)
        return archive
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="档案不存在")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.lead import LeadStatus


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    job_title: str
    industry: str
    status: LeadStatus = LeadStatus.new


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    industry: Optional[str] = None
    status: Optional[LeadStatus] = None


class QualificationResult(BaseModel):
    score: float
    reason: str


class EmailGenerationResult(BaseModel):
    subject: str
    email: str
    cta: str


class LeadOut(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    email: str
    company: str
    job_title: str
    industry: str
    status: LeadStatus
    qualification_score: Optional[float] = None
    qualification_reason: Optional[str] = None
    generated_email_subject: Optional[str] = None
    generated_email_body: Optional[str] = None
    generated_email_cta: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LeadsPage(BaseModel):
    items: list[LeadOut]
    total: int
    page: int
    limit: int
    pages: int

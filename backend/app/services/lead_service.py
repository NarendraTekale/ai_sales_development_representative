from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional
from app.repositories.lead import LeadRepository
from app.models.lead import Lead, LeadStatus
from app.schemas.lead import LeadCreate, LeadUpdate, LeadsPage, LeadOut, QualificationResult, EmailGenerationResult
from app.services.openai_service import OpenAIService
from app.core.logging import logger
import math


class LeadService:
    def __init__(self, db: Session):
        self.repo = LeadRepository(db)
        self.openai_svc = OpenAIService()

    def create(self, user_id: UUID, data: LeadCreate) -> Lead:
        lead = self.repo.create(user_id, data)
        logger.info("lead_created", lead_id=str(lead.id), user_id=str(user_id))
        return lead

    def get_or_404(self, lead_id: UUID, user_id: UUID) -> Lead:
        lead = self.repo.get_by_id(lead_id, user_id)
        if not lead:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
        return lead

    def list_leads(
        self,
        user_id: UUID,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[LeadStatus] = None,
        industry: Optional[str] = None,
        min_score: Optional[float] = None,
    ) -> LeadsPage:
        items, total = self.repo.get_all(
            user_id=user_id,
            page=page,
            limit=limit,
            search=search,
            status=status,
            industry=industry,
            min_score=min_score,
        )
        return LeadsPage(
            items=[LeadOut.model_validate(i) for i in items],
            total=total,
            page=page,
            limit=limit,
            pages=math.ceil(total / limit) if total else 0,
        )

    def update(self, lead_id: UUID, user_id: UUID, data: LeadUpdate) -> Lead:
        lead = self.get_or_404(lead_id, user_id)
        return self.repo.update(lead, data)

    def delete(self, lead_id: UUID, user_id: UUID) -> None:
        lead = self.get_or_404(lead_id, user_id)
        self.repo.delete(lead)
        logger.info("lead_deleted", lead_id=str(lead_id))

    def qualify(self, lead_id: UUID, user_id: UUID) -> QualificationResult:
        lead = self.get_or_404(lead_id, user_id)
        logger.info("qualifying_lead", lead_id=str(lead_id))
        try:
            result = self.openai_svc.qualify_lead(
                name=lead.name,
                company=lead.company,
                industry=lead.industry,
                job_title=lead.job_title,
            )
        except Exception as e:
            logger.error("openai_error", error=str(e))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"OpenAI API error: {str(e)}",
            )
        self.repo.save_qualification(lead, result["score"], result["reason"])
        return QualificationResult(**result)

    def generate_email(self, lead_id: UUID, user_id: UUID) -> EmailGenerationResult:
        lead = self.get_or_404(lead_id, user_id)
        logger.info("generating_email", lead_id=str(lead_id))
        try:
            result = self.openai_svc.generate_email(
                name=lead.name,
                company=lead.company,
                industry=lead.industry,
                job_title=lead.job_title,
            )
        except Exception as e:
            logger.error("openai_email_error", error=str(e))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Email generation error: {str(e)}",
            )
        self.repo.save_generated_email(lead, result["subject"], result["email"], result["cta"])
        return EmailGenerationResult(**result)

    def get_stats(self, user_id: UUID) -> dict:
        return self.repo.get_stats(user_id)

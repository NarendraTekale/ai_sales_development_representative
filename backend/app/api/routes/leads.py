from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadUpdate, LeadOut, LeadsPage, QualificationResult, EmailGenerationResult
from app.services.lead_service import LeadService
from app.api.deps import get_current_user
from app.models.user import User
from app.models.lead import LeadStatus

router = APIRouter(prefix="/leads", tags=["Leads"])


def get_lead_service(db: Session = Depends(get_db)) -> LeadService:
    return LeadService(db)


@router.post("", response_model=LeadOut, status_code=201)
def create_lead(
    data: LeadCreate,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.create(current_user.id, data)


@router.get("", response_model=LeadsPage)
def list_leads(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[LeadStatus] = Query(None),
    industry: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None, ge=0, le=100),
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.list_leads(
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        status=status,
        industry=industry,
        min_score=min_score,
    )


@router.get("/stats")
def get_stats(
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_stats(current_user.id)


@router.get("/{lead_id}", response_model=LeadOut)
def get_lead(
    lead_id: UUID,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_or_404(lead_id, current_user.id)


@router.put("/{lead_id}", response_model=LeadOut)
def update_lead(
    lead_id: UUID,
    data: LeadUpdate,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.update(lead_id, current_user.id, data)


@router.delete("/{lead_id}", status_code=204)
def delete_lead(
    lead_id: UUID,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    service.delete(lead_id, current_user.id)


@router.post("/{lead_id}/qualify", response_model=QualificationResult)
def qualify_lead(
    lead_id: UUID,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.qualify(lead_id, current_user.id)


@router.post("/{lead_id}/generate-email", response_model=EmailGenerationResult)
def generate_email(
    lead_id: UUID,
    service: LeadService = Depends(get_lead_service),
    current_user: User = Depends(get_current_user),
):
    return service.generate_email(lead_id, current_user.id)

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional
from uuid import UUID
from app.models.lead import Lead, LeadStatus
from app.schemas.lead import LeadCreate, LeadUpdate


class LeadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, data: LeadCreate) -> Lead:
        lead = Lead(user_id=user_id, **data.model_dump())
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def get_by_id(self, lead_id: UUID, user_id: UUID) -> Optional[Lead]:
        return (
            self.db.query(Lead)
            .filter(Lead.id == lead_id, Lead.user_id == user_id)
            .first()
        )

    def get_all(
        self,
        user_id: UUID,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        status: Optional[LeadStatus] = None,
        industry: Optional[str] = None,
        min_score: Optional[float] = None,
    ) -> tuple[list[Lead], int]:
        query = self.db.query(Lead).filter(Lead.user_id == user_id)

        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Lead.name.ilike(pattern),
                    Lead.company.ilike(pattern),
                    Lead.industry.ilike(pattern),
                )
            )
        if status:
            query = query.filter(Lead.status == status)
        if industry:
            query = query.filter(Lead.industry.ilike(f"%{industry}%"))
        if min_score is not None:
            query = query.filter(Lead.qualification_score >= min_score)

        total = query.count()
        items = query.order_by(Lead.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return items, total

    def update(self, lead: Lead, data: LeadUpdate) -> Lead:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(lead, field, value)
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def save_qualification(self, lead: Lead, score: float, reason: str) -> Lead:
        lead.qualification_score = score
        lead.qualification_reason = reason
        lead.status = LeadStatus.qualified
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def save_generated_email(self, lead: Lead, subject: str, email: str, cta: str) -> Lead:
        lead.generated_email_subject = subject
        lead.generated_email_body = email
        lead.generated_email_cta = cta
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def delete(self, lead: Lead) -> None:
        self.db.delete(lead)
        self.db.commit()

    def get_stats(self, user_id: UUID) -> dict:
        total = self.db.query(func.count(Lead.id)).filter(Lead.user_id == user_id).scalar()
        qualified = (
            self.db.query(func.count(Lead.id))
            .filter(Lead.user_id == user_id, Lead.qualification_score.isnot(None))
            .scalar()
        )
        avg_score = (
            self.db.query(func.avg(Lead.qualification_score))
            .filter(Lead.user_id == user_id, Lead.qualification_score.isnot(None))
            .scalar()
        )
        emails_generated = (
            self.db.query(func.count(Lead.id))
            .filter(Lead.user_id == user_id, Lead.generated_email_body.isnot(None))
            .scalar()
        )
        return {
            "total_leads": total or 0,
            "qualified_leads": qualified or 0,
            "average_score": round(float(avg_score), 1) if avg_score else 0.0,
            "emails_generated": emails_generated or 0,
        }

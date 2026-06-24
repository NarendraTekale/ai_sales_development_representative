from sqlalchemy import Column, String, DateTime, Float, Text, ForeignKey, func, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.db.base import Base


class LeadStatus(str, enum.Enum):
    new = "new"
    qualified = "qualified"
    contacted = "contacted"
    converted = "converted"
    rejected = "rejected"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    industry = Column(String(255), nullable=False)
    status = Column(Enum(LeadStatus), default=LeadStatus.new, nullable=False)
    qualification_score = Column(Float, nullable=True)
    qualification_reason = Column(Text, nullable=True)
    generated_email_subject = Column(String(500), nullable=True)
    generated_email_body = Column(Text, nullable=True)
    generated_email_cta = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="leads")

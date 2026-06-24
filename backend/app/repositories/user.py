from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.models.user import User
from app.core.security import get_password_hash


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, email: str, password: str) -> User:
        user = User(email=email, password_hash=get_password_hash(password))
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def exists_by_email(self, email: str) -> bool:
        return self.db.query(User.id).filter(User.email == email).scalar() is not None

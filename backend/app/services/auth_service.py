from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user import UserRepository
from app.core.security import verify_password, create_access_token
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.core.logging import logger


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: UserRegister) -> Token:
        if self.repo.exists_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        user = self.repo.create(data.email, data.password)
        logger.info("user_registered", email=data.email, user_id=str(user.id))
        token = create_access_token({"sub": str(user.id)})
        return Token(access_token=token, user=UserOut.model_validate(user))

    def login(self, data: UserLogin) -> Token:
        user = self.repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        logger.info("user_logged_in", email=data.email, user_id=str(user.id))
        token = create_access_token({"sub": str(user.id)})
        return Token(access_token=token, user=UserOut.model_validate(user))

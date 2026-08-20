from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.db import Base

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(String, primary_key=True, index=True)
    
    # Metadata
    applicant_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    pan = Column(String, nullable=False)

    # ML Inputs
    dependents = Column(String, nullable=False)
    education = Column(String, nullable=False)
    self_employed = Column(String, nullable=False)
    applicant_income = Column(Float, nullable=False)
    coapplicant_income = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    loan_amount_term = Column(Float, nullable=False)
    credit_history = Column(Float, nullable=False)
    property_area = Column(String, nullable=False)

    # ML Outputs & Assessment
    prediction = Column(String, nullable=False)
    approval_probability = Column(Float, nullable=False)
    recommendation = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    message = Column(String, nullable=True)

    # Lifecycle
    status = Column(String, nullable=False, default="PENDING")
    manager_note = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

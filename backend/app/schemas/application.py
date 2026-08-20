from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class LoanPredictionRequest(BaseModel):
    applicant_name: str
    email: EmailStr
    phone: str
    pan: str = Field(..., pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
    
    dependents: str
    education: str
    self_employed: str
    applicant_income: float
    coapplicant_income: float
    loan_amount: float
    loan_amount_term: float
    credit_history: float
    property_area: str

class LoanPredictionResponse(BaseModel):
    application_id: str
    prediction: str
    approval_probability: float
    recommendation: str
    risk_level: str
    status: str
    message: str

class ApplicationResponse(BaseModel):
    application_id: str
    applicant_name: str
    approval_probability: float
    recommendation: str
    risk_level: str
    status: str

class ApplicationListResponse(BaseModel):
    applications: List[ApplicationResponse]

class ManagerStatusUpdateRequest(BaseModel):
    status: str

class ManagerStatusUpdateResponse(BaseModel):
    application_id: str
    status: str
    notification_created: bool

class ManagerBulkActionRequest(BaseModel):
    application_ids: List[str]
    action: str

class ManagerBulkActionResponse(BaseModel):
    updated: int
    status: str

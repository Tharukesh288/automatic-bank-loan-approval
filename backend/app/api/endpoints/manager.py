from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.application import ApplicationListResponse, ApplicationResponse, ManagerStatusUpdateRequest, ManagerStatusUpdateResponse, ManagerBulkActionRequest, ManagerBulkActionResponse
from app.database.db import get_db
from app.database.models import Application

router = APIRouter()

@router.get("/manager/applications", response_model=ApplicationListResponse)
def list_applications(
    status: Optional[str] = None, 
    sort: Optional[str] = None, 
    order: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(Application)
    
    if status:
        query = query.filter(Application.status == status)
        
    if sort == "approval_probability":
        if order == "desc":
            query = query.order_by(Application.approval_probability.desc())
        else:
            query = query.order_by(Application.approval_probability.asc())
            
    applications = query.all()
    
    return ApplicationListResponse(
        applications=[
            ApplicationResponse(
                application_id=app.application_id,
                applicant_name=app.applicant_name,
                email=app.email,
                phone=app.phone,
                pan=app.pan,
                dependents=app.dependents,
                education=app.education,
                self_employed=app.self_employed,
                applicant_income=app.applicant_income,
                coapplicant_income=app.coapplicant_income,
                loan_amount=app.loan_amount,
                loan_amount_term=app.loan_amount_term,
                credit_history=app.credit_history,
                property_area=app.property_area,
                prediction=app.prediction,
                approval_probability=app.approval_probability,
                recommendation=app.recommendation,
                risk_level=app.risk_level,
                message=app.message,
                status=app.status
            )
            for app in applications
        ]
    )

@router.patch("/manager/applications/{application_id}/status", response_model=ManagerStatusUpdateResponse)
def update_application_status(
    application_id: str, 
    request: ManagerStatusUpdateRequest, 
    db: Session = Depends(get_db)
):
    allowed_statuses = ["UNDER_REVIEW", "SHORTLISTED", "REJECTED"]
    if request.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    application.status = request.status
    db.commit()
    db.refresh(application)
    
    return ManagerStatusUpdateResponse(
        application_id=application.application_id,
        status=application.status,
        notification_created=True
    )

@router.post("/manager/applications/bulk-action", response_model=ManagerBulkActionResponse)
def bulk_action(request: ManagerBulkActionRequest, db: Session = Depends(get_db)):
    allowed_actions = {"SHORTLIST": "SHORTLISTED", "REJECT": "REJECTED", "REVIEW": "UNDER_REVIEW"}
    if request.action not in allowed_actions:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    new_status = allowed_actions[request.action]
    
    updated_count = db.query(Application).filter(Application.application_id.in_(request.application_ids)).update({"status": new_status}, synchronize_session=False)
    db.commit()
    
    return ManagerBulkActionResponse(
        updated=updated_count,
        status=new_status
    )

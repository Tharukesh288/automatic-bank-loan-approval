import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.application import LoanPredictionRequest, LoanPredictionResponse, ApplicationResponse
from app.services.prediction import make_prediction
from app.database.db import get_db
from app.database.models import Application

router = APIRouter()

@router.post("/loan/predict", response_model=LoanPredictionResponse)
def predict_loan(request: LoanPredictionRequest, db: Session = Depends(get_db)):
    ml_input = {
        "dependents": request.dependents,
        "education": request.education,
        "self_employed": request.self_employed,
        "applicant_income": request.applicant_income,
        "coapplicant_income": request.coapplicant_income,
        "loan_amount": request.loan_amount,
        "loan_amount_term": request.loan_amount_term,
        "credit_history": request.credit_history,
        "property_area": request.property_area
    }
    
    prediction_result = make_prediction(ml_input)
    
    # Generate Application ID
    application_id = f"LA-{str(uuid.uuid4())[:8].upper()}"
    
    new_application = Application(
        application_id=application_id,
        applicant_name=request.applicant_name,
        email=request.email,
        phone=request.phone,
        pan=request.pan,
        **ml_input,
        prediction=prediction_result["prediction"],
        approval_probability=prediction_result["approval_probability"],
        recommendation=prediction_result["recommendation"],
        risk_level=prediction_result["risk_level"],
        message=prediction_result.get("message", ""),
        status="AI_ASSESSED"
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return LoanPredictionResponse(
        application_id=new_application.application_id,
        prediction=new_application.prediction,
        approval_probability=new_application.approval_probability,
        recommendation=new_application.recommendation,
        risk_level=new_application.risk_level,
        status=new_application.status,
        message=new_application.message
    )

@router.get("/applications/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: str, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return ApplicationResponse(
        application_id=application.application_id,
        applicant_name=application.applicant_name,
        email=application.email,
        phone=application.phone,
        pan=application.pan,
        dependents=application.dependents,
        education=application.education,
        self_employed=application.self_employed,
        applicant_income=application.applicant_income,
        coapplicant_income=application.coapplicant_income,
        loan_amount=application.loan_amount,
        loan_amount_term=application.loan_amount_term,
        credit_history=application.credit_history,
        property_area=application.property_area,
        prediction=application.prediction,
        approval_probability=application.approval_probability,
        recommendation=application.recommendation,
        risk_level=application.risk_level,
        message=application.message,
        status=application.status
    )

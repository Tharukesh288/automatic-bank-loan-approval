# Frontend Web Subsystem — Automatic Bank Loan Approval

This directory contains the **React + Vite single-page web application** for the **Automatic Bank Loan Approval & Decision Support System**.

---

## 1. Overview & Technology Stack

The frontend provides a responsive interface for two main user roles:
1. **Loan Applicants**: Submit loan applications and view immediate AI credit risk assessments.
2. **Bank Managers**: Manage application queues, review applicant profiles, filter applications by status, inspect detailed loan document sheets, and execute bulk decision actions (`Review`, `Shortlist`, `Reject`).

### Technology Stack
- **Framework**: React 18
- **Build Tool / Dev Server**: Vite 8
- **Routing**: React Router DOM v6
- **Styling**: Modern Vanilla CSS Design System (Custom CSS Variables, Glassmorphism, Micro-animations)
- **Icons & Assets**: Custom SVG & WebP / MP4 Media Backgrounds
- **API Client**: Native `fetch` API with built-in Mock Fallback Layer

---

## 2. Page Components & Features

### 1. Landing Page (`LandingPage.jsx`)
- **Design Aesthetic**: Retro 90s Indian financial market-inspired visual theme with full-screen video background (`/background.mp4`) and translucent glassmorphism hero card.
- **Role Navigation**: Quick access buttons to "Start Application" or enter "Manager Login".

### 2. Loan Application Form (`ApplyPage.jsx`)
- **Form Fields**: Collects applicant identity data, demographic profile, financial metrics, and property area.
- **PAN Format Validation**: Client-side regex pattern enforcement for Indian Permanent Account Numbers (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`, e.g., `ABCDE1234F`).
- **Indian Rupee (₹) Labels**: Input fields explicitly specify Indian Rupee currency units:
  - `Applicant Income (₹)`
  - `Coapplicant Income (₹)`
  - `Loan Amount (in ₹ Thousands)`

### 3. Assessment Result Page (`ResultPage.jsx`)
- Displays real-time AI credit assessment results:
  - **Approval Probability Badge**: Formatted as a prominent percentage score (e.g. **`85%`**).
  - **Recommendation Badge**: `STRONG CANDIDATE`, `MANUAL REVIEW`, or `HIGHER RISK`.
  - **Risk Level Badge**: `LOW`, `MEDIUM`, or `HIGH`.
  - **Guidance Note**: AI assessment message explaining decision factors.

### 4. Manager Dashboard (`ManagerPage.jsx`)
- **Status Filter Navigation Tabs**: Filter applications dynamically across workflow states:
  - `[ Pending ]` (`status = AI_ASSESSED`) — Default landing view.
  - `[ Under Review ]` (`status = UNDER_REVIEW`)
  - `[ Shortlisted ]` (`status = SHORTLISTED`)
  - `[ Rejected ]` (`status = REJECTED`)
  - `[ All ]` (All applications)
- **Compact Queue Table**: Optimized table columns displaying ID, Applicant Name, Approval Probability %, Recommendation, Risk Level, Status, and Action.
- **Bulk Action Buttons**:
  - `Review`: Moves selected applications to `UNDER_REVIEW`.
  - `Reject`: Moves selected applications to `REJECTED` (Red badge).
  - `Shortlist`: Moves selected applications to `SHORTLISTED` (Green `btn-success` badge).
- **Application Details Sheet Modal (`ApplicationDetailsSheet.jsx`)**:
  - Clicking **"See Details"** opens a document sheet modal formatted like a formal loan document.
  - Separated into **4 distinct sections**:
    1. **APPLICANT INFORMATION**: ID, Name, Email, Phone, PAN.
    2. **APPLICANT PROFILE**: Dependents, Education, Self-Employed, Property Area.
    3. **FINANCIAL INFORMATION**: Applicant Income (₹), Co-applicant Income (₹), Loan Amount (₹), Term, Credit History.
    4. **AI ASSESSMENT**: Prediction outcome, Probability %, Recommendation, Risk Level, Assessment Note, Status.
  - **Non-Mutating**: Closing the details sheet modal does **not** change application status.

---

## 3. Service & API Layer (`frontend/src/services/api.js`)

The frontend features a dual-mode API service layer:
- **Live FastAPI Integration**: Connects to backend endpoints (`http://localhost:8000/api/v1/...`).
- **Mock Fallback Engine**: If the backend server is unreachable, `handleMockRequest` seamlessly intercept requests, generates realistic prediction results, and maintains an in-memory mock database to allow complete offline development and testing.

---

## 4. Directory Structure

```text
frontend/
├── public/
│   ├── background.mp4         # Landing page video background
│   ├── logo.png               # System branding logo
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ApplicationDetailsSheet.jsx  # Detailed loan document modal
│   │   ├── Button.jsx                  # Reusable button component
│   │   ├── Card.jsx                    # Card & container wrapper
│   │   ├── Header.jsx                  # Navigation header bar
│   │   ├── Input.jsx                   # Form input with floating label
│   │   ├── Select.jsx                  # Form select dropdown
│   │   ├── StatusBadge.jsx             # Color-coded recommendation/status pill
│   │   └── Table.jsx                   # Manager dashboard data table
│   ├── pages/
│   │   ├── ApplyPage.jsx               # Loan application submission page
│   │   ├── LandingPage.jsx             # Retro financial landing page
│   │   ├── ManagerPage.jsx             # Manager dashboard & lifecycle manager
│   │   └── ResultPage.jsx              # Applicant AI result page
│   ├── services/
│   │   └── api.js                      # API client & mock fallback engine
│   ├── App.jsx                         # Main router configuration
│   ├── main.jsx                        # React root entry point
│   └── index.css                       # Design system CSS tokens & styles
├── index.html                          # HTML5 template
├── package.json                        # Node dependencies & scripts
├── vite.config.js                      # Vite build configuration
└── README.md                           # Subsystem documentation
```

---

## 5. How to Setup & Run

### 1. Install Node Dependencies
```bash
cd frontend
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173`.

### 3. Build Production Bundle
```bash
npm run build
```
Generates optimized static assets in `frontend/dist/`.

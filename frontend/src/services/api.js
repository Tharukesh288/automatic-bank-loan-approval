const BASE_URL = 'http://localhost:8000/api/v1';

async function fetchWithMockFallback(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'An error occurred with the API.');
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API call failed: ${url}`, error);
    // If backend is down, fallback to mock layer (as per ANTIGRAVITY_PROMPTS.md)
    return handleMockRequest(url, options);
  }
}

// --- API Service Methods ---

export async function predictLoan(applicationData) {
  return fetchWithMockFallback('/loan/predict', {
    method: 'POST',
    body: JSON.stringify(applicationData)
  });
}

export async function getApplication(applicationId) {
  return fetchWithMockFallback(`/applications/${applicationId}`);
}

export async function getManagerApplications(status = '', sort = '', order = '') {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchWithMockFallback(`/manager/applications${query}`);
}

export async function updateApplicationStatus(applicationId, status) {
  return fetchWithMockFallback(`/manager/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function bulkUpdateApplications(applicationIds, action) {
  return fetchWithMockFallback(`/manager/applications/bulk-action`, {
    method: 'POST',
    body: JSON.stringify({ application_ids: applicationIds, action })
  });
}


// --- Mock Layer (for one-day build if backend is down) ---

const mockDatabase = new Map();

async function handleMockRequest(url, options) {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 800));

  if (url === '/loan/predict' && options.method === 'POST') {
    const data = JSON.parse(options.body);
    const id = `LA-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const res = {
      application_id: id,
      prediction: "approved",
      approval_probability: 0.85,
      recommendation: "strong_candidate",
      risk_level: "low",
      status: "AI_ASSESSED",
      message: "The application is a strong candidate for manager review."
    };
    mockDatabase.set(id, { ...data, ...res, applicant_name: data.applicant_name });
    return res;
  }

  if (url.startsWith('/applications/') && options.method === undefined) {
    const id = url.split('/').pop();
    const app = mockDatabase.get(id);
    if (app) return app;
    throw new Error('Application not found (mock)');
  }

  if (url.startsWith('/manager/applications') && (options.method === undefined || options.method === 'GET')) {
    return {
      applications: Array.from(mockDatabase.values())
    };
  }
  
  if (url.match(/\/manager\/applications\/[^\/]+\/status/) && options.method === 'PATCH') {
    const id = url.split('/')[3];
    const data = JSON.parse(options.body);
    const app = mockDatabase.get(id);
    if (app) {
      app.status = data.status;
      return { application_id: id, status: data.status, notification_created: true };
    }
    throw new Error('Not found (mock)');
  }
  
  if (url === '/manager/applications/bulk-action' && options.method === 'POST') {
    const data = JSON.parse(options.body);
    data.application_ids.forEach(id => {
      const app = mockDatabase.get(id);
      if (app) {
        // Map ACTION to STATUS
        if (data.action === 'SHORTLIST') app.status = 'SHORTLISTED';
        else if (data.action === 'REJECT') app.status = 'REJECTED';
        else if (data.action === 'REVIEW') app.status = 'UNDER_REVIEW';
      }
    });
    return { updated: data.application_ids.length, status: data.action === 'SHORTLIST' ? 'SHORTLISTED' : 'UPDATED' };
  }

  throw new Error(`Mock endpoint not implemented for ${options.method || 'GET'} ${url}`);
}

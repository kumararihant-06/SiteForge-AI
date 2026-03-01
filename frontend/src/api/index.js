import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

//To Automatically attach JWT token with every request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Auth APIs:
export const registerAPI = (data) => api.post("/auth/register",data);
export const loginAPI = (data) => api.post("/auth/login",data);
export const logoutAPI = () => api.post("/auth/logout");

//User APIs:
export const getProfileAPI = () => api.get("/users/profile");
export const getCreditsAPI = () => api.get("/users/credits");
export const updateNameAPI = (data) => api.put("/users/update-name",data);
export const updatePasswordAPI = (data) => api.put("/users/update-password", data);
export const deleteAccountAPI = () => api.delete("/users/delete-account");

//Project APIs:
export const createProjectAPI = (data) => api.post("/project/create", data)
export const getProjectsAPI = () => api.get("/projects/all-projects");
export const getSingleProjectsAPI = (id) => api.get(`/projects/all-projects/${id}`);
export const deleteProjectsAPI = (id) => api.delete(`/projects/all-projects/${id}`);
export const saveProjectAPI = (id,data) => api.put(`/projects/save/${id}`,data);
export const togglePublishAPI = (id) => api.put(`/projects/publish/${id}`);
export const makeRevisionAPI = (id,data) => api.post(`/projects/revision/${id}`,data);
export const rollbackAPI = (projectId, versionId) => api.get(`/projects/rollback/${projectId}/${versionId}`);

//Community APIs:
export const getPublishedProjectsAPI = () => api.get("/projects/published");
export const getPublishedProjectAPI = (id) => api.get(`/projects/published/${id}`);

//Payment APIs:
export const createOrderAPI = (data) => api.post("/payments/create-orders", data);
export const verifyPaymentAPI = (data) => api.post("/payments/verify", data);

